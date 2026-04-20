import { useEffect, useState } from 'react';
import { useActiveAccount } from "thirdweb/react";
import { signMessage } from "thirdweb/utils";
import { localStore } from '../lib/persistence.js';

export function useAximAuth() {
  const account = useActiveAccount();
  const [profile, setProfile] = useState(null);
  // Ensure we indicate loading while we are initially fetching the profile
  const [loading, setLoading] = useState(true);
  const [siweSignature, setSiweSignature] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function syncIdentity() {
      if (!account?.address) {
        if (isMounted) {
          setProfile(null);
          setLoading(false);
        }
        return;
      }

      // Avoid redundant sync if already loaded for this address
      if (profile?.wallet_address === account.address) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Yield to browser to allow UI updates (like loading spinner) before synchronous persistence read
        await Promise.resolve();

        // Immediately use Local Persistence for immediate functionality
        const localProfile = localStore.getProfile(account.address);
        if (isMounted) {
          setProfile(localProfile);
        }

        // SIWE Foundation Draft
        if (!siweSignature && isMounted && account.signMessage) {
            try {
                const message = `Sign-in to AXiM Ecosystem\n\nAddress: ${account.address}\nNonce: ${Math.floor(Math.random() * 1000000)}`;
                // Prompt user to sign
                const signature = await account.signMessage({ message });
                if (isMounted) {
                    setSiweSignature(signature);
                    console.log("SIWE Signature:", signature);
                    // TODO: Send signature to /v1/functions/auth-verify to receive JWT
                }
            } catch (signErr) {
                console.error("SIWE Signature Error:", signErr);
            }
        }

      } catch (err) {
        console.error("Auth Sync Error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    syncIdentity();
    return () => { isMounted = false; };
  }, [account?.address, account?.signMessage, siweSignature]);

  return { account, profile, loading, siweSignature };
}