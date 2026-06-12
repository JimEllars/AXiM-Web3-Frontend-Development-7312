import React from 'react';
import { Link } from 'react-router-dom';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';
import SEO from './SEO';

export default function DashboardAccessDenied() {
  return (
    <div className="w-full min-h-screen bg-bg-void relative flex items-center justify-center p-6 z-10">
      <SEO title="Access Restricted | AXiM" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.05),transparent_50%)] pointer-events-none" />

      <div className="w-full max-w-lg bg-[#050505] border border-red-500/20 p-10 rounded-sm text-center shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50" />

        <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <SafeIcon icon={LuIcons.LuLock} className="w-6 h-6 text-red-500" />
        </div>

        <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Clearance Required</h2>
        <p className="text-zinc-400 font-mono text-[0.65rem] uppercase tracking-widest leading-relaxed mb-8">
          The requested operational vault requires an active authentication token. Please log in or return to the public network grid.
        </p>

        <div className="flex flex-col gap-3">
          <button className="w-full py-4 bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-zinc-200 transition-colors rounded-sm flex items-center justify-center gap-2">
            <SafeIcon icon={LuIcons.LuKey} className="w-4 h-4" /> Authenticate
          </button>
          <Link to="/" className="w-full py-4 bg-transparent border border-white/10 text-white font-black uppercase tracking-widest text-xs hover:bg-white/5 transition-colors rounded-sm">
            Return to Public Hub
          </Link>
        </div>
      </div>
    </div>
  );
}
