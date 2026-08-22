import React, { useState } from 'react';
import { useAximStore } from '../store/useAximStore.js';
import { logTelemetry } from '../lib/telemetry.js';
import SEO from '../components/SEO.jsx';

export default function Store() {
  const isWeb3Authenticated = useAximStore((state) => state.isWeb3Authenticated);
  const showToast = useAximStore((state) => state.showToast);
  const [waitlistedProducts, setWaitlistedProducts] = useState(new Set());

  const handleWaitlistClick = (productTitle) => {
    if (waitlistedProducts.has(productTitle)) return;
    setWaitlistedProducts((prev) => new Set(prev).add(productTitle));
    logTelemetry('store_product_waitlist', {
      productTitle,
      isWeb3Authenticated
    });
    showToast(`Added ${productTitle} to Waitlist`, 'success');
  };

  const seoData = {
    title: 'AXiM Digital Marketplace',
    description: 'The enterprise storefront for digital courses, gaming assets, and software tools is currently booting up.',
    type: 'WebPage',
  };

  const shelves = [
    {
      title: 'Business Development Suite',
      products: [
        {
          title: 'Nexus CRM Masterclass',
          category: 'COURSE',
          description: 'Complete automated sales routing and pipeline architecture course.'
        },
        {
          title: 'Automated Canvassing Playbook',
          category: 'BLUEPRINT',
          description: 'Blueprint for deploying and managing high-velocity field teams.'
        }
      ]
    },
    {
      title: 'Personal Development Frameworks',
      products: [
        {
          title: 'Overcoming Imposter Syndrome',
          category: 'AUDIO/WORKBOOK',
          description: 'Audio/workbook system for high-performing professionals.'
        },
        {
          title: 'Executive Inner Voice Calibration',
          category: 'MODULE',
          description: 'Mental recalibration and operational focus module.'
        }
      ]
    },
    {
      title: 'Tech Development Blueprints',
      products: [
        {
          title: 'Cloudflare Edge Worker Starter Kit',
          category: 'TEMPLATE',
          description: 'Serverless proxy, SEO prerender, and telemetry worker templates.'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 bg-[#050505]">
      <SEO customMeta={seoData} />

      <div className="max-w-7xl mx-auto flex flex-col items-center text-center mb-16 relative z-10">
        <div className="mb-4">
          {isWeb3Authenticated && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 mb-4 bg-emerald-500/10 border border-emerald-500/30 font-mono text-[8px] text-emerald-400 uppercase tracking-widest rounded-sm select-none pointer-events-none">
              <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
              [MARKETPLACE_NODE: ARBITRUM_LEDGER_SYNCED]
            </div>
          )}
        </div>
        <div className="mb-6 inline-flex font-mono text-[10px] text-axim-gold uppercase tracking-widest border border-axim-gold/30 bg-axim-gold/10 px-3 py-1 items-center gap-2 rounded-sm select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-axim-gold animate-pulse" />
          [IN DEVELOPMENT]
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">
          AXiM Digital Marketplace
        </h1>

        <p className="text-sm font-mono text-zinc-400 uppercase tracking-widest leading-relaxed max-w-2xl">
          The enterprise storefront for digital courses, gaming assets, and software tools is currently booting up.
        </p>
      </div>

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        {shelves.map((shelf, sIdx) => (
          <div key={sIdx} className="space-y-6">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2">
              {shelf.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shelf.products.map((product, pIdx) => (
                <div key={pIdx} className="bg-onyx-900/40 backdrop-blur-md border border-white/10 p-6 rounded-lg shadow-xl hover:border-axim-purple/50 transition-colors flex flex-col">
                  <div className="text-[10px] font-mono text-axim-purple uppercase tracking-widest mb-3">
                    [{product.category}]
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{product.title}</h3>
                  <p className="text-sm text-zinc-400 mb-6 flex-grow leading-relaxed">
                    {product.description}
                  </p>
                  <button
                    onClick={() => handleWaitlistClick(product.title)}
                    className={`w-full mt-auto inline-flex items-center justify-center px-4 py-3 font-bold uppercase tracking-widest text-xs transition-colors rounded-sm border ${
                      waitlistedProducts.has(product.title)
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                        : 'border-axim-purple/50 bg-axim-purple/10 text-white hover:bg-axim-purple hover:text-white'
                    }`}
                  >
                    {waitlistedProducts.has(product.title) ? '✓ Waitlist Confirmed' : 'Join Product Waitlist'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
