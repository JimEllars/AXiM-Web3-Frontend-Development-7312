import { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase.js';
import { localStore } from '../lib/persistence.js';
import { useAximStore } from '../store/useAximStore.js';
import { checkPassportSsoSession } from '../lib/auth-handoff.js';
import { trackEvent } from '../lib/telemetry.js';

export function useAximAuth() {
  const [session, setSession] = useState(() => {
    if (typeof window === 'undefined') return null;
    const offline = localStore.getOfflineSession();
    if (offline && offline.timestamp && Date.now() - offline.timestamp < 15 * 60 * 1000) {
       return offline.session;
    }
    return null;
  });

  const [profile, setProfile] = useState(() => {
    if (typeof window === 'undefined') return null;
    const offline = localStore.getOfflineSession();
    if (offline && offline.timestamp && Date.now() - offline.timestamp < 15 * 60 * 1000) {
       return { email: offline.session?.user?.email, clearance_level: 1};
    }
    return null;
  });

  const [loading, setLoading] = useState(true);
  const [isHydrating, setIsHydrating] = useState(true);
  const [isBackgroundSyncing, setIsBackgroundSyncing] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);

  const isWeb3Authenticated = useAximStore((state) => state.isWeb3Authenticated);
  const isRefreshing = useRef(false);

  const checkDomain = async (currentSession) => {
    // Basic domain check, real logic would use secure server claims.
    if (currentSession && currentSession.user && currentSession.user.email) {
      if (!currentSession.user.email.endsWith('@axim.us.com')) {
        try {
          await supabase.auth.signOut();
        } catch (e) {
          // ignore signout errors if network is down
        }
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
trackEvent('auth_success', { method: 'offline_cache' });
           }
       }
    } else {
       // Attempt silent passport SSO auto-login
       checkPassportSsoSession().then((ssoData) => {
         if (isMounted && ssoData && ssoData.session) {
            setSession(ssoData.session);
            setProfile(ssoData.profile || { email: ssoData.session?.user?.email, clearance_level: 1 });
trackEvent('auth_success', { method: 'passport_sso' });
            const store = useAximStore.getState();
            if (store.setUserSession) store.setUserSession(ssoData.session); // Hydrate Zustand silently
         }
       }).catch(() => { /* Silent fail */ });
    }

    const initAuth = async () => {
      try {
        setIsBackgroundSyncing(true);
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        if (isMounted) {
          const isValid = await checkDomain(currentSession);
          if (isValid) {
            setSession(currentSession);
            localStore.saveOfflineSession(currentSession);
            if (currentSession) {
               setProfile({ email: currentSession.user.email, clearance_level: 1});
trackEvent('auth_success', { method: 'supabase' });
            }
          }
        }
      } catch (err) {
        // Fallback to offline session on network error
        if (isMounted) {
          const cachedSession = localStore.getOfflineSession();
          if (cachedSession && cachedSession.timestamp && Date.now() - cachedSession.timestamp < 15 * 60 * 1000) {
            setSession(cachedSession.session);
            if (cachedSession.session && cachedSession.session.user) {
               setProfile({ email: cachedSession.session.user.email, clearance_level: 1});
            }
          }
        }
      } finally {
        if (isMounted) {
          setIsBackgroundSyncing(false);
          setLoading(false);
          setIsHydrating(false);
        }
      }
    };

    initAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      if (isMounted && !isRefreshing.current) {
        setIsBackgroundSyncing(true);
        const isValid = await checkDomain(currentSession);
        setIsBackgroundSyncing(false);
        if (isValid) {
          setSession(currentSession);
          if (currentSession) {
              setProfile({ email: currentSession.user.email, clearance_level: 1});
              localStore.saveOfflineSession(currentSession);
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
      let fetchError = null;
      setIsReconnecting(true); // Non-blocking reconnect state

      while (retries > 0) {
        try {
          const { data, error } = await supabase.auth.getSession();
          if (error) throw error;
          currentSession = data?.session;
          break; // success
        } catch (err) {
          fetchError = err;
          retries -= 1;
          if (retries === 0) {
             console.warn("[AXiM_AUTH] Session fetch failed after retries.");
             trackEvent('edge_telemetry_warning', { reason: 'session_fetch_failed', error: fetchError?.message });
          } else {
             await new Promise(r => setTimeout(r, 1000)); // wait 1s before retry
          }
        }
      }

      setIsReconnecting(false);
      if (fetchError && !currentSession) {
        // Network fault during heartbeat: rely on cache
        const offline = localStore.getOfflineSession();
        if (offline && offline.timestamp && Date.now() - offline.timestamp < 15 * 60 * 1000) {
           if (isMounted) {
             setSession(offline.session);
             if (offline.session && offline.session.user) {
               setProfile({ email: offline.session.user.email, clearance_level: 1});
             }
           }
        }
        return;
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
              // Instead of logging out when refresh fails temporarily (which causes UI flicker or boots user), we preserve the session to allow graceful degraded state unless forced.
              console.warn("Session refresh failed, but retaining session optimistically to avoid disrupting user workflow.");
              trackEvent('edge_telemetry_warning', { reason: 'session_refresh_failed', error: error?.message });
              // Do not setSession(null) here.
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
              console.warn("Network exception during refresh, retaining session optimistically to avoid disrupting user workflow.");
              trackEvent('edge_telemetry_warning', { reason: 'session_refresh_exception', error: e?.message });
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

  return { profile, loading, isLoading: loading, isHydrating, session, checkDomain, isBackgroundSyncing, isReconnecting };
}
