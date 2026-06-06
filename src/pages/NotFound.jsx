import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';
import BackgroundEffects from '../components/BackgroundEffects';

export default function NotFound() {
  return (
    <div className="w-full min-h-screen bg-bg-void relative flex flex-col items-center justify-center overflow-hidden">
      <SEO title="Signal Lost | AXiM Systems" description="The requested protocol could not be located." />
      <BackgroundEffects />

      <div className="relative z-10 w-full max-w-3xl mx-auto px-6 text-center animate-fade-in-up">
        <div className="w-20 h-20 bg-red-500/10 border border-red-500/30 flex items-center justify-center rounded-sm mx-auto mb-8 shadow-[0_0_40px_rgba(239,68,68,0.2)]">
           <SafeIcon icon={LuIcons.LuTerminal} className="w-10 h-10 text-red-500" />
        </div>

        <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-white leading-none mb-4">
          Error <span className="text-red-500">404</span>
        </h1>
        <p className="text-zinc-400 font-mono text-sm uppercase tracking-widest mb-12">
          [ Protocol Unreachable // Signal Lost ]
        </p>

        <p className="text-zinc-500 text-sm max-w-xl mx-auto mb-12 leading-relaxed">
          The routing node you are attempting to access does not exist or has been deprecated. Please return to the primary network grid or initialize a direct support protocol.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-8 py-4 bg-axim-purple text-white text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-colors rounded-sm w-full sm:w-auto"
          >
            Return to Core <SafeIcon icon={LuIcons.LuArrowLeft} className="ml-3 w-4 h-4" />
          </Link>
          <a
            href="https://quickdemandletter.com/start" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-4 bg-transparent border border-white/20 text-white text-xs font-black uppercase tracking-widest hover:bg-[#004040] hover:border-[#004040] transition-colors rounded-sm w-full sm:w-auto"
          >
            Quick Demand Letter <SafeIcon icon={LuIcons.LuArrowUpRight} className="ml-3 w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
