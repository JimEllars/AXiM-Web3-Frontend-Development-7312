import React, { useEffect } from 'react';
import SEO from '../components/SEO.jsx';
import { logTelemetry } from '../lib/telemetry.js';
import { useAximStore } from '../store/useAximStore.js';

export default function AI() {
  const isWeb3Authenticated = useAximStore((state) => state.isWeb3Authenticated);

  useEffect(() => {
    logTelemetry('category_hub_viewed', { category: 'ai_automation' });
  }, []);

  const seoData = {
    title: 'AXiM AI & Automation Hub',
    description: 'Explore our AI capabilities, Make.com/Zapier automations, and ClickRank AI SEO edge strategies.',
    type: 'WebPage',
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 bg-bg-void text-white overflow-hidden">
      <SEO customMeta={seoData} />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Background effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-axim-purple/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="text-center mb-16 relative">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-6 bg-gradient-to-br from-axim-purple to-axim-gold bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(147,51,234,0.3)]">
            AXiM AI & Automation Infrastructure
          </h1>
          <p className="max-w-2xl mx-auto text-zinc-400 font-mono text-sm uppercase tracking-widest leading-relaxed">
            Deploying intelligent edge nodes, automated workflows, and telemetry-driven insights for the modern enterprise.
          </p>

          {isWeb3Authenticated && (
             <div className="mt-8 p-4 bg-emerald-500/5 border border-emerald-500/20 font-mono text-xs text-emerald-400 rounded-sm inline-block text-left relative z-20 shadow-[0_0_20px_rgba(16,185,129,0.1)] backdrop-blur-md">
               <div className="flex items-center gap-2 mb-3 pb-2 border-b border-emerald-500/20 font-bold tracking-widest">
                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                 EDGE_NETWORK_STATUS
               </div>
               <div className="space-y-1.5 opacity-90">
                 <div>[SEO_WORKER]: ONLINE (12ms)</div>
                 <div>[RPC_WORKER]: ONLINE (18ms)</div>
                 <div>[TELEMETRY_WORKER]: HYBRID_SYNCED</div>
               </div>
             </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">

          <div className="bg-[#050505] border border-white/10 p-8 rounded-sm hover:border-axim-purple/50 transition-colors group shadow-lg">
            <div className="mb-4">
              <span className="inline-flex items-center justify-center w-12 h-12 bg-axim-purple/10 border border-axim-purple/30 rounded-sm text-axim-purple group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </span>
            </div>
            <h3 className="text-xl font-bold uppercase tracking-widest mb-3">Edge Worker SEO</h3>
            <p className="text-sm font-mono text-zinc-400 leading-relaxed">
              Pre-rendering JSON-LD via Cloudflare Workers for GPTBot, Perplexity, and ClickRank.
            </p>
          </div>

          <div className="bg-[#050505] border border-white/10 p-8 rounded-sm hover:border-axim-gold/50 transition-colors group shadow-lg">
             <div className="mb-4">
              <span className="inline-flex items-center justify-center w-12 h-12 bg-axim-gold/10 border border-axim-gold/30 rounded-sm text-axim-gold group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              </span>
            </div>
            <h3 className="text-xl font-bold uppercase tracking-widest mb-3">Workflow Automation</h3>
            <p className="text-sm font-mono text-zinc-400 leading-relaxed">
              Custom Make.com and Zapier triggers routing leads from edge to enterprise CRM.
            </p>
          </div>

          <div className="bg-[#050505] border border-white/10 p-8 rounded-sm hover:border-emerald-500/50 transition-colors group shadow-lg">
             <div className="mb-4">
              <span className="inline-flex items-center justify-center w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 rounded-sm text-emerald-400 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              </span>
            </div>
            <h3 className="text-xl font-bold uppercase tracking-widest mb-3">Automated Telemetry</h3>
            <p className="text-sm font-mono text-zinc-400 leading-relaxed">
              Non-blocking beacon streams pushing 100% of node traffic into decentralized vaults.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
