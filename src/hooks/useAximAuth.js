import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.js';

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
          if (currentSession) {
             setProfile({ email: currentSession.user.email, clearance_level: 1 });
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
              setProfile({ email: currentSession.user.email, clearance_level: 1 });
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
            await supabase.auth.signOut();
            setSession(null);
            setProfile(null);
            window.location.href = "/profile";
          }
        } catch (e) {
          console.error("Heartbeat error", e);
        }
      }
    }, 5 * 60 * 1000);
    return () => { isMounted = false; clearInterval(heartbeatInterval); };
  }, []);

  return { profile, loading, session };
}
