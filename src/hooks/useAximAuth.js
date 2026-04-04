import { useEffect, useState } from 'react';
import { useActiveAccount } from "thirdweb/react";
import { localStore } from '../lib/persistence';

export function useAximAuth() {
  const account = useActiveAccount();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

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

      try {
        setLoading(true);

        // Immediately use Local Persistence for immediate functionality
        const localProfile = await localStore.getProfile(account.address);
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