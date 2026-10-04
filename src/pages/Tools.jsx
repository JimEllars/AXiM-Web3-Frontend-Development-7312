import React from 'react';
import { Helmet } from 'react-helmet-async';
import Paywall from '../components/Paywall';
import { logTelemetry } from '../lib/telemetry';

export default function Tools() {
  const handlePartnerRedirect = (e, url, partnerName) => {
    e.preventDefault();
    logTelemetry('PARTNER_FUNNEL_REDIRECT', { partner: partnerName });
    setTimeout(() => {
      window.open(url, '_blank', 'noopener,noreferrer');
    }, 150);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 pt-32 pb-24 px-6 md:px-12 font-mono">
      <Helmet>
        <title>AXiM Tools | Micro-SaaS Offerings</title>
        <meta name="description" content="Access AXiM's suite of Micro-SaaS tools." />
      </Helmet>

      <div className="max-w-7xl mx-auto space-y-16">
        <header className="border-b border-axim-gold/20 pb-8">
          <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-widest mb-4">
            AXiM <span className="text-axim-gold">Tools</span>
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl leading-relaxed">
            Enterprise-grade generators and utilities, gate-kept by cryptographic verification.
          </p>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          <Paywall price={49.99} productId="demand-letter-gen-1" web3Gate={true}>
            <div className="p-8 h-full bg-onyx-900 border border-axim-gold/30 rounded shadow-[0_0_15px_rgba(234,179,8,0.1)] flex flex-col items-start justify-center">
               <h3 className="text-2xl font-bold text-white mb-2 uppercase tracking-wide">Demand Letter Generator</h3>
               <p className="text-sm text-zinc-400 mb-6">Instantly compile robust legal demand notices using dynamic templates and AI orchestration.</p>
               <button className="px-6 py-3 bg-axim-gold text-black font-bold uppercase tracking-wider text-sm hover:bg-white transition-colors mt-auto">
                 Launch App
               </button>
            </div>
          </Paywall>

          <Paywall price={29.99} productId="nda-gen-1" web3Gate={true}>
            <div className="p-8 h-full bg-onyx-900 border border-axim-gold/30 rounded shadow-[0_0_15px_rgba(234,179,8,0.1)] flex flex-col items-start justify-center">
               <h3 className="text-2xl font-bold text-white mb-2 uppercase tracking-wide">NDA Generator</h3>
               <p className="text-sm text-zinc-400 mb-6">Create binding Non-Disclosure Agreements tailored for technical contractors and enterprise workflows.</p>
               <button className="px-6 py-3 bg-axim-gold text-black font-bold uppercase tracking-wider text-sm hover:bg-white transition-colors mt-auto">
                 Launch App
               </button>
            </div>
          </Paywall>

        </section>

        <section className="mt-16 pt-16 border-t border-white/5">
           <h2 className="text-xl font-bold text-white uppercase tracking-widest mb-8">External Partner Modules</h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <a href="#" onClick={(e) => handlePartnerRedirect(e, 'https://make.com', 'Make')} className="block p-6 bg-black border border-white/10 hover:border-axim-gold/50 transition-colors group">
                  <h4 className="text-lg font-bold text-white group-hover:text-axim-gold transition-colors">Make Automation</h4>
                  <p className="text-xs text-zinc-500 mt-2">Deploy complex integration pipelines.</p>
              </a>
           </div>
        </section>
      </div>
    </div>
  );
}