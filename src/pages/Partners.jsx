import React from 'react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';
import { Link } from 'react-router-dom';

export default function Partners() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
      <SEO title="Infrastructure Partners" description="AXiM's vetted ecosystem of enterprise platforms." />

      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white mb-4">Partner <span className="text-axim-purple">Ecosystem</span></h1>
        <p className="text-zinc-500 max-w-2xl mx-auto">We integrate and partner with best-in-class platforms to expand your operational capabilities. View our official affiliations below.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Make.com */}
        <div className="p-8 bg-white/5 border border-white/10 hover:border-axim-purple/50 transition-colors rounded-sm flex flex-col h-full group">
          <div className="mb-6 flex-grow">
            <div className="w-12 h-12 bg-gradient-to-br from-[#9333EA] to-[#DB2777] rounded flex items-center justify-center mb-6">
              <SafeIcon icon={LuIcons.LuGitBranch} className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-3">Make.com</h2>
            <p className="text-sm text-zinc-400">Visual automation that lets you design, build, and automate complex enterprise workflows without coding.</p>
          </div>
          <Link to="/partners/make" className="w-full py-3 border border-white/20 text-center font-mono text-xs uppercase text-white hover:bg-white hover:text-black transition-colors tracking-widest">
            View Integration
          </Link>
        </div>

        {/* Powur Customer */}
        <div className="p-8 bg-white/5 border border-white/10 hover:border-axim-gold/50 transition-colors rounded-sm flex flex-col h-full group">
          <div className="mb-6 flex-grow">
            <div className="w-12 h-12 bg-axim-gold/20 text-axim-gold rounded flex items-center justify-center mb-6">
              <SafeIcon icon={LuIcons.LuSun} className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-3">Powur Solar</h2>
            <p className="text-sm text-zinc-400">Decentralize your home's energy. Customized, zero-down residential solar systems utilizing Tier-1 hardware.</p>
          </div>
          <Link to="/partners/powur-solar" className="w-full py-3 border border-axim-gold/30 text-axim-gold text-center font-mono text-xs uppercase hover:bg-axim-gold hover:text-black transition-colors tracking-widest">
            Go Solar
          </Link>
        </div>

        {/* Powur Biz Opp */}
        <div className="p-8 bg-white/5 border border-white/10 hover:border-axim-purple/50 transition-colors rounded-sm flex flex-col h-full group">
          <div className="mb-6 flex-grow">
            <div className="w-12 h-12 bg-axim-purple/20 text-axim-purple rounded flex items-center justify-center mb-6">
              <SafeIcon icon={LuIcons.LuTrendingUp} className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-3">Powur Agency</h2>
            <p className="text-sm text-zinc-400">Join the cloud-based solar revolution. Build an enterprise solar agency with massive revenue share margins.</p>
          </div>
          <Link to="/partners/powur-join" className="w-full py-3 border border-axim-purple/30 text-axim-purple text-center font-mono text-xs uppercase hover:bg-axim-purple hover:text-white transition-colors tracking-widest">
            Start Selling
          </Link>
        </div>

      </div>
    </div>
  );
}
