import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAximStore } from '../store/useAximStore';
import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAximAuth } from '../hooks/useAximAuth';

export default function ProtectedRoute({ children, allowedRoles = [], minimumTier = 0 }) {
  const userSession = useAximStore((state) => state.userSession);
  const { account, session, profile, loading } = useAximAuth();
  const location = useLocation();


  useEffect(() => {
    let timeoutId;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      // 15 minutes = 15 * 60 * 1000 = 900000ms
      timeoutId = setTimeout(async () => {
        await supabase.auth.signOut();
        useAximStore.setState({ userSession: null, profileData: null });
        alert("Session expired due to inactivity.");
        window.location.href = "/";
      }, 900000);
    };

    // Debounce listener to reduce excessive calls
    let debounceTimer;
    const handleActivity = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(resetTimer, 300);
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('scroll', handleActivity);

    resetTimer(); // Initialize

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(debounceTimer);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('scroll', handleActivity);
    };
  }, []);

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
