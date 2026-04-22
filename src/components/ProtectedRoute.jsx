import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAximStore } from '../store/useAximStore';
import { useAximAuth } from '../hooks/useAximAuth';

export default function ProtectedRoute({ children, allowedRoles = [], minimumTier = 0 }) {
  const userSession = useAximStore((state) => state.userSession);
  const { account, session, profile, loading } = useAximAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center font-mono text-zinc-500 uppercase tracking-widest text-xs">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-axim-gold rounded-full shadow-[0_0_8px_#ffea00] animate-pulse"></div>
          Authenticating...
        </div>
      </div>
    );
  }

  const isAuthenticated = !!(userSession || session || account);

  if (!isAuthenticated) {
    // Redirect them to the /profile page or wherever login is handled, but save the current location they were trying to go to
    return <Navigate to="/profile" state={{ from: location }} replace />;
  }

  // Check RBAC / minimum tier
  const userTier = profile?.clearance_level || (userSession?.is_premium ? 2 : 1);
  if (minimumTier > 0 && userTier < minimumTier) {
    // Redirect or render access denied
    return <Navigate to="/dashboard" replace />;
  }

  // Check allowed roles if specified
  if (allowedRoles.length > 0) {
    const userRole = profile?.role || userSession?.role || 'user';
    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
}
