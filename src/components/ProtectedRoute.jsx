import GlobalLoader from './GlobalLoader';
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAximAuth } from '../hooks/useAximAuth';
import { useAximStore } from '../store/useAximStore';
import { logTelemetry } from '../lib/telemetry';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { session, isLoading, isHydrating, isBackgroundSyncing, isReconnecting } = useAximAuth();
  const isWeb3Authenticated = useAximStore((state) => state.isWeb3Authenticated);
  const location = useLocation();

  const [gracePeriodActive, setGracePeriodActive] = useState(true);

  useEffect(() => {
    let timer;
    if (!isLoading && !isHydrating) {
      timer = setTimeout(() => {
        setGracePeriodActive(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [isLoading, isHydrating]);

  const isAuthenticated = session || isWeb3Authenticated;

  const isRoleAuthorized = adminOnly ? session?.user?.email?.includes('@axim.us.com') : true;

  useEffect(() => {
    if (!isLoading && !gracePeriodActive) {
      if (isAuthenticated && isRoleAuthorized) {
        logTelemetry('vault_access_granted', { path: location.pathname });
      } else {
        logTelemetry('vault_access_denied', { path: location.pathname, reason: !isAuthenticated ? 'unauthenticated' : 'unauthorized_role' });
      }
    }
  }, [isAuthenticated, isRoleAuthorized, isLoading, gracePeriodActive, location.pathname]);

  if (isLoading || isHydrating || (gracePeriodActive && !isAuthenticated)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <GlobalLoader loadingMessage="Hydrating Session Data..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    if (isReconnecting || isHydrating || isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <GlobalLoader loadingMessage="Re-establishing Uplink..." />
        </div>
      );
    }
    return <Navigate to={`/auth${location.search ? location.search : ''}`} state={{ from: location }} replace />;
  }

  if (adminOnly && !isRoleAuthorized) {
    return (
        <div className="min-h-screen flex items-center justify-center flex-col">
            <span className="text-red-500 border border-red-500/50 bg-red-500/10 px-3 py-1 text-xs font-mono mb-4 rounded">OFFLINE/DEGRADED MODE - READ ONLY</span>
            <Navigate to="/dashboard/access-denied" replace />
        </div>
    );
  }


  const syncingBar = isBackgroundSyncing ? (
    <div className="fixed top-0 left-0 w-full h-1 bg-axim-purple/20 z-50 overflow-hidden">
      <div className="h-full bg-axim-purple animate-pulse w-1/3 rounded-r-full" />
    </div>
  ) : null;

  return (
    <>
      {syncingBar}
      {isReconnecting && (
         <div className="fixed top-2 right-2 z-50 bg-amber-500/10 border border-amber-500/30 text-amber-500 text-[10px] uppercase font-mono px-2 py-1 rounded">
             Degraded / Offline Mode
         </div>
      )}
      {children}
    </>
  );
}
