import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.js';
import { localStore } from '../lib/persistence.js';

const MOCK_ON_CHAIN_ACTIVITY = [
  { hash: "0x1a2b...3c4d", type: "Contract Interaction", timestamp: "2 mins ago" },
  { hash: "0x9f8e...7d6c", type: "Asset Transfer", timestamp: "1 hour ago" },
  { hash: "0x5a4b...3c2d", type: "Protocol Upgrade", timestamp: "1 day ago" }
];

export function useAximAuth() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  const checkDomain = async (currentSession) => {
    if (currentSession && currentSession.user && currentSession.user.email) {
      if (!currentSession.user.email.endsWith('@axim.us.com')) {
        await supabase.auth.signOut();
        setSession(null);
        setProfile(null);
        alert("Forbidden: Internal Access Only");
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      if (isMounted) {
        const isValid = await checkDomain(currentSession);
        if (isValid) {
          setSession(currentSession);
          localStore.saveOfflineSession(currentSession);
          if (currentSession) {
             setProfile({ email: currentSession.user.email, clearance_level: 1, transactions: MOCK_ON_CHAIN_ACTIVITY });
          }
        }
        setLoading(false);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      if (isMounted) {
        const isValid = await checkDomain(currentSession);
        if (isValid) {
          setSession(currentSession);
          if (currentSession) {
              setProfile({ email: currentSession.user.email, clearance_level: 1, transactions: MOCK_ON_CHAIN_ACTIVITY });
          } else {
              setProfile(null);
          }
        }
      }
    });

    return () => {
      isMounted = false;
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const heartbeatInterval = setInterval(async () => {
      if (!isMounted) return;
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      if (currentSession) {
        try {
          const { data, error } = await supabase.auth.refreshSession();
          if (error || !data.session) {
            // Check if it's a network error (like 5xx) where error might not be a clean invalid session
            // Or use the offline session fallback
            const offline = localStore.getOfflineSession();
            if (offline && offline.timestamp && Date.now() - offline.timestamp < 15 * 60 * 1000) {
              // Optimistically retain
              console.warn("Retaining session optimistically due to recent offline stamp");
              return;
            }
            await supabase.auth.signOut();
            setSession(null);
            setProfile(null);
            window.location.href = "/profile";
          } else if (data.session) {
            localStore.saveOfflineSession(data.session);
          }
        } catch (e) {
            // Network failure during refresh
            const offline = localStore.getOfflineSession();
            if (offline && offline.timestamp && Date.now() - offline.timestamp < 15 * 60 * 1000) {
              // Optimistically retain
              console.warn("Retaining session optimistically after exception");
              return;
            }
            await supabase.auth.signOut();
            setSession(null);
            setProfile(null);
            window.location.href = "/profile";
        }
      } else {
         // Also check on mount / if null
         const offline = localStore.getOfflineSession();
         if (offline && offline.timestamp && Date.now() - offline.timestamp < 15 * 60 * 1000) {
           setSession(offline.session);
           if (offline.session && offline.session.user) {
             setProfile({ email: offline.session.user.email, clearance_level: 1, transactions: MOCK_ON_CHAIN_ACTIVITY });
           }
         }
      }
    }, 5 * 60 * 1000);
    return () => { isMounted = false; clearInterval(heartbeatInterval); };
  }, []);

  return { profile, loading, isLoading: loading, session };
}
