import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { logTelemetry } from '../lib/telemetry';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';
import { useAximStore } from '../store/useAximStore';
import Tools from './Tools';

export default function Business() {
  const isWeb3Authenticated = useAximStore((state) => state.isWeb3Authenticated);

  useEffect(() => {
    logTelemetry('category_hub_viewed', { category: 'business' });
  }, []);

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "AXiM Business Development Hub",
    "description": "Enterprise B2B commercial services, tools, and intelligence."
  };

  return (
    <div className="min-h-screen bg-bg-void text-white font-sans selection:bg-axim-gold/30">
      <SEO
        title="Business Development Hub | AXiM Systems"
        description="Scaling enterprise revenue and B2B systems through intelligent applications and commercial services."
        schema={schema}
      />

      <section className="relative pt-24 pb-12 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-axim-gold/10 via-bg-void to-bg-void pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500">
              AXiM Business<br />Development Engine
            </h1>
            <p className="text-zinc-400 text-sm md:text-base max-w-2xl mx-auto font-medium">
              Scaling enterprise revenue and B2B systems. Access our suite of commercial services, intelligence articles, and dedicated apps & tools.
            </p>

            {isWeb3Authenticated && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 mt-6 bg-emerald-500/10 border border-emerald-500/30 font-mono text-[8px] text-emerald-400 uppercase tracking-widest rounded-sm select-none pointer-events-none">
                <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                [BUSINESS_NODE: ENTERPRISE_ROUTING_ACTIVE]
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <section className="py-12 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Commercial Services Card */}
          <Link to="/services/commercial-exterior" className="group relative bg-[#0A0A0A] border border-white/5 p-8 rounded-sm hover:border-axim-gold/50 transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-axim-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <SafeIcon icon={LuIcons.LuBuilding2} className="w-8 h-8 text-axim-gold mb-4" />
            <h2 className="text-xl font-black uppercase tracking-wider mb-2 group-hover:text-axim-gold transition-colors">Commercial Services</h2>
            <p className="text-sm text-zinc-400 mb-6 font-medium">High-grade property management, structural maintenance, and business exterior scaling.</p>
            <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-widest">
              <span>View Services</span>
              <SafeIcon icon={LuIcons.LuArrowRight} className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* B2B Intelligence & Articles Card */}
          <Link to="/articles" className="group relative bg-[#0A0A0A] border border-white/5 p-8 rounded-sm hover:border-axim-gold/50 transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-axim-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <SafeIcon icon={LuIcons.LuChartLine} className="w-8 h-8 text-axim-gold mb-4" />
            <h2 className="text-xl font-black uppercase tracking-wider mb-2 group-hover:text-axim-gold transition-colors">B2B Intelligence</h2>
            <p className="text-sm text-zinc-400 mb-6 font-medium">Strategic business news, enterprise analysis, and actionable scaling articles.</p>
            <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-widest">
              <span>Read Articles</span>
              <SafeIcon icon={LuIcons.LuArrowRight} className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

        {/* Embedded Tools Section */}
        <div className="relative pt-8 mt-12 border-t border-white/5">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 bg-bg-void">
            <span className="text-[10px] font-mono uppercase tracking-widest text-axim-gold border border-axim-gold/30 px-2 py-1 rounded-sm bg-axim-gold/5">
              Apps & Tools Hub
            </span>
          </div>
          <div className="mt-8">
            <Tools embedMode={true} />
          </div>
        </div>
      </section>
    </div>
  );
}
