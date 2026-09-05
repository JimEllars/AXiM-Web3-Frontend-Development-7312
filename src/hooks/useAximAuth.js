import { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase.js';
import { localStore } from '../lib/persistence.js';
import { useAximStore } from '../store/useAximStore.js';
import { checkPassportSsoSession } from '../lib/auth-handoff.js';

export function useAximAuth() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isHydrating, setIsHydrating] = useState(true);
  const [session, setSession] = useState(null);
  const [isBackgroundSyncing, setIsBackgroundSyncing] = useState(false);

  const isWeb3Authenticated = useAximStore((state) => state.isWeb3Authenticated);
  const isRefreshing = useRef(false);

  const checkDomain = async (currentSession) => {
    // Basic domain check, real logic would use secure server claims.
    if (currentSession && currentSession.user && currentSession.user.email) {
      if (!currentSession.user.email.endsWith('@axim.us.com')) {
        await supabase.auth.signOut();
        setSession(null);
        setProfile(null);
        console.warn('Forbidden: Internal Access Only');
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    let isMounted = true;

    // Fast-path rehydration before network call to prevent race condition
    // between Thirdweb wallet connection and Supabase auth state
    const offline = localStore.getOfflineSession();
    if (offline && offline.timestamp && Date.now() - offline.timestamp < 15 * 60 * 1000) {
       if (isMounted) {
           setSession(offline.session);
           if (offline.session && offline.session.user) {
               setProfile({ email: offline.session.user.email, clearance_level: 1});
           }
       }
    } else {
       // Attempt silent passport SSO auto-login
       checkPassportSsoSession().then((ssoData) => {
         if (isMounted && ssoData && ssoData.session) {
            setSession(ssoData.session);
            setProfile(ssoData.profile || { email: ssoData.session?.user?.email, clearance_level: 1 });
            const store = useAximStore.getState();
            if (store.setUserSession) store.setUserSession(ssoData.session); // Hydrate Zustand silently
         }
       }).catch(() => { /* Silent fail */ });
    }

    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      if (isMounted) {
        setIsBackgroundSyncing(true);
        const isValid = await checkDomain(currentSession);
        setIsBackgroundSyncing(false);
        if (isValid) {
          setSession(currentSession);
          localStore.saveOfflineSession(currentSession);
          if (currentSession) {
             setProfile({ email: currentSession.user.email, clearance_level: 1});
          }
        }
        setLoading(false);
        setIsHydrating(false);
      }
    }).catch((err) => {
      // In case of 500 error or similar
      if (isMounted) {
        // We already checked offline cache above, so if it failed just finish loading
        setLoading(false);
        setIsHydrating(false);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      if (isMounted && !isRefreshing.current) {
        setIsBackgroundSyncing(true);
        const isValid = await checkDomain(currentSession);
        setIsBackgroundSyncing(false);
        if (isValid) {
          setSession(currentSession);
          if (currentSession) {
              setProfile({ email: currentSession.user.email, clearance_level: 1});
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

      const currentWeb3State = useAximStore.getState().isWeb3Authenticated;
      if (currentWeb3State) return;

      // Retry mechanism for connection hiccups
      let currentSession = null;
      let retries = 3;
      while (retries > 0) {
        try {
          const { data } = await supabase.auth.getSession();
          currentSession = data?.session;
          break; // success
        } catch (err) {
          retries -= 1;
          if (retries === 0) {
             console.warn("[AXiM_AUTH] Session fetch failed after retries.");
          } else {
             await new Promise(r => setTimeout(r, 1000)); // wait 1s before retry
          }
        }
      }
      if (currentSession) {
        try {
          isRefreshing.current = true;
          setIsBackgroundSyncing(true);
          const { data, error } = await supabase.auth.refreshSession();
          if (error || !data.session) {
            const offline = localStore.getOfflineSession();
            if (offline && offline.timestamp && Date.now() - offline.timestamp < 15 * 60 * 1000) {
              console.warn("Retaining session optimistically due to recent offline stamp");
              setSession(offline.session);
            } else {
              await supabase.auth.signOut();
              setSession(null);
              setProfile(null);
              // Avoid hard redirect, let router handle unauthorized state
            }
          } else if (data.session) {
            localStore.saveOfflineSession(data.session);
            // Don't call setSession/setProfile here to avoid UI flicker
            // The onAuthStateChange will catch it if needed, or we just trust the token updated
          }
        } catch (e) {
            const isNetworkError = e.message === 'Failed to fetch' || !navigator.onLine;
            const offline = localStore.getOfflineSession();

            if (isNetworkError && offline && offline.timestamp && Date.now() - offline.timestamp < 15 * 60 * 1000) {
              console.warn("Retaining session optimistically due to network fault");
              setSession(offline.session);
            } else if (offline && offline.timestamp && Date.now() - offline.timestamp < 15 * 60 * 1000) {
              console.warn("Retaining session optimistically after exception");
              setSession(offline.session);
            } else {
              await supabase.auth.signOut();
              setSession(null);
              setProfile(null);
              // Avoid hard redirect
            }
        } finally {
            isRefreshing.current = false;
            setIsBackgroundSyncing(false);
        }
      } else {
         const offline = localStore.getOfflineSession();
         if (offline && offline.timestamp && Date.now() - offline.timestamp < 15 * 60 * 1000) {
           setSession(offline.session);
           if (offline.session && offline.session.user) {
             setProfile({ email: offline.session.user.email, clearance_level: 1});
           }
         }
      }
    }, 5 * 60 * 1000);
    return () => { isMounted = false; clearInterval(heartbeatInterval); };
  }, []);

  // Make sure loading resolves fast if Web3 is authenticated
  useEffect(() => {
      if (isWeb3Authenticated && loading) {
          setLoading(false);
          setIsHydrating(false);
      }
  }, [isWeb3Authenticated, loading]);

  return { profile, loading, isLoading: loading, isHydrating, session, checkDomain, isBackgroundSyncing };
}
