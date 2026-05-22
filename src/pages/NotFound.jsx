import React from 'react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';

export default function NotFound() {
  return (
    <div className="w-full min-h-[85vh] bg-bg-void relative z-10 flex flex-col items-center justify-center overflow-hidden pt-20">
      <SEO title="404 Signal Lost | AXiM Systems" noindex={true} />

      {/* Glitch Grid Background */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(219,39,119,0.05)_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-axim-purple/10 blur-[120px] pointer-events-none" />

      <div className="relative z-10 text-center px-6 max-w-2xl">
        <div className="w-24 h-24 bg-black border border-white/10 rounded flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(219,39,119,0.15)] relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#DB2777]" />
          <SafeIcon icon={LuIcons.LuWifiOff} className="w-10 h-10 text-zinc-500 animate-pulse" />
        </div>

        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white leading-none mb-4">
          Error <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DB2777] to-axim-purple">404</span>
        </h1>

        <div className="inline-flex items-center gap-3 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-sm mb-8">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
          <span className="text-[0.65rem] font-mono text-red-500 uppercase tracking-widest">Signal Lost // Node Not Found</span>
        </div>

        <p className="text-zinc-400 text-sm md:text-base leading-relaxed mb-10 font-mono">
          The requested endpoint does not exist within the active network topology. It may have been deprecated, encrypted, or moved to a secure vault.
        </p>

        <Link to="/" className="inline-flex items-center justify-center px-10 py-5 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-colors shadow-xl rounded-sm">
          Return to Global Hub <SafeIcon icon={LuIcons.LuArrowLeft} className="ml-3 w-4 h-4 rotate-180" />
        </Link>
      </div>
    </div>
  );
}
