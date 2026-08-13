import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { logTelemetry } from '../lib/telemetry';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';

export default function Personal() {
  useEffect(() => {
    logTelemetry('category_hub_viewed', { category: 'personal' });
  }, []);

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "AXiM Personal Development Hub",
    "description": "Personal growth systems, residential home services, and individual utilities."
  };

  return (
    <div className="min-h-screen bg-bg-void text-white font-sans selection:bg-emerald-500/30">
      <SEO
        title="Personal Development Hub | AXiM Systems"
        description="Maximizing individual efficiency and property value through targeted services and growth frameworks."
        schema={schema}
      />

      <section className="relative pt-24 pb-12 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/10 via-bg-void to-bg-void pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500">
              Personal Development<br />& Growth Systems
            </h1>
            <p className="text-zinc-400 text-sm md:text-base max-w-2xl mx-auto font-medium">
              Maximizing individual efficiency and property value. Explore our residential services, utility apps, and personal growth frameworks.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Property & Home Services Card */}
          <Link to="/services" className="group relative bg-[#0A0A0A] border border-white/5 p-8 rounded-sm hover:border-emerald-500/50 transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <SafeIcon icon={LuIcons.LuHouse} className="w-8 h-8 text-emerald-500 mb-4" />
            <h2 className="text-xl font-black uppercase tracking-wider mb-2 group-hover:text-emerald-500 transition-colors">Property & Home</h2>
            <p className="text-sm text-zinc-400 mb-6 font-medium">Residential exterior services, pressure washing, and property value enhancement.</p>
            <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-widest mt-auto">
              <span>View Services</span>
              <SafeIcon icon={LuIcons.LuArrowRight} className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Individual Utilities Card */}
          <Link to="/tools/nda-generator" className="group relative bg-[#0A0A0A] border border-white/5 p-8 rounded-sm hover:border-emerald-500/50 transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <SafeIcon icon={LuIcons.LuWrench} className="w-8 h-8 text-emerald-500 mb-4" />
            <h2 className="text-xl font-black uppercase tracking-wider mb-2 group-hover:text-emerald-500 transition-colors">Individual Utilities</h2>
            <p className="text-sm text-zinc-400 mb-6 font-medium">Personal document generators, pay stubs, and individual legal tech tools.</p>
            <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-widest mt-auto">
              <span>Access Utilities</span>
              <SafeIcon icon={LuIcons.LuArrowRight} className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Growth Frameworks Card */}
          <Link to="/articles" className="group relative bg-[#0A0A0A] border border-white/5 p-8 rounded-sm hover:border-emerald-500/50 transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <SafeIcon icon={LuIcons.LuBookOpen} className="w-8 h-8 text-emerald-500 mb-4" />
            <h2 className="text-xl font-black uppercase tracking-wider mb-2 group-hover:text-emerald-500 transition-colors">Growth Frameworks</h2>
            <p className="text-sm text-zinc-400 mb-6 font-medium">Personal development articles, life-optimization strategies, and mental models.</p>
            <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-widest mt-auto">
              <span>Read Articles</span>
              <SafeIcon icon={LuIcons.LuArrowRight} className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
