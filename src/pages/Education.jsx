import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';
import { logTelemetry } from '../lib/telemetry';

export default function Education() {
  const handleAcademyClick = (trackName, url) => {
    logTelemetry('academy_funnel_click', { track: trackName });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full bg-[#050505] min-h-screen text-white font-sans overflow-x-hidden pt-24 pb-24">
      {/* Hero Section */}
      <section className="w-full max-w-7xl mx-auto px-6 lg:px-8 mb-24 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.1),transparent_70%)] pointer-events-none z-0" />

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center justify-center mb-6">
            <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] uppercase tracking-[0.2em] rounded-sm flex items-center gap-2">
              <SafeIcon icon={LuIcons.LuGraduationCap} className="w-3.5 h-3.5" />
              Ecosystem Discovery
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter mb-6 text-white drop-shadow-md">
            AXiM Education Network
          </h1>

          <p className="text-lg md:text-xl text-zinc-400 font-medium mb-8 max-w-2xl mx-auto leading-relaxed">
            From K-12 Foundations to Enterprise Systems Architecture. Build your capabilities through our progressive learning tracks and professional certifications.
          </p>
        </div>
      </section>

      {/* 3-Column Grid */}
      <section className="w-full max-w-7xl mx-auto px-6 lg:px-8 relative z-10 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">

          {/* Track 1: Foundation */}
          <div className="flex flex-col bg-[#050505] border border-white/10 rounded-sm p-8 hover:border-emerald-500/50 transition-all duration-300 group shadow-xl hover:bg-white/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <SafeIcon icon={LuIcons.LuBookOpen} className="w-10 h-10 text-emerald-500 mb-6" />
            <h3 className="text-xl font-black uppercase tracking-wider mb-2 text-white">Foundation (K-12 & ESL)</h3>
            <p className="text-xs text-emerald-400 font-mono tracking-widest uppercase mb-4">Open Access / Community Subsidized</p>
            <p className="text-sm text-zinc-400 mb-8 font-medium flex-1">
              Core academic fundamentals, language acquisition, and essential life skills designed to create a strong baseline for future development.
            </p>
            <button
              onClick={() => handleAcademyClick('Foundation', 'https://academy.axim.us.com/?category=Foundation')}
              className="mt-auto flex items-center justify-between w-full px-4 py-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-colors group/btn"
            >
              <span>Explore Track</span>
              <SafeIcon icon={LuIcons.LuExternalLink} className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
            </button>
          </div>

          {/* Track 2: Creative Labs */}
          <div className="flex flex-col bg-[#050505] border border-white/10 rounded-sm p-8 hover:border-cyan-500/50 transition-all duration-300 group shadow-xl hover:bg-white/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <SafeIcon icon={LuIcons.LuGamepad2} className="w-10 h-10 text-cyan-500 mb-6" />
            <h3 className="text-xl font-black uppercase tracking-wider mb-2 text-white">Creative Labs</h3>
            <p className="text-xs text-cyan-400 font-mono tracking-widest uppercase mb-4">STEM & Technical Systems</p>
            <p className="text-sm text-zinc-400 mb-8 font-medium flex-1">
              Game development, introductory logic, and foundational systems engineering. Bridge the gap between theory and digital creation.
            </p>
            <button
              onClick={() => handleAcademyClick('Creative Labs', 'https://academy.axim.us.com/?category=Creative')}
              className="mt-auto flex items-center justify-between w-full px-4 py-3 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-widest hover:bg-cyan-500 hover:text-black transition-colors group/btn"
            >
              <span>Explore Track</span>
              <SafeIcon icon={LuIcons.LuExternalLink} className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
            </button>
          </div>

          {/* Track 3: Professional Edge */}
          <div className="flex flex-col bg-[#050505] border border-white/10 rounded-sm p-8 hover:border-axim-purple/50 transition-all duration-300 group shadow-xl hover:bg-white/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-axim-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <SafeIcon icon={LuIcons.LuBriefcase} className="w-10 h-10 text-axim-purple mb-6" />
            <h3 className="text-xl font-black uppercase tracking-wider mb-2 text-white">Professional Edge</h3>
            <p className="text-xs text-axim-purple font-mono tracking-widest uppercase mb-4">Enterprise Certification</p>
            <p className="text-sm text-zinc-400 mb-8 font-medium flex-1">
              Advanced B2B operations, CRM mastery, and enterprise automation. Equip yourself with the skills to architect and scale modern digital businesses.
            </p>
            <button
              onClick={() => handleAcademyClick('Professional Edge', 'https://academy.axim.us.com/?category=Professional')}
              className="mt-auto flex items-center justify-between w-full px-4 py-3 bg-axim-purple/10 border border-axim-purple/30 text-axim-purple text-xs font-bold uppercase tracking-widest hover:bg-axim-purple hover:text-white transition-colors group/btn"
            >
              <span>Explore Track</span>
              <SafeIcon icon={LuIcons.LuExternalLink} className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
            </button>
          </div>

        </div>
      </section>

      {/* Call to action */}
      <section className="w-full bg-gradient-to-r from-[#050505] to-[#0A0A0A] border-t border-b border-white/5 py-16 text-center relative z-10">
        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-6">Enter the Academy</h2>
        <p className="text-sm text-zinc-400 mb-8 max-w-xl mx-auto">Access the full catalog of courses, certifications, and technical training modules.</p>
        <button
          onClick={() => handleAcademyClick('Global Access', 'https://academy.axim.us.com')}
          className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 border border-white/20 text-white font-black uppercase tracking-widest text-sm hover:bg-white hover:text-black transition-colors rounded-sm shadow-xl"
        >
          <span>Go to AXiM Academy</span>
          <SafeIcon icon={LuIcons.LuArrowRight} className="w-4 h-4" />
        </button>
      </section>

    </div>
  );
}
