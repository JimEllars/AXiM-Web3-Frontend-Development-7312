import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAximAuth } from '../hooks/useAximAuth';

export default function ProtectedRoute({ children }) {
  const { session, loading } = useAximAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-void flex items-center justify-center font-mono text-zinc-500 text-xs uppercase tracking-widest">
         Authenticating Operator Credentials...
      </div>
    );
  }

  // Strict Token Hardening: Non-authenticated traffic is instantly dumped to access denied route
  if (!session) {
    return <Navigate to="/dashboard/access-denied" replace />;
  }

  return children;
}
