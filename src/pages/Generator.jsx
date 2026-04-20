import React from 'react';
import SEO from '../components/SEO';
import SafeIcon from '../common/SafeIcon';
import Paywall from '../components/Paywall';
import * as LuIcons from 'react-icons/lu';

const { LuFileSignature, LuArrowRight } = LuIcons;

export default function Generator() {
  return (
    <div className="max-w-[800px] mx-auto px-6 py-20 relative z-10">
      <SEO title="Legal Infrastructure" description="AXiM Legal Infrastructure Generator." />

      <div className="mb-12 border-b border-white/10 pb-6">
        <h1 className="text-3xl font-black uppercase tracking-tighter mb-2 flex items-center gap-3">
          <SafeIcon icon={LuFileSignature} className="text-axim-gold" />
          Legal Infrastructure Generator
        </h1>
        <p className="text-zinc-500 text-sm">Automated protocol for legal document synthesis.</p>
      </div>

      <Paywall price="4.00" productId="DOC_DEMAND" web3Gate={true} externalUrl="/generator">
      <div className="space-y-6">
        <div className="p-6 border border-white/10 bg-white/5 space-y-4">
          <h2 className="text-xl font-bold uppercase tracking-wider text-white border-b border-white/10 pb-2 mb-4">Step 1: Entity Identification</h2>
          <div>
            <label className="block text-xs font-mono text-zinc-500 uppercase mb-2">Full Legal Identity</label>
            <input
              type="text"
              placeholder="Full Legal Identity"
              className="w-full bg-transparent border border-white/20 rounded-sm px-4 py-3 text-sm font-mono text-white focus:outline-none focus:border-axim-gold"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-zinc-500 uppercase mb-2">Entity or Individual</label>
            <input
              type="text"
              placeholder="Entity or Individual"
              className="w-full bg-transparent border border-white/20 rounded-sm px-4 py-3 text-sm font-mono text-white focus:outline-none focus:border-axim-gold"
            />
          </div>
          <div className="pt-4 flex justify-end">
            <button className="flex items-center gap-2 px-6 py-2 bg-axim-gold text-black font-bold uppercase tracking-widest text-sm hover:bg-yellow-400 transition-colors">
              Proceed to Context <SafeIcon icon={LuArrowRight} className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-6 border border-white/10 bg-white/5 space-y-4  ">
          <h2 className="text-xl font-bold uppercase tracking-wider text-white border-b border-white/10 pb-2 mb-4">Step 2: Incident Context</h2>
          <div>
            <label className="block text-xs font-mono text-zinc-500 uppercase mb-2">Claim Amount (USD)</label>
            <input
              type="text"
              placeholder="0.00"
              className="w-full bg-transparent border border-white/20 rounded-sm px-4 py-3 text-sm font-mono text-white focus:outline-none focus:border-axim-gold"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-zinc-500 uppercase mb-2">Incident Description</label>
            <textarea
              placeholder="Describe the breach or unpaid obligation..."
              rows={4}
              className="w-full bg-transparent border border-white/20 rounded-sm px-4 py-3 text-sm font-mono text-white focus:outline-none focus:border-axim-gold"
            />
          </div>
          <div className="pt-4 flex justify-end">
            <button className="px-6 py-2 bg-axim-teal text-black font-bold uppercase tracking-widest text-sm hover:bg-teal-400 transition-colors">
              Synchronize Draft
            </button>
          </div>
        </div>
      </div>
      </Paywall>
    </div>
  );
}
