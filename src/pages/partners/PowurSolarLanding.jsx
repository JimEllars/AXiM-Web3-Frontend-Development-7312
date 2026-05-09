import React from 'react';
import { motion } from 'framer-motion';
import SEO from '../../components/SEO';
import SafeIcon from '../../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';

const solarSeoSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "AXiM x Powur | Enterprise-Grade Residential Solar",
  "description": "Stop overpaying for grid power. Decentralize your energy with zero-down residential solar through AXiM and Powur.",
  "offers": { "@type": "Offer", "url": "https://powur.com/axim/solar" }
};

export default function PowurSolarLanding() {
  const affiliateLink = "https://powur.com/axim/solar";

  return (
    <div className="w-full relative z-10">
      <SEO title="AXiM x Powur | Residential Solar" description="Decentralize your energy with zero-down residential solar through AXiM and Powur." customSchema={[solarSeoSchema]} />

      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-bg-void border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(240,255,0,0.05)_1px,transparent_1px)] [background-size:40px_40px] pointer-events-none" />
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[80%] h-[60%] bg-axim-gold/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: "circOut" }} className="inline-flex items-center space-x-3 px-4 py-1.5 rounded-sm bg-white/5 border border-white/10 text-sm font-medium mb-8 backdrop-blur-md">
            <span className="text-white font-black tracking-tight uppercase">Powur</span>
            <SafeIcon icon={LuIcons.LuX} className="w-3 h-3 text-zinc-500" />
            <span className="text-axim-gold font-bold tracking-tight uppercase">AXiM</span>
            <div className="w-1 h-1 rounded-full bg-zinc-600 mx-2"></div>
            <span className="text-zinc-400 font-mono text-[0.65rem] uppercase tracking-widest">Official Infrastructure Partner</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1, ease: "circOut" }} className="text-5xl md:text-7xl font-black tracking-tighter mb-6 text-white uppercase leading-tight">
            Decentralize Your <br /> <span className="text-axim-gold drop-shadow-[0_0_15px_rgba(240,255,0,0.3)]">Grid Power.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2, ease: "circOut" }} className="text-lg text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Stop renting electricity from monopolies. Through our partnership with Powur, upgrade to a customized, zero-down solar system and take ownership of your energy production.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3, ease: "circOut" }}>
            <a href={affiliateLink} target="_blank" rel="noopener noreferrer" className="inline-flex justify-center items-center px-10 py-5 rounded-sm bg-axim-gold text-black font-black uppercase tracking-widest text-xs hover:bg-white hover:scale-105 transition-all shadow-[0_0_30px_rgba(240,255,0,0.2)]">
              Request Free Solar Proposal
              <SafeIcon icon={LuIcons.LuSun} className="ml-3 w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-axim-deep/30 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white/5 border border-white/10 p-8 rounded-sm hover:border-axim-gold/50 transition-colors group">
              <div className="w-12 h-12 rounded bg-axim-gold/20 flex items-center justify-center mb-6 group-hover:bg-axim-gold group-hover:text-black text-axim-gold transition-colors">
                <SafeIcon icon={LuIcons.LuBatteryCharging} className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black uppercase tracking-tighter text-white mb-3">Tier-1 Hardware</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">We source only the highest quality panels and battery backups to ensure your grid is resilient, efficient, and future-proof.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="bg-white/5 border border-white/10 p-8 rounded-sm hover:border-axim-gold/50 transition-colors group">
              <div className="w-12 h-12 rounded bg-axim-gold/20 flex items-center justify-center mb-6 group-hover:bg-axim-gold group-hover:text-black text-axim-gold transition-colors">
                <SafeIcon icon={LuIcons.LuBadgeDollarSign} className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black uppercase tracking-tighter text-white mb-3">Zero-Down Options</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">Swap your unpredictable electric bill for a fixed, lower monthly solar payment with no upfront out-of-pocket capital required.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="bg-white/5 border border-white/10 p-8 rounded-sm hover:border-axim-gold/50 transition-colors group">
              <div className="w-12 h-12 rounded bg-axim-gold/20 flex items-center justify-center mb-6 group-hover:bg-axim-gold group-hover:text-black text-axim-gold transition-colors">
                <SafeIcon icon={LuIcons.LuShieldCheck} className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black uppercase tracking-tighter text-white mb-3">30-Year Warranty</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">Sleep easy with an industry-leading 30-year warranty covering your panels, inverters, roof penetrations, and performance.</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
