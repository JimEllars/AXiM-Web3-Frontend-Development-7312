import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useAximStore } from '../store/useAximStore.js';
import { logTelemetry } from '../lib/telemetry.js';
import SEO from '../components/SEO.jsx';


const SelldoneEmbed = ({ product, shelfTitle }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="mt-auto pt-4 border-t border-white/10"
      onClick={() => logTelemetry('marketplace_category_viewed', { category: shelfTitle })}
    >
      <div id={`selldone-embed-container-${product.title.replace(/\s+/g, '-').toLowerCase()}`} className="relative w-full h-12 bg-white/5 border border-white/10 rounded-sm overflow-hidden flex items-center justify-center group cursor-pointer hover:bg-white/10 transition-colors">
         {isLoading ? (
           <div className="absolute inset-0 bg-axim-purple/20 animate-pulse transition-opacity duration-500" />
         ) : (
           <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors relative z-10">Load Storefront</span>
         )}
      </div>
    </div>
  );
};


SelldoneEmbed.propTypes = {
  product: PropTypes.shape({
    title: PropTypes.string.isRequired,
  }).isRequired,
  shelfTitle: PropTypes.string.isRequired,
};

export default function Store() {
  const isWeb3Authenticated = useAximStore((state) => state.isWeb3Authenticated);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://selldone.com/sdk.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);


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
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <span className="animate-pulse">[MARKETPLACE_NODE: ARBITRUM_LEDGER_SYNCED]</span>
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
                  <SelldoneEmbed product={product} shelfTitle={shelf.title} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
