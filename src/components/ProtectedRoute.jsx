import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAximAuth } from '../hooks/useAximAuth';
import { useAximStore } from '../store/useAximStore';
import { logTelemetry } from '../lib/telemetry';
import GlobalLoader from './GlobalLoader';

export default function ProtectedRoute({ children }) {
  const { session, isLoading } = useAximAuth();
  const isWeb3Authenticated = useAximStore((state) => state.isWeb3Authenticated);
  const location = useLocation();

  const isAuthenticated = session || isWeb3Authenticated;

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        logTelemetry('vault_access_granted', { path: location.pathname });
      } else {
        logTelemetry('vault_access_denied', { path: location.pathname });
      }
    }
  }, [isAuthenticated, isLoading, location.pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] border border-white/5 flex items-center justify-center">
         <GlobalLoader loadingMessage="Authenticating Operator Credentials..." />
      </div>
    );
  }

  // Strict Token Hardening: Non-authenticated traffic is instantly dumped to access denied route
  if (!isAuthenticated) {
    return <Navigate to="/dashboard/access-denied" replace />;
  }

  return children;
}
