import React from 'react';
import { logTelemetry } from '../../lib/telemetry';
import SEO from '../../components/SEO';
import SafeIcon from '../../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';
import { motion } from 'framer-motion';

export default function PowurSolarLanding() {
  const affiliateLink = "https://powur.com/axim/solar?via=axim_hub";

  const solarSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Powur Residential Solar Infrastructure",
    "provider": {
      "@type": "Organization",
      "name": "AXiM Partner Grid"
    },
    "description": "Decentralize your home energy grid. Tier-1 residential solar installation, micro-inverters, and battery backup architecture.",
    "areaServed": {
      "@type": "Country",
      "name": "United States"
    }
  };

  const handlePartnerRedirect = async (e, placement) => {
    e.preventDefault();

    // Promise-backed telemetry handler
    await new Promise(resolve => {
      logTelemetry('PARTNER_FUNNEL_REDIRECT', { destination: 'powursolar', origin: 'axim_hub', placement });
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "outbound_partner_click", {
          event_category: "conversion",
          event_label: "powursolar"
        });
      }
      setTimeout(resolve, 150);
    });

    window.open(affiliateLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div className="w-full min-h-screen bg-bg-void relative z-10 pb-32"
      onViewportEnter={() => {
        logTelemetry('partner_landing_viewed', { partner: 'powur_solar' });
      }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <SEO
        title="Decentralized Energy Grids | AXiM x Powur Solar"
        description="Stop leasing power from centralized utilities. Transition to clean, Tier-1 residential solar infrastructure with zero-down financing."
        customSchema={[solarSchema]}
      />

      {/* Saturated Neon Gold Hero Canvas */}
      <section className="pt-32 pb-24 relative overflow-hidden bg-black border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,234,0,0.15),transparent_60%)] pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-5xl mx-auto px-6 relative z-10 text-center"
        >
          <div className="w-14 h-14 bg-gradient-to-br from-axim-gold to-yellow-600 rounded flex items-center justify-center mx-auto mb-6 shadow-[0_0_25px_rgba(255,234,0,0.4)]">
            <SafeIcon icon={LuIcons.LuSun} className="w-6 h-6 text-black" />
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-white leading-none mb-6">
            Decentralized Home <br/><span className="text-axim-gold">Energy Infrastructure.</span>
          </h1>
          <p className="text-zinc-400 text-sm md:text-base max-w-3xl mx-auto leading-relaxed mb-12">
            Stop leasing power from centralized utility monopolies. AXiM's partnership with the Powur fulfillment grid allows homeowners to transition to Tier-1 solar panels, advanced micro-inverters, and high-capacity battery storage with zero-down enterprise financing options.
          </p>
          <a href={affiliateLink} onClick={(e) => handlePartnerRedirect(e, 'hero_button')} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-10 py-5 bg-axim-gold text-black font-black uppercase tracking-widest text-xs hover:bg-white transition-colors shadow-[0_0_30px_rgba(255,234,0,0.3)] rounded-sm">
            Calculate Energy Offsets <SafeIcon icon={LuIcons.LuArrowRight} className="ml-3 w-4 h-4" />
          </a>
        </motion.div>
      </section>

      {/* Trusted By / Features Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.2 }}
        className="py-8 bg-[#050505] border-b border-white/5"
      >
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest mb-4">Enterprise Grade Hardware Partners</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 text-zinc-600 font-black text-sm md:text-base uppercase tracking-wider grayscale opacity-70">
            <span>Enphase</span>
            <span>Tesla</span>
            <span>SolarEdge</span>
            <span>QCells</span>
          </div>
        </div>
      </motion.section>

      {/* Advanced Infrastructure Matrix */}
      <section className="max-w-7xl mx-auto px-6 py-24 space-y-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-4">
            <SafeIcon icon={LuIcons.LuZap} className="w-6 h-6 text-axim-gold" />
            <h2 className="text-2xl font-black uppercase tracking-tighter text-white">System Architecture</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="bg-[#050505] border border-white/5 p-8 rounded-sm shadow-xl hover:border-axim-gold/30 transition-colors">
               <div className="text-axim-gold text-xs font-mono uppercase tracking-widest mb-3 flex items-center gap-2">
                 <SafeIcon icon={LuIcons.LuPanelTop} className="w-4 h-4" /> 01 // Tier-1 Hardware
               </div>
               <h3 className="text-white font-black text-lg uppercase tracking-tight mb-2">Monocrystalline Arrays</h3>
               <p className="text-xs text-zinc-400 leading-relaxed">We bypass inferior legacy panels. Our fulfillment network exclusively installs high-efficiency, Tier-1 monocrystalline solar panels engineered for maximum capture density and extreme weather resistance.</p>
             </div>
             <div className="bg-[#050505] border border-white/5 p-8 rounded-sm shadow-xl hover:border-axim-gold/30 transition-colors">
               <div className="text-axim-gold text-xs font-mono uppercase tracking-widest mb-3 flex items-center gap-2">
                 <SafeIcon icon={LuIcons.LuBatteryCharging} className="w-4 h-4" /> 02 // Load Balancing
               </div>
               <h3 className="text-white font-black text-lg uppercase tracking-tight mb-2">Battery Vault Integration</h3>
               <p className="text-xs text-zinc-400 leading-relaxed">Secure your surplus energy. Seamlessly integrate smart battery storage to power your home during nocturnal cycles or centralized grid blackout events.</p>
             </div>
             <div className="bg-[#050505] border border-white/5 p-8 rounded-sm shadow-xl hover:border-axim-gold/30 transition-colors">
               <div className="text-axim-gold text-xs font-mono uppercase tracking-widest mb-3 flex items-center gap-2">
                 <SafeIcon icon={LuIcons.LuChartLine} className="w-4 h-4" /> 03 // Economic Yield
               </div>
               <h3 className="text-white font-black text-lg uppercase tracking-tight mb-2">Zero-Down Deployment</h3>
               <p className="text-xs text-zinc-400 leading-relaxed">Shift your capital expenditure. Replace fluctuating, indefinite utility rentals with a fixed, zero-down solar financing model that builds equity in your own localized power plant.</p>
             </div>
          </div>
        </motion.div>
      </section>

      {/* Final Conversion Block */}
      <section className="py-24 relative overflow-hidden bg-black text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto px-6 relative z-10"
        >
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white mb-6">Own Your Energy. <br/>Lock In Your Rate.</h2>
          <p className="text-zinc-400 text-sm mb-10">Protect your household from indefinite utility rate hikes with a decentralized solar array.</p>
          <a href={affiliateLink} onClick={(e) => handlePartnerRedirect(e, 'footer_button')} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-12 py-5 bg-axim-gold text-black font-black uppercase tracking-widest text-xs hover:bg-white transition-colors shadow-[0_0_30px_rgba(255,234,0,0.3)] rounded-sm">
            Calculate Savings <SafeIcon icon={LuIcons.LuArrowUpRight} className="ml-3 w-4 h-4" />
          </a>
        </motion.div>
      </section>

      {/* Sticky Mobile CTA */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-[#050505] border-t border-white/10 p-4 z-50 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-white font-black text-xs uppercase tracking-widest">Powur Solar</span>
          <span className="text-axim-gold text-[0.65rem] font-mono uppercase tracking-widest">Zero Down</span>
        </div>
        <a
          href={affiliateLink}
          onClick={(e) => handlePartnerRedirect(e, 'sticky_mobile')}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 bg-axim-gold text-black font-black uppercase tracking-widest text-[0.65rem] hover:bg-white transition-colors rounded-sm shadow-[0_0_15px_rgba(255,234,0,0.3)]"
        >
          Get Quote
        </a>
      </div>
    </motion.div>
  );
}
