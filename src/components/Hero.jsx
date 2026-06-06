import React from 'react';
import { Link } from 'react-router-dom';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';
import BackgroundEffects from './BackgroundEffects';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-bg-void pt-20">
      <BackgroundEffects />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full flex flex-col items-center text-center">
        {/* Status Badge */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/5 border border-white/10 text-[0.65rem] font-mono uppercase tracking-widest text-zinc-400 mb-8 rounded-sm backdrop-blur-sm animate-fade-in-up">
          <div className="w-2 h-2 bg-axim-purple rounded-full animate-pulse" />
          <span>AXiM Network Active</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter text-white leading-tight mb-8 animate-fade-in-up animation-delay-100 flex flex-col items-center justify-center text-center">
          <span>Work</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-axim-purple via-pink-500 to-[#DB2777]">
            Smarter.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="max-w-2xl text-sm md:text-base text-zinc-400 leading-relaxed mb-12 font-medium animate-fade-in-up animation-delay-200">
          Architecting decentralized infrastructure, visual automation frameworks, and custom AI systems to eliminate operational friction and scale enterprise revenue.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-fade-in-up animation-delay-300">
          <Link
            to="/consultation"
            className="inline-flex items-center justify-center px-8 py-4 bg-axim-purple text-white text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-colors rounded-sm shadow-[0_0_30px_rgba(147,51,234,0.3)]"
          >
            Initiate Protocol <SafeIcon icon={LuIcons.LuArrowRight} className="ml-2 w-4 h-4" />
          </Link>
          <Link
            to="/tools"
            className="inline-flex items-center justify-center px-8 py-4 bg-transparent border border-white/20 text-white text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-colors rounded-sm"
          >
            Explore Systems
          </Link>
        </div>
      </div>
    </section>
  );
}
