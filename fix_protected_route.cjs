const fs = require('fs');
let content = fs.readFileSync('src/components/ProtectedRoute.jsx', 'utf8');
content = content.replace(
  "const { session, isLoading, isHydrating } = useAximAuth();",
  "const { session, isLoading, isHydrating, isBackgroundSyncing } = useAximAuth();"
);

// We need to show a subtle non-blocking top progress bar or toast instead of replacing dashboard contents with GlobalLoader during background token re-validation.
// `isLoading` or `isHydrating` currently triggers the GlobalLoader.
// With stale-while-revalidate, the initial load still blocks, but we shouldn't block if we have a session and are just syncing. Actually, `isLoading` handles the initial load, and `isBackgroundSyncing` handles the sync. Since we don't trigger `isLoading` on background sync anyway, maybe we just need to add a top progress bar if `isBackgroundSyncing` is true.

const topBar = `
  const syncingBar = isBackgroundSyncing ? (
    <div className="fixed top-0 left-0 w-full h-1 bg-axim-purple/20 z-50 overflow-hidden">
      <div className="h-full bg-axim-purple animate-pulse w-1/3 rounded-r-full" />
    </div>
  ) : null;
`;

content = content.replace("return children;", topBar + "\n  return (\n    <>\n      {syncingBar}\n      {children}\n    </>\n  );");

fs.writeFileSync('src/components/ProtectedRoute.jsx', content);
