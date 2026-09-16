import GlobalLoader from './GlobalLoader';
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAximAuth } from '../hooks/useAximAuth';
import { useAximStore } from '../store/useAximStore';
import { logTelemetry } from '../lib/telemetry';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { session, isLoading, isHydrating, isBackgroundSyncing, isReconnecting } = useAximAuth();
  const isWeb3Authenticated = useAximStore((state) => state.isWeb3Authenticated);
  const location = useLocation();

  const isAuthenticated = session || isWeb3Authenticated;

  // Note: For a real system we would verify roles via JWT claims or a DB call.
  // For now, if adminOnly is true but we only have a general session, we block.
  // We'll mock role checking with an email condition for demonstration,
  // or default to true if we just need them authenticated.
  const isRoleAuthorized = adminOnly ? session?.user?.email?.includes('@axim.us.com') : true;

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && isRoleAuthorized) {
        logTelemetry('vault_access_granted', { path: location.pathname });
      } else {
        logTelemetry('vault_access_denied', { path: location.pathname, reason: !isAuthenticated ? 'unauthenticated' : 'unauthorized_role' });
      }
    }
  }, [isAuthenticated, isRoleAuthorized, isLoading, location.pathname]);

  if (isLoading || isHydrating) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <GlobalLoader />
      </div>
    );
  }

  if (!isAuthenticated) {
    if (isReconnecting || isHydrating || isLoading) {
      return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center flex-col gap-4">
          <div className="w-8 h-8 rounded-full border-t-2 border-r-2 border-axim-purple animate-spin" />
          <p className="text-zinc-500 font-mono text-[0.65rem] uppercase tracking-widest">Re-establishing Uplink...</p>
        </div>
      );
    }
    if (isReconnecting || isHydrating || isLoading) {
      return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center flex-col gap-4">
          <div className="w-8 h-8 rounded-full border-t-2 border-r-2 border-axim-purple animate-spin" />
          <p className="text-zinc-500 font-mono text-[0.65rem] uppercase tracking-widest">Re-establishing Uplink...</p>
        </div>
      );
    }
    if (isReconnecting) {
      // Graceful degraded state while attempting to reconnect silently
      return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center flex-col gap-4">
          <div className="w-8 h-8 rounded-full border-t-2 border-r-2 border-axim-purple animate-spin" />
          <p className="text-zinc-500 font-mono text-[0.65rem] uppercase tracking-widest">Re-establishing Uplink...</p>
        </div>
      );
    }
        // Preserve intended destination for post-login redirect
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (adminOnly && !isRoleAuthorized) {
    return <Navigate to="/dashboard/access-denied" replace />;
  }


  const syncingBar = isBackgroundSyncing ? (
    <div className="fixed top-0 left-0 w-full h-1 bg-axim-purple/20 z-50 overflow-hidden">
      <div className="h-full bg-axim-purple animate-pulse w-1/3 rounded-r-full" />
    </div>
  ) : null;

  return (
    <>
      {syncingBar}
      {children}
    </>
  );
}
