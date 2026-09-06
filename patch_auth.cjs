const fs = require('fs');

// Patch useAximAuth.js
let authContent = fs.readFileSync('src/hooks/useAximAuth.js', 'utf8');

// The original file sets setSession(null) if there's no offline cache for refreshing errors. We should be more resilient and not log out unless we're certain.
const target1 = `else {
              try { await supabase.auth.signOut(); } catch(e) { /* ignore */ }
              setSession(null);
              setProfile(null);
              // Avoid hard redirect, let router handle unauthorized state
            }`;

const replace1 = `else {
              // Instead of logging out when refresh fails temporarily (which causes UI flicker or boots user), we preserve the session to allow graceful degraded state unless forced.
              console.warn("Session refresh failed, but retaining session optimistically to avoid disrupting user workflow.");
              // Do not setSession(null) here.
            }`;

const target2 = `else {
              try { await supabase.auth.signOut(); } catch(e) { /* ignore */ }
              setSession(null);
              setProfile(null);
              // Avoid hard redirect
            }`;

const replace2 = `else {
              console.warn("Network exception during refresh, retaining session optimistically to avoid disrupting user workflow.");
            }`;

authContent = authContent.replace(target1, replace1).replace(target2, replace2);
fs.writeFileSync('src/hooks/useAximAuth.js', authContent);


// Patch DashboardAccessDenied.jsx
let accessDeniedContent = fs.readFileSync('src/components/DashboardAccessDenied.jsx', 'utf8');
const replaceAccessDenied = `import React from 'react';
import { Link } from 'react-router-dom';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'lucide-react';
import SEO from './SEO';

export default function DashboardAccessDenied() {
  return (
    <div className="w-full min-h-screen bg-[#050505] relative flex items-center justify-center p-6 z-10">
      <SEO title="Access Restricted | AXiM" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.05),transparent_50%)] pointer-events-none" />

      <div className="w-full max-w-lg bg-[#0A0A0A] border border-red-500/20 p-10 rounded-sm text-center shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50" />

        <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <SafeIcon icon={LuIcons.Lock} className="w-6 h-6 text-red-500" />
        </div>

        <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Restricted Node</h2>
        <p className="text-zinc-400 font-mono text-[0.65rem] uppercase tracking-widest leading-relaxed mb-8">
          Onyx administrative clearance required. Session might be pending re-validation or disconnected from uplink.
        </p>

        <div className="flex flex-col gap-3">
          <Link to="/auth" className="w-full py-4 bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-zinc-200 transition-colors rounded-sm flex items-center justify-center gap-2">
            <SafeIcon icon={LuIcons.Key} className="w-4 h-4" /> Authenticate
          </Link>
          <Link to="/" className="w-full py-4 bg-transparent border border-white/10 text-white font-black uppercase tracking-widest text-xs hover:bg-white/5 transition-colors rounded-sm">
            Return to Public Hub
          </Link>
        </div>
      </div>
    </div>
  );
}`;
fs.writeFileSync('src/components/DashboardAccessDenied.jsx', replaceAccessDenied);


// Patch ProtectedRoute.jsx
let protectedRouteContent = fs.readFileSync('src/components/ProtectedRoute.jsx', 'utf8');

const targetPR = `  if (!isAuthenticated) {
    // Preserve intended destination for post-login redirect
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }`;

const replacePR = `  if (!isAuthenticated) {
    if (isBackgroundSyncing) {
       // Graceful degraded viewing state
       return (
          <div className="min-h-screen bg-[#050505] flex items-center justify-center flex-col gap-4">
             <div className="w-8 h-8 rounded-full border-t-2 border-r-2 border-axim-purple animate-spin" />
             <p className="text-zinc-500 font-mono text-[0.65rem] uppercase tracking-widest">Re-establishing Uplink...</p>
          </div>
       );
    }
    // Preserve intended destination for post-login redirect
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }`;

protectedRouteContent = protectedRouteContent.replace(targetPR, replacePR);
fs.writeFileSync('src/components/ProtectedRoute.jsx', protectedRouteContent);
