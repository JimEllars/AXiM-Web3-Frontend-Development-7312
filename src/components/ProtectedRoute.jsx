import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAximAuth } from '../hooks/useAximAuth';
import { useAximStore } from '../store/useAximStore';
import { logTelemetry } from '../lib/telemetry';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { session, isLoading, isHydrating } = useAximAuth();
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
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
         <div className="flex flex-col items-center gap-4">
             <div className="flex gap-2">
                <div className="w-2 h-2 bg-axim-purple/50 animate-pulse rounded-full" />
                <div className="w-2 h-2 bg-axim-purple animate-pulse rounded-full animation-delay-200" />
                <div className="w-2 h-2 bg-white/80 animate-pulse rounded-full animation-delay-400" />
             </div>
             <p className="text-zinc-500 font-mono text-[0.65rem] uppercase tracking-widest">Validating Clearance Matrix...</p>
         </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Preserve intended destination for post-login redirect
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (adminOnly && !isRoleAuthorized) {
    return <Navigate to="/dashboard/access-denied" replace />;
  }

  return children;
}
