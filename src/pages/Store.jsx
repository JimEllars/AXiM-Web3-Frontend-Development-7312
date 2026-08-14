import React from 'react';
import { useAximStore } from '../store/useAximStore.js';
import { logTelemetry } from '../lib/telemetry.js';
import SEO from '../components/SEO.jsx';

export default function Store() {
  const isWeb3Authenticated = useAximStore((state) => state.isWeb3Authenticated);
  const showToast = useAximStore((state) => state.showToast);

  const handleWaitlistClick = () => {
    logTelemetry('store_waitlist_intent');
    showToast('Added to Store Waitlist', 'success');
  };

  const seoData = {
    title: 'AXiM Digital Marketplace',
    description: 'The enterprise storefront for digital courses, gaming assets, and software tools is currently booting up.',
    type: 'WebPage',
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-24 pb-12 px-6 bg-[#050505] overflow-hidden">
      <SEO customMeta={seoData} />

      <div className="relative max-w-lg w-full">
        {/* Background effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-axim-purple/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="bg-[#050505] border border-white/10 p-8 md:p-12 rounded-sm shadow-2xl relative z-10 flex flex-col items-center text-center">

          <div className="mb-6 inline-flex font-mono text-[10px] text-axim-gold uppercase tracking-widest border border-axim-gold/30 bg-axim-gold/10 px-3 py-1 items-center gap-2 rounded-sm select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-axim-gold animate-pulse" />
            [IN DEVELOPMENT]
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-4">
            AXiM Digital Marketplace
          </h1>

          <p className="text-sm font-mono text-zinc-400 uppercase tracking-widest leading-relaxed mb-8">
            The enterprise storefront for digital courses, gaming assets, and software tools is currently booting up.
          </p>

          <button
            onClick={handleWaitlistClick}
            className="w-full relative z-10 inline-flex items-center justify-center px-6 py-4 font-black uppercase tracking-widest text-sm transition-colors rounded-sm border border-axim-purple/50 bg-axim-purple/20 text-white hover:bg-axim-purple hover:text-white"
          >
            Enter Pre-Sale Waitlist
          </button>

          {isWeb3Authenticated && (
            <div className="mt-6 font-mono text-[10px] text-axim-purple uppercase tracking-widest border border-axim-purple/30 bg-axim-purple/10 px-3 py-1 inline-flex items-center gap-2 rounded-sm select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-axim-purple animate-pulse" />
              [WEB3: STORE_WHITELISTED]
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
