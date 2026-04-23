import { useEffect, useState } from 'react';
import { useActiveAccount } from "thirdweb/react";
import { localStore } from '../lib/persistence.js';
import { supabase } from '../lib/supabase.js';

export function useAximAuth() {
  const account = useActiveAccount();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [siweSignature, setSiweSignature] = useState(null);
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

    // Supabase Session Tracking
    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      if (isMounted) {
        const isValid = await checkDomain(currentSession);
        if (isValid) {
          setSession(currentSession);
          if (currentSession && !account?.address) {
             setProfile({ email: currentSession.user.email, clearance_level: 1 });
          }
        }
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      if (isMounted) {
        const isValid = await checkDomain(currentSession);
        if (isValid) {
          setSession(currentSession);
          if (currentSession && !account?.address) {
              setProfile({ email: currentSession.user.email, clearance_level: 1 });
          } else if (!currentSession && !account?.address) {
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
  }, [account?.address]);

  useEffect(() => {
    let isMounted = true;

    async function syncIdentity() {
      // If Web3 is active, sync Web3 profile
      if (account?.address) {
        if (profile?.wallet_address === account.address) {
          if (isMounted) setLoading(false);
          return;
        }

        try {
          setLoading(true);
          await Promise.resolve();

          const localProfile = localStore.getProfile(account.address);
          if (isMounted) {
            setProfile(localProfile);
          }

          // Use optional chaining or defaults if env not available fully in tests
          let isWeb3Enabled = false;
          try {
             isWeb3Enabled = import.meta.env.VITE_ENABLE_WEB3 === 'true';
          } catch (e) { /* ignore */ }

          if (isWeb3Enabled && !siweSignature && isMounted && account.signMessage) {
              try {
                  const message = `Sign-in to AXiM Ecosystem\n\nAddress: ${account.address}\nNonce: ${Math.floor(Math.random() * 1000000)}`;
                  const signature = await account.signMessage({ message });
                  if (isMounted) {
                      setSiweSignature(signature);

                      try {
                          const response = await fetch('https://api.axim.us.com/v1/functions/auth-verify', {
                              method: 'POST',
                              headers: {
                                  'Content-Type': 'application/json',
                              },
                              body: JSON.stringify({
                                  address: account.address,
                                  message: message,
                                  signature: signature,
                              })
                          });

                          if (response.ok) {
                              const data = await response.json();
                              if (data.token) {
                                  // Attempt to set Supabase session if token is provided
                                  await supabase.auth.setSession({
                                      access_token: data.token,
                                      refresh_token: data.refresh_token || ''
                                  });
                              }
                          }
                      } catch (verifyErr) {
                          console.error("SIWE backend verification error:", verifyErr);
                      }
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
      } else {
        // Not Web3, rely on Supabase session fetched in the other useEffect
        if (isMounted) {
            if (!session) {
                setProfile(null);
            }
            setLoading(false);
        }
      }
    }

    syncIdentity();

    // Session Heartbeat
    const heartbeatInterval = setInterval(async () => {
      if (!isMounted) return;

      const { data: { session: currentSession } } = await supabase.auth.getSession();

      if (currentSession) {
        try {
          const { data, error } = await supabase.auth.refreshSession();
          if (error || !data.session) {
            console.error("Session heartbeat failed, revoking access", error);
            await supabase.auth.signOut();
            setSession(null);
            setProfile(null);
            alert("Your session has expired. Please log in again."); // Using alert/toast fallback
            window.location.href = "/profile";
          }
        } catch (e) {
          console.error("Heartbeat error", e);
        }
      }
    }, 5 * 60 * 1000); // 5 minutes
    return () => { isMounted = false; clearInterval(heartbeatInterval); };
  }, [account?.address, account?.signMessage, siweSignature, profile?.wallet_address, session]);

  return { account, profile, loading, siweSignature, session };
}
