import { useEffect, useState } from 'react';
import { useActiveAccount } from "thirdweb/react";
import { supabase } from '../supabase/supabase';
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
        
        // Try Supabase if keys exist
        const hasKeys = import.meta.env.VITE_SUPABASE_URL && 
                       import.meta.env.VITE_SUPABASE_URL !== 'your_supabase_url';

        if (hasKeys) {
          try {
            const { data, error } = await supabase
              .from('user_profiles_1774676062318')
              .select('*')
              .eq('wallet_address', account.address)
              .maybeSingle();

            if (data && isMounted) {
              setProfile({ ...data, is_mock: false });
              setLoading(false);
              return;
            }
          } catch (e) {
            console.warn("Supabase unreachable, using local vault.");
          }
        }

        // Always fallback to Local Persistence for immediate functionality
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