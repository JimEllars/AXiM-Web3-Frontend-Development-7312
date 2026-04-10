import { useEffect, useState } from 'react';
import { useActiveAccount } from "thirdweb/react";
import { localStore } from '../lib/persistence';

export function useAximAuth() {
  const account = useActiveAccount();
  const [profile, setProfile] = useState(() => {
    return account?.address ? localStore.getProfile(account.address) : null;
  });
  const [loading, setLoading] = useState(() => !account?.address);

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
      } catch (err) {
        console.error("Auth Sync Error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    syncIdentity();
    return () => { isMounted = false; };
  }, [account?.address]);

  return { account, profile, loading };
}