const fs = require('fs');
let content = fs.readFileSync('src/hooks/useAximAuth.js', 'utf8');

content = content.replace(
"supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {",
`supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      if (isMounted) {
        setIsBackgroundSyncing(true);
        const isValid = await checkDomain(currentSession);
        setIsBackgroundSyncing(false);
        if (isValid) {
          setSession(currentSession);
          localStore.saveOfflineSession(currentSession);
          if (currentSession) {
             setProfile({ email: currentSession.user.email, clearance_level: 1, transactions: MOCK_ON_CHAIN_ACTIVITY });
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
    });`
);
fs.writeFileSync('src/hooks/useAximAuth.js', content);
