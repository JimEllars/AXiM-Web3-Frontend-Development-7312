import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAximAuth } from '../hooks/useAximAuth';
import { useAximStore } from '../store/useAximStore';
import { logTelemetry } from '../lib/telemetry';

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
      <div className="min-h-screen bg-bg-void flex items-center justify-center font-mono text-zinc-500 text-xs uppercase tracking-widest">
         Authenticating Operator Credentials...
      </div>
    );
  }

  // Strict Token Hardening: Non-authenticated traffic is instantly dumped to access denied route
  if (!isAuthenticated) {
    return <Navigate to="/dashboard/access-denied" replace />;
  }

  return children;
}
