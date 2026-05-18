import React from 'react';
import { Link } from 'react-router-dom';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';

export default function ProactiveBanner() {
  return (
    <div className="w-full bg-[#050505] border-y border-axim-purple/20 py-16 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-3/4 h-full bg-gradient-to-l from-axim-purple/10 to-transparent blur-[80px] pointer-events-none group-hover:from-axim-purple/20 transition-colors duration-700" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="w-full md:w-2/3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-axim-purple/10 border border-axim-purple/20 text-[0.65rem] font-mono uppercase tracking-widest text-axim-purple mb-4 rounded-sm">
            <SafeIcon icon={LuIcons.LuMail} className="w-3 h-3" />
            <span>Join The Network</span>
          </div>
          <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4 leading-tight">Priority Intelligence.</h3>
          <p className="text-zinc-400 text-sm md:text-base max-w-xl leading-relaxed">
            Subscribe to receive strategic blueprints, new software tool drops, and exclusive enterprise partner promos directly to your inbox.
          </p>
        </div>

        <div className="shrink-0 w-full md:w-auto md:text-right">
          <Link to="/early-access" className="w-full md:w-auto inline-flex justify-center items-center px-10 py-5 bg-axim-purple text-white font-black uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-colors shadow-[0_0_30px_rgba(147,51,234,0.2)]">
            Subscribe Now <SafeIcon icon={LuIcons.LuArrowRight} className="ml-3 w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
