import { useState, useEffect } from 'react';

export function usePassport() {
  const [userSession, setUserSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function verifyPassport() {
      try {
        const response = await fetch('https://api.axim.us.com/v1/functions/passport-verify', {
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          if (isMounted) {
            setUserSession(data);
          }
        } else {
          if (isMounted) {
            setUserSession(null);
          }
        }
      } catch (error) {
        console.error("Passport Verification Error:", error);
        if (isMounted) {
          setUserSession(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    verifyPassport();

    return () => {
      isMounted = false;
    };
  }, []);

  return { userSession, loading };
}
