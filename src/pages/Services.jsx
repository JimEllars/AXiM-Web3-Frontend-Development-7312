import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAximStore } from '../store/useAximStore';
import SEO from '../components/SEO';
import Reviews from '../components/Reviews';
 '../components/SEO';
import { logTelemetry } from '../lib/telemetry';
import { LuDroplets, LuSun, LuWind, LuBuilding2, LuTrendingUp, LuZap } from 'react-icons/lu';
import SafeIcon from '../common/SafeIcon';

export default function Services() {
  const isWeb3Authenticated = useAximStore((state) => state.isWeb3Authenticated);
  const [activeTab, setActiveTab] = useState('business'); // 'business' or 'home'

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "AXiM Enterprise Service Directory",
    "description": "Automated exterior and local home services provided by AXiM Business Development.",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "item": {
          "@type": "Service",
          "name": "Commercial Exterior Management",
          "url": "https://axim.us.com/services"
        }
      },
      {
        "@type": "ListItem",
        "position": 2,
        "item": {
          "@type": "Service",
          "name": "Solar Array Yield Optimization",
          "url": "https://axim.us.com/services"
        }
      },
      {
        "@type": "ListItem",
        "position": 3,
        "item": {
          "@type": "Service",
          "name": "Automated Lead & Sales Systems",
          "url": "https://axim.us.com/services"
        }
      },
      {
        "@type": "ListItem",
        "position": 4,
        "item": {
          "@type": "Service",
          "name": "Window Cleaning Services",
          "url": "https://axim.us.com/services/window-cleaning"
        }
      },
      {
        "@type": "ListItem",
        "position": 5,
        "item": {
          "@type": "Service",
          "name": "Pressure Washing Services",
          "url": "https://axim.us.com/services/pressure-washing"
        }
      }
    ]
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 z-10">
      <SEO
        title="AXiM Enterprise Service Directory"
        description="Explore commercial B2B sales/operations and automated exterior home services offered by AXiM Business Development."
        type="website"
        customSchema={[schema]}
      />

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        onViewportEnter={() => logTelemetry('services_directory_viewed', { isWeb3Authenticated })}
        className="mb-12 text-center"
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
          AXiM Business <span className="text-axim-gold">Development</span>
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

      {/* Tab Switcher */}
      <div className="flex justify-center mb-12">
        <div className="bg-onyx-900/60 p-1 rounded-lg border border-white/10 flex flex-wrap max-w-md w-full">
          <button
            onClick={() => setActiveTab('business')}
            className={`flex-1 py-3 px-4 text-sm font-mono uppercase tracking-wider rounded-md transition-all ${
              activeTab === 'business'
                ? 'bg-axim-gold text-black font-bold shadow-lg'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Business Services
          </button>
          <button
            onClick={() => setActiveTab('home')}
            className={`flex-1 py-3 px-4 text-sm font-mono uppercase tracking-wider rounded-md transition-all ${
              activeTab === 'home'
                ? 'bg-axim-green text-black font-bold shadow-lg'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Home Services
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'business' && (
          <motion.div
            key="business"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {/* Commercial Exterior Management */}
            <div className="bg-onyx-900/40 border border-axim-gold/30 rounded-lg overflow-hidden backdrop-blur-md shadow-2xl hover:border-axim-gold/60 transition-colors flex flex-col group relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-axim-gold/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="p-6 md:p-8 flex flex-col h-full items-start relative z-10">
                <div className="w-12 h-12 bg-axim-gold/10 border border-axim-gold/20 rounded-md flex items-center justify-center mb-6">
                  <SafeIcon icon={LuBuilding2} className="text-axim-gold w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">Commercial Exterior Management</h2>
                <p className="text-zinc-400 mb-6 flex-grow">
                  Building facade glass, high-rise washing, and recurring corporate maintenance designed for commercial B2B operations.
                </p>
                <ul className="space-y-2 mb-8 text-sm text-zinc-300 font-mono">
                  <li className="flex items-center gap-2"><span className="text-axim-gold">✓</span> High-Rise Capabilities</li>
                  <li className="flex items-center gap-2"><span className="text-axim-gold">✓</span> Recurring Schedules</li>
                  <li className="flex items-center gap-2"><span className="text-axim-gold">✓</span> Professional Operations</li>
                </ul>
                <Link
                  to="/services/commercial-exterior"
                  onClick={() => logTelemetry('service_card_clicked', { serviceName: 'commercial_exterior', category: 'business_services' })}
                  className="w-full inline-flex items-center justify-center gap-2 bg-axim-gold/10 hover:bg-axim-gold/20 text-axim-gold border border-axim-gold/30 font-mono text-sm py-3 px-6 rounded-md transition-all uppercase tracking-widest mt-auto"
                >
                  View Service →
                </Link>
              </div>
            </div>

            {/* Solar Array Yield Optimization */}
            <div className="bg-onyx-900/40 border border-axim-gold/30 rounded-lg overflow-hidden backdrop-blur-md shadow-2xl hover:border-axim-gold/60 transition-colors flex flex-col group relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-axim-gold/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="p-6 md:p-8 flex flex-col h-full items-start relative z-10">
                <div className="w-12 h-12 bg-axim-gold/10 border border-axim-gold/20 rounded-md flex items-center justify-center mb-6">
                  <SafeIcon icon={LuZap} className="text-axim-gold w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">Solar Array Yield Optimization</h2>
                <p className="text-zinc-400 mb-6 flex-grow">
                  Commercial solar panel washing and maintenance aimed at maximizing MW production and operational efficiency.
                </p>
                <ul className="space-y-2 mb-8 text-sm text-zinc-300 font-mono">
                  <li className="flex items-center gap-2"><span className="text-axim-gold">✓</span> Output Maximization</li>
                  <li className="flex items-center gap-2"><span className="text-axim-gold">✓</span> Non-Abrasive Cleaning</li>
                  <li className="flex items-center gap-2"><span className="text-axim-gold">✓</span> Utility Scale Ready</li>
                </ul>
                <Link
                  to="/consultation"
                  onClick={() => logTelemetry('service_card_clicked', { serviceName: 'solar_optimization', category: 'business_services' })}
                  className="w-full inline-flex items-center justify-center gap-2 bg-axim-gold/10 hover:bg-axim-gold/20 text-axim-gold border border-axim-gold/30 font-mono text-sm py-3 px-6 rounded-md transition-all uppercase tracking-widest mt-auto"
                >
                  Consultation →
                </Link>
              </div>
            </div>

            {/* Automated Lead & Sales Systems */}
            <div className="bg-onyx-900/40 border border-axim-gold/30 rounded-lg overflow-hidden backdrop-blur-md shadow-2xl hover:border-axim-gold/60 transition-colors flex flex-col group relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-axim-gold/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="p-6 md:p-8 flex flex-col h-full items-start relative z-10">
                <div className="w-12 h-12 bg-axim-gold/10 border border-axim-gold/20 rounded-md flex items-center justify-center mb-6">
                  <SafeIcon icon={LuTrendingUp} className="text-axim-gold w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">Automated Lead & Sales Systems</h2>
                <p className="text-zinc-400 mb-6 flex-grow">
                  Dedicated lead intake telemetry and business development pipelines configured for conversion scaling.
                </p>
                <ul className="space-y-2 mb-8 text-sm text-zinc-300 font-mono">
                  <li className="flex items-center gap-2"><span className="text-axim-gold">✓</span> AI Telemetry</li>
                  <li className="flex items-center gap-2"><span className="text-axim-gold">✓</span> Pipeline Integration</li>
                  <li className="flex items-center gap-2"><span className="text-axim-gold">✓</span> Conversion Optimization</li>
                </ul>
                <Link
                  to="/consultation"
                  onClick={() => logTelemetry('service_card_clicked', { serviceName: 'automated_leads', category: 'business_services' })}
                  className="w-full inline-flex items-center justify-center gap-2 bg-axim-gold/10 hover:bg-axim-gold/20 text-axim-gold border border-axim-gold/30 font-mono text-sm py-3 px-6 rounded-md transition-all uppercase tracking-widest mt-auto"
                >
                  Consultation →
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {/* Window Cleaning Card */}
            <div className="bg-onyx-900/40 border border-axim-green/30 rounded-lg overflow-hidden backdrop-blur-md shadow-2xl hover:border-axim-green/60 transition-colors flex flex-col group relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-axim-green/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="p-6 md:p-8 flex flex-col h-full items-start relative z-10">
                <div className="w-12 h-12 bg-axim-green/10 border border-axim-green/20 rounded-md flex items-center justify-center mb-6">
                  <SafeIcon icon={LuDroplets} className="text-axim-green w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">Residential Window Cleaning</h2>
                <p className="text-zinc-400 mb-6 flex-grow">
                  Professional exterior and interior window cleaning. We deliver crystal-clear, streak-free results for residential properties.
                </p>
                <ul className="space-y-2 mb-8 text-sm text-zinc-300 font-mono">
                  <li className="flex items-center gap-2"><span className="text-axim-green">✓</span> Pure Water Technology</li>
                  <li className="flex items-center gap-2"><span className="text-axim-green">✓</span> Screen & Track Cleaning</li>
                  <li className="flex items-center gap-2"><span className="text-axim-green">✓</span> Recurring Maintenance Plans</li>
                </ul>
                <Link
                  to="/services/window-cleaning"
                  onClick={() => logTelemetry('service_card_clicked', { serviceName: 'window_cleaning', category: 'home_services' })}
                  className="w-full inline-flex items-center justify-center gap-2 bg-axim-green/10 hover:bg-axim-green/20 text-axim-green border border-axim-green/30 font-mono text-sm py-3 px-6 rounded-md transition-all uppercase tracking-widest mt-auto"
                >
                  View Service →
                </Link>
              </div>
            </div>

            {/* Pressure Washing Card */}
            <div className="bg-onyx-900/40 border border-axim-green/30 rounded-lg overflow-hidden backdrop-blur-md shadow-2xl hover:border-axim-green/60 transition-colors flex flex-col group relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-axim-green/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="p-6 md:p-8 flex flex-col h-full items-start relative z-10">
                <div className="w-12 h-12 bg-axim-green/10 border border-axim-green/20 rounded-md flex items-center justify-center mb-6">
                  <SafeIcon icon={LuWind} className="text-axim-green w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3 pr-24">Pressure Washing & Soft Wash</h2>
                <p className="text-zinc-400 mb-6 flex-grow">
                  Deep cleaning for siding, driveways, and walkways using adjusted pressure metrics to safely remove grime without surface damage.
                </p>
                <ul className="space-y-2 mb-8 text-sm text-zinc-300 font-mono">
                  <li className="flex items-center gap-2"><span className="text-axim-green">✓</span> Driveway & Walkway Restoration</li>
                  <li className="flex items-center gap-2"><span className="text-axim-green">✓</span> Low-PSI Soft Washing</li>
                  <li className="flex items-center gap-2"><span className="text-axim-green">✓</span> Algae & Mold Removal</li>
                </ul>
                <Link
                  to="/services/pressure-washing"
                  onClick={() => logTelemetry('service_card_clicked', { serviceName: 'pressure_washing', category: 'home_services' })}
                  className="w-full inline-flex items-center justify-center gap-2 bg-axim-green/10 hover:bg-axim-green/20 text-axim-green border border-axim-green/30 font-mono text-sm py-3 px-6 rounded-md transition-all uppercase tracking-widest mt-auto"
                >
                  View Service →
                </Link>
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
                <h2 className="text-2xl font-bold text-white mb-3 pr-24">Roof & Gutter Protection</h2>
                <p className="text-zinc-400 mb-6 flex-grow">
                  Maximize home protection with non-abrasive roof treatments and comprehensive gutter clearing systems.
                </p>
                <ul className="space-y-2 mb-8 text-sm text-zinc-500 font-mono">
                  <li className="flex items-center gap-2"><span className="text-zinc-600">✓</span> Gutter Clearing</li>
                  <li className="flex items-center gap-2"><span className="text-zinc-600">✓</span> Shingle Safe Treatment</li>
                  <li className="flex items-center gap-2"><span className="text-zinc-600">✓</span> Preventive Maintenance</li>
                </ul>
                <button disabled className="w-full cursor-not-allowed bg-white/5 text-zinc-500 border border-white/10 font-mono text-sm py-3 px-6 rounded-md uppercase tracking-widest mt-auto">
                  Directory Locked
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <Reviews />
    </div>
  );
}
