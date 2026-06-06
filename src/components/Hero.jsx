import React from 'react';
import { Link } from 'react-router-dom';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';
import BackgroundEffects from './BackgroundEffects';

export default function Hero() {
  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-bg-void pt-20">
      <BackgroundEffects />
      
      {/* Absolute Centering Wrapper */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 flex flex-col items-center justify-center">

        {/* Status Badge */}
        <div className="flex items-center justify-center space-x-2 px-4 py-1.5 bg-white/5 border border-white/10 text-[0.65rem] font-mono uppercase tracking-widest text-zinc-400 mb-8 rounded-sm backdrop-blur-sm animate-fade-in-up">
          <div className="w-2 h-2 bg-axim-purple rounded-full animate-pulse" />
          <span>AXiM Network Active</span>
        </div>

        {/* Bulletproof Centered Headline */}
        {/* Using w-fit on the children forces the bounding box to match the text, allowing items-center to work perfectly */}
        <h1 className="flex flex-col items-center justify-center w-full text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[1.1] mb-6 animate-fade-in-up animation-delay-100 text-center">
          <span className="w-fit text-white text-center">Work</span>
          <span className="w-fit text-center text-transparent bg-clip-text bg-gradient-to-r from-axim-purple via-pink-500 to-[#DB2777] pb-2 mt-1">
            Smarter.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="w-full max-w-2xl mx-auto text-sm md:text-base text-zinc-400 leading-relaxed mb-10 font-bold animate-fade-in-up animation-delay-200 uppercase tracking-widest text-center">
          Articles, Ai Tools, & Learning Systems
        </p>

        {/* Updated CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full animate-fade-in-up animation-delay-300">
          <Link
            to="/tools"
            className="inline-flex items-center justify-center px-10 py-4 bg-axim-purple text-white text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-colors rounded-sm shadow-[0_0_30px_rgba(147,51,234,0.3)] w-full sm:w-auto text-center"
          >
            Ai Tools <SafeIcon icon={LuIcons.LuWrench} className="ml-3 w-4 h-4" />
          </Link>
          <Link
            to="/articles"
            className="inline-flex items-center justify-center px-10 py-4 bg-transparent border border-white/20 text-white text-xs font-black uppercase tracking-widest hover:bg-[#004040] hover:border-[#004040] transition-colors rounded-sm w-full sm:w-auto text-center"
          >
            Explore Articles <SafeIcon icon={LuIcons.LuBookOpen} className="ml-3 w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
