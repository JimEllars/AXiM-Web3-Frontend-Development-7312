import React, { useEffect } from 'react';
import SEO from '../components/SEO.jsx';
import { logTelemetry } from '../lib/telemetry.js';
import { useAximStore } from '../store/useAximStore.js';
import * as LuIcons from 'react-icons/lu';
import SafeIcon from '../common/SafeIcon.jsx';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Tech() {
  const isWeb3Authenticated = useAximStore((state) => state.isWeb3Authenticated);

  const seoData = {
    title: 'AXiM Tech Hub',
    description: 'Explore AXiM\'s technical ecosystem, autonomous AI, and enterprise applications.',
    type: 'CollectionPage',
    schemaAdditionalType: 'SoftwareApplication'
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 bg-bg-void text-white overflow-hidden">
      <SEO customMeta={seoData} />

      <motion.section
        className="max-w-7xl mx-auto relative z-10 text-center mb-16"
        onViewportEnter={() => logTelemetry('tech_hub_viewed', { isWeb3Authenticated })}
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-axim-gold/10 blur-[120px] rounded-full pointer-events-none" />

        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-6 relative z-10">
          Engineering the <span className='text-axim-gold'>Technical Backbone</span>
        </h1>

        {isWeb3Authenticated && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 mt-4 bg-emerald-500/10 border border-emerald-500/30 font-mono text-[8px] text-emerald-400 uppercase tracking-widest rounded-sm select-none pointer-events-none relative z-10">
            <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
            [TECH_NODE: INFRASTRUCTURE_BACKBONE_ACTIVE]
          </div>
        )}

        <p className="max-w-2xl mx-auto text-zinc-400 font-mono text-sm uppercase tracking-widest leading-relaxed mt-6 relative z-10">
          Turning vision into execution requires scalable infrastructure. AXiM Tech provides the computational backbone, autonomous pipelines, and cognitive tools powering business and personal development.
        </p>
      </motion.section>

      <div className="max-w-7xl mx-auto relative z-10 space-y-16">

        <section>
          <h2 className="text-2xl font-black uppercase tracking-tight mb-8 border-b border-white/10 pb-4">Enterprise Applications & Infrastructure</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            <div className="bg-onyx-900/40 backdrop-blur-md border border-white/10 p-6 rounded-lg shadow-lg flex flex-col hover:border-axim-gold/30 transition-colors">
              <h3 className="font-bold uppercase tracking-widest mb-2 flex justify-between items-start">
                Nexus CRM
                <span className="text-[8px] font-mono text-yellow-500 border border-yellow-500/30 bg-yellow-500/10 px-1 py-0.5 rounded-sm">[INVITE ONLY]</span>
              </h3>
              <p className="text-xs font-mono text-zinc-500 flex-grow mb-4">Core operating system for distributed network management.</p>
              <button onClick={() => logTelemetry('tech_card_clicked', { section: 'Enterprise Applications', name: 'Nexus CRM' })} className="text-xs font-bold uppercase text-axim-gold hover:text-white transition-colors self-start">Request Access →</button>
            </div>

            <div className="bg-onyx-900/40 backdrop-blur-md border border-white/10 p-6 rounded-lg shadow-lg flex flex-col hover:border-axim-gold/30 transition-colors">
              <h3 className="font-bold uppercase tracking-widest mb-2 flex justify-between items-start">
                Ground Game Canvassing
                <span className="text-[8px] font-mono text-yellow-500 border border-yellow-500/30 bg-yellow-500/10 px-1 py-0.5 rounded-sm">[INVITE ONLY]</span>
              </h3>
              <p className="text-xs font-mono text-zinc-500 flex-grow mb-4">Geospatial territory management and field operations toolkit.</p>
              <button onClick={() => logTelemetry('tech_card_clicked', { section: 'Enterprise Applications', name: 'Ground Game Canvassing' })} className="text-xs font-bold uppercase text-axim-gold hover:text-white transition-colors self-start">Request Access →</button>
            </div>

            <div className="bg-onyx-900/40 backdrop-blur-md border border-white/10 p-6 rounded-lg shadow-lg flex flex-col hover:border-axim-gold/30 transition-colors">
              <h3 className="font-bold uppercase tracking-widest mb-2 flex justify-between items-start">
                RecruitFlow Operations
                <span className="text-[8px] font-mono text-axim-purple border border-axim-purple/30 bg-axim-purple/10 px-1 py-0.5 rounded-sm">[INTERNAL / BIZDEV CORE]</span>
              </h3>
              <p className="text-xs font-mono text-zinc-500 flex-grow mb-4">Automated talent acquisition and onboarding pipelines.</p>
              <button onClick={() => logTelemetry('tech_card_clicked', { section: 'Enterprise Applications', name: 'RecruitFlow Operations' })} className="text-xs font-bold uppercase text-axim-gold hover:text-white transition-colors self-start">View Details →</button>
            </div>

            <div className="bg-onyx-900/40 backdrop-blur-md border border-white/10 p-6 rounded-lg shadow-lg flex flex-col hover:border-axim-gold/30 transition-colors">
              <h3 className="font-bold uppercase tracking-widest mb-2">Utility Tools</h3>
              <p className="text-xs font-mono text-zinc-500 flex-grow mb-4">Document generation and administrative automation.</p>
              <div className="flex flex-col gap-2">
                <Link to="/tools/nda-generator" onClick={() => logTelemetry('tech_card_clicked', { section: 'Enterprise Applications', name: 'NDA Generator' })} className="text-xs font-bold uppercase text-axim-gold hover:text-white transition-colors">Launch NDA Generator →</Link>
                <Link to="/tools/pay-stub" onClick={() => logTelemetry('tech_card_clicked', { section: 'Enterprise Applications', name: 'Paystub Generator' })} className="text-xs font-bold uppercase text-axim-gold hover:text-white transition-colors">Launch Paystub Generator →</Link>
              </div>
            </div>

          </div>
        </section>

        <section>
          <h2 className="text-2xl font-black uppercase tracking-tight mb-8 border-b border-white/10 pb-4">Autonomous AI & Stream Systems</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div className="bg-onyx-900/40 backdrop-blur-md border border-white/10 p-6 rounded-lg shadow-lg flex flex-col hover:border-axim-purple/50 transition-colors group">
              <SafeIcon icon={LuIcons.LuTerminal} className="w-8 h-8 text-axim-purple mb-4 opacity-70 group-hover:opacity-100 transition-opacity" />
              <h3 className="font-bold uppercase tracking-widest mb-2">Onyx Terminal</h3>
              <p className="text-xs font-mono text-zinc-500 flex-grow mb-4">Internal swarm intelligence for DevSecOps and content management.</p>
              <Link to="/admin" onClick={() => logTelemetry('tech_card_clicked', { section: 'Autonomous AI', name: 'Onyx Terminal' })} className="text-xs font-bold uppercase text-axim-purple hover:text-white transition-colors self-start">Access Terminal →</Link>
            </div>

            <div className="bg-onyx-900/40 backdrop-blur-md border border-white/10 p-6 rounded-lg shadow-lg flex flex-col hover:border-axim-purple/50 transition-colors group">
              <SafeIcon icon={LuIcons.LuBot} className="w-8 h-8 text-axim-purple mb-4 opacity-70 group-hover:opacity-100 transition-opacity" />
              <h3 className="font-bold uppercase tracking-widest mb-2">Chatbase Integration</h3>
              <p className="text-xs font-mono text-zinc-500 flex-grow mb-4">Public-facing AI concierge and support routing.</p>
              <button onClick={() => logTelemetry('tech_card_clicked', { section: 'Autonomous AI', name: 'Chatbase Integration' })} className="text-xs font-bold uppercase text-axim-purple hover:text-white transition-colors self-start">Engage Assistant →</button>
            </div>

            <div className="bg-onyx-900/40 backdrop-blur-md border border-white/10 p-6 rounded-lg shadow-lg flex flex-col hover:border-axim-purple/50 transition-colors group">
              <SafeIcon icon={LuIcons.LuServerCog} className="w-8 h-8 text-axim-purple mb-4 opacity-70 group-hover:opacity-100 transition-opacity" />
              <h3 className="font-bold uppercase tracking-widest mb-2">Edge Compute Workers</h3>
              <p className="text-xs font-mono text-zinc-500 flex-grow mb-4">Cloudflare-powered decentralized routing and caching layer.</p>
              <button onClick={() => logTelemetry('tech_card_clicked', { section: 'Autonomous AI', name: 'Edge Compute Workers' })} className="text-xs font-bold uppercase text-axim-purple hover:text-white transition-colors self-start">View Network Status →</button>
            </div>

          </div>
        </section>

        <section>
          <div className="bg-onyx-900/40 backdrop-blur-md border border-axim-green/30 p-8 rounded-lg shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-axim-green/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <h2 className="text-2xl font-black uppercase tracking-tight mb-2 relative z-10 flex items-center gap-3">
              <SafeIcon icon={LuIcons.LuGamepad2} className="w-6 h-6 text-axim-green" />
              Games & Cognitive Interactive Engine
            </h2>
            <p className="text-sm font-mono text-zinc-400 mb-8 relative z-10">Gamified learning and skill-based cognitive testing environments.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 mb-8">
              <div className="bg-[#050505] border border-white/5 p-4 rounded-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-axim-green/10 flex items-center justify-center rounded">
                  <SafeIcon icon={LuIcons.LuSwords} className="w-6 h-6 text-axim-green" />
                </div>
                <div>
                  <h4 className="font-bold uppercase text-sm">Cyber Runner</h4>
                  <p className="text-[10px] font-mono text-zinc-500">Endless runner protocol.</p>
                </div>
                <div className="ml-auto font-mono text-[8px] bg-axim-green/10 text-axim-green px-1.5 py-0.5 rounded border border-axim-green/20">LIVE</div>
              </div>
              <div className="bg-[#050505] border border-white/5 p-4 rounded-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-axim-green/10 flex items-center justify-center rounded">
                  <SafeIcon icon={LuIcons.LuBrainCircuit} className="w-6 h-6 text-axim-green" />
                </div>
                <div>
                  <h4 className="font-bold uppercase text-sm">Daily Word Cipher</h4>
                  <p className="text-[10px] font-mono text-zinc-500">Cryptographic vocabulary challenge.</p>
                </div>
                <div className="ml-auto font-mono text-[8px] bg-axim-green/10 text-axim-green px-1.5 py-0.5 rounded border border-axim-green/20">LIVE</div>
              </div>
            </div>

            <div className="relative z-10 text-center border-t border-axim-green/20 pt-6 mt-2">
              <p className="mb-4 text-sm font-bold uppercase tracking-widest text-zinc-300">Explore the Complete AXiM Games Arcade</p>
              <Link
                to="/games"
                onClick={() => logTelemetry('tech_card_clicked', { section: 'Games', name: 'Arcade Entry' })}
                className="inline-flex items-center gap-2 px-6 py-3 bg-axim-green text-black font-black uppercase tracking-widest text-sm hover:bg-white transition-colors rounded-sm shadow-[0_0_20px_rgba(16,185,129,0.3)]"
              >
                Enter Arcade <SafeIcon icon={LuIcons.LuArrowRight} className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
