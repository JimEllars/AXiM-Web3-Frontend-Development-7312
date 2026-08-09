import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAximStore } from '../store/useAximStore';
import SEO from '../components/SEO';
import { logTelemetry } from '../lib/telemetry';
import { LuDroplets, LuSun, LuWind } from 'react-icons/lu';
import SafeIcon from '../common/SafeIcon';

export default function Services() {
  const isWeb3Authenticated = useAximStore((state) => state.isWeb3Authenticated);

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "AXiM Enterprise Service Directory",
    "description": "Automated exterior and local home services provided by AXiM Systems.",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "item": {
          "@type": "Service",
          "name": "Window Cleaning Services",
          "url": "https://axim.us.com/services/window-cleaning"
        }
      }
    ]
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 z-10">
      <SEO
        title="AXiM Enterprise Service Directory"
        description="Explore automated exterior and local home services offered by AXiM Systems, including window cleaning, pressure washing, and solar maintenance."
        type="website"
        customSchema={[schema]}
      />

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        onViewportEnter={() => logTelemetry('services_directory_viewed', { isWeb3Authenticated })}
        className="mb-16 text-center"
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
          AXiM Enterprise <span className="text-axim-gold">Service Directory</span>
        </h1>
        <p className="text-lg md:text-xl text-zinc-300 max-w-3xl mx-auto mb-6">
          High-performance automated exterior maintenance and specialized local home services managed by the AXiM Core.
        </p>

        {isWeb3Authenticated && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 mt-4 bg-emerald-500/10 border border-emerald-500/30 font-mono text-[8px] text-emerald-400 uppercase tracking-widest rounded-sm select-none pointer-events-none">
            <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
            [SERVICES_NODE: DIRECTORY_ACTIVE]
          </div>
        )}
      </motion.section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Active Card */}
        <div className="bg-onyx-900/40 border border-axim-green/30 rounded-lg overflow-hidden backdrop-blur-md shadow-2xl hover:border-axim-green/60 transition-colors flex flex-col group relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-axim-green/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="p-6 md:p-8 flex flex-col h-full items-start relative z-10">
              <div className="w-12 h-12 bg-axim-green/10 border border-axim-green/20 rounded-md flex items-center justify-center mb-6">
                  <SafeIcon icon={LuDroplets} className="text-axim-green w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Window Cleaning Services</h2>
              <p className="text-zinc-400 mb-6 flex-grow">
                Professional exterior and interior window cleaning. We deliver crystal-clear, streak-free results for residential and commercial properties.
              </p>

              <ul className="space-y-2 mb-8 text-sm text-zinc-300 font-mono">
                  <li className="flex items-center gap-2"><span className="text-axim-green">✓</span> Pure Water Technology</li>
                  <li className="flex items-center gap-2"><span className="text-axim-green">✓</span> Screen & Track Cleaning</li>
                  <li className="flex items-center gap-2"><span className="text-axim-green">✓</span> Recurring Maintenance Plans</li>
              </ul>

              <Link
                to="/services/window-cleaning"
                onClick={() => logTelemetry('service_card_clicked', { serviceName: 'window_cleaning' })}
                className="w-full inline-flex items-center justify-center gap-2 bg-axim-green/10 hover:bg-axim-green/20 text-axim-green border border-axim-green/30 font-mono text-sm py-3 px-6 rounded-md transition-all uppercase tracking-widest mt-auto"
              >
                View Service →
              </Link>
            </div>
        </div>

        {/* Preview Card 1 */}
        <div className="bg-onyx-900/40 border border-white/5 rounded-lg overflow-hidden backdrop-blur-md shadow-2xl relative flex flex-col">
            <div className="absolute top-4 right-4 z-20">
                <span className="bg-white/5 border border-white/10 text-zinc-400 font-mono text-[10px] uppercase tracking-wider px-2 py-1 rounded-sm">
                    [COMING SOON]
                </span>
            </div>
            <div className="p-6 md:p-8 flex flex-col h-full items-start opacity-60">
               <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-md flex items-center justify-center mb-6">
                   <SafeIcon icon={LuWind} className="text-zinc-400 w-6 h-6" />
               </div>
              <h2 className="text-2xl font-bold text-white mb-3 pr-24">Pressure Washing & Exterior Soft Wash</h2>
              <p className="text-zinc-400 mb-6 flex-grow">
                Deep cleaning for siding, driveways, and walkways using adjusted pressure metrics to safely remove grime without surface damage.
              </p>

              <button disabled className="w-full cursor-not-allowed bg-white/5 text-zinc-500 border border-white/10 font-mono text-sm py-3 px-6 rounded-md uppercase tracking-widest mt-auto">
                Directory Locked
              </button>
            </div>
        </div>

        {/* Preview Card 2 */}
        <div className="bg-onyx-900/40 border border-white/5 rounded-lg overflow-hidden backdrop-blur-md shadow-2xl relative flex flex-col">
           <div className="absolute top-4 right-4 z-20">
                <span className="bg-white/5 border border-white/10 text-zinc-400 font-mono text-[10px] uppercase tracking-wider px-2 py-1 rounded-sm">
                    [COMING SOON]
                </span>
            </div>
            <div className="p-6 md:p-8 flex flex-col h-full items-start opacity-60">
                <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-md flex items-center justify-center mb-6">
                   <SafeIcon icon={LuSun} className="text-zinc-400 w-6 h-6" />
               </div>
              <h2 className="text-2xl font-bold text-white mb-3 pr-24">Solar Array & Roof Maintenance</h2>
              <p className="text-zinc-400 mb-6 flex-grow">
                Maximize energy yield with specialized solar panel cleaning and non-abrasive roof treatments to extend material lifespan.
              </p>

              <button disabled className="w-full cursor-not-allowed bg-white/5 text-zinc-500 border border-white/10 font-mono text-sm py-3 px-6 rounded-md uppercase tracking-widest mt-auto">
                Directory Locked
              </button>
            </div>
        </div>
      </div>
    </div>
  );
}
