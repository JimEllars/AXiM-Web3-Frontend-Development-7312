import React from 'react';
import { logTelemetry } from '../../lib/telemetry';
import SEO from '../../components/SEO';
import SafeIcon from '../../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';
import { motion } from 'framer-motion';

export default function PowurJoinLanding() {
  const affiliateLink = "https://powur.com/axim/join?via=axim_hub";

  const agencySchema = {
    "@context": "https://schema.org",
    "@type": "B2BBusiness",
    "name": "Powur Solar Agency Partnership",
    "description": "Establish a decentralized solar agency and scale your own renewable energy business without overhead or installation logistics.",
    "provider": {
      "@type": "Organization",
      "name": "AXiM Partner Network"
    },
    "offers": {
      "@type": "Offer",
      "description": "Enterprise solar sales platform and fulfillment infrastructure."
    }
  };

  const handlePartnerRedirect = async (e, placement) => {
    e.preventDefault();

    // Promise-backed telemetry handler
    await new Promise(resolve => {
      logTelemetry('PARTNER_FUNNEL_REDIRECT', { destination: 'powur', origin: 'axim_hub', placement });
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "outbound_partner_click", {
          event_category: "conversion",
          event_label: "powur"
        });
      }
      setTimeout(resolve, 150);
    });

    window.open(affiliateLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div className="w-full min-h-screen bg-bg-void relative z-10 pb-32"
      onViewportEnter={() => {
        logTelemetry('partner_landing_viewed', { partner: 'powur_join' });
      }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <SEO
        title="Launch Your Solar Agency | AXiM x Powur"
        description="Build a decentralized solar enterprise. Leverage Powur's national fulfillment grid while keeping your own margins."
        customSchema={[agencySchema]}
      />

      {/* Saturated Neon Purple Hero Canvas */}
      <section className="pt-32 pb-24 relative overflow-hidden bg-black border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(147,51,234,0.15),transparent_60%)] pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-5xl mx-auto px-6 relative z-10 text-center"
        >
          <div className="w-14 h-14 bg-gradient-to-br from-axim-purple to-indigo-600 rounded flex items-center justify-center mx-auto mb-6 shadow-[0_0_25px_rgba(147,51,234,0.4)]">
            <SafeIcon icon={LuIcons.LuBriefcase} className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-white leading-none mb-6">
            Build Your Own <br/><span className="text-axim-purple">Energy Enterprise.</span>
          </h1>
          <p className="text-zinc-400 text-sm md:text-base max-w-3xl mx-auto leading-relaxed mb-12">
            You secure the contracts. Powur handles the engineering, permitting, and installation. Leverage a decentralized, enterprise-grade cloud platform to scale your own national solar agency with zero upfront hardware overhead and maximum margin control.
          </p>
          <a href={affiliateLink} onClick={(e) => handlePartnerRedirect(e, 'hero_button')} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-10 py-5 bg-axim-purple text-white font-black uppercase tracking-widest text-xs hover:bg-white hover:text-black hover:shadow-[0_0_40px_currentColor]  transition-colors shadow-[0_0_30px_rgba(147,51,234,0.3)] rounded-sm">
            Initialize Agency Protocol <SafeIcon icon={LuIcons.LuArrowRight} className="ml-3 w-4 h-4" />
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
          <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest mb-4">Powered By Industry Leaders</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 text-zinc-600 font-black text-sm md:text-base uppercase tracking-wider grayscale opacity-70">
            <span>Enphase</span>
            <span>Tesla</span>
            <span>SolarEdge</span>
            <span>QCells</span>
          </div>
        </div>
      </motion.section>

      {/* High-Fidelity Operational Vectors Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 space-y-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-4">
            <SafeIcon icon={LuIcons.LuNetwork} className="w-6 h-6 text-axim-purple" />
            <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Operational Scale Modalities</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="bg-[#050505] border border-white/5 p-8 rounded-sm shadow-xl hover:border-axim-purple/30 transition-colors">
               <div className="text-axim-purple text-xs font-mono uppercase tracking-widest mb-3 flex items-center gap-2">
                 <SafeIcon icon={LuIcons.LuCloudCog} className="w-4 h-4" /> 01 // Cloud Infrastructure
               </div>
               <h3 className="text-white font-black text-lg uppercase tracking-tight mb-2">Decentralized Fulfillment</h3>
               <p className="text-xs text-zinc-400 leading-relaxed">No trucks. No warehouses. No massive payroll. Operate entirely through a secure cloud portal while a vetted national fulfillment network handles physical deployment, logistics, and interconnects for every contract.</p>
             </div>
             <div className="bg-[#050505] border border-white/5 p-8 rounded-sm shadow-xl hover:border-axim-purple/30 transition-colors">
               <div className="text-axim-purple text-xs font-mono uppercase tracking-widest mb-3 flex items-center gap-2">
                 <SafeIcon icon={LuIcons.LuBuilding2} className="w-4 h-4" /> 02 // Agency Modeling
               </div>
               <h3 className="text-white font-black text-lg uppercase tracking-tight mb-2">Revenue Share Cascades</h3>
               <p className="text-xs text-zinc-400 leading-relaxed">Architect a scalable organization. Recruit, train, and manage independent operators under your agency umbrella. The platform's automated ledger tracks overrides and distributes compounding revenue loops instantly.</p>
             </div>
             <div className="bg-[#050505] border border-white/5 p-8 rounded-sm shadow-xl hover:border-axim-purple/30 transition-colors">
               <div className="text-axim-purple text-xs font-mono uppercase tracking-widest mb-3 flex items-center gap-2">
                 <SafeIcon icon={LuIcons.LuTrendingUp} className="w-4 h-4" /> 03 // Margin Control
               </div>
               <h3 className="text-white font-black text-lg uppercase tracking-tight mb-2">Dynamic Proposal Pricing</h3>
               <p className="text-xs text-zinc-400 leading-relaxed">Retain total economic authority. Adjust margins dynamically, integrate custom adders (roof replacements, tree removal, electrical upgrades), and generate digital-signature-ready enterprise proposals in seconds.</p>
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
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white mb-6">Scale Your Enterprise. <br/>Control Your Future.</h2>
          <p className="text-zinc-400 text-sm mb-10">Join the fastest-growing decentralized energy platform and build an agency that generates wealth without the operational overhead.</p>
          <a href={affiliateLink} onClick={(e) => handlePartnerRedirect(e, 'footer_button')} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-12 py-5 bg-axim-purple text-white font-black uppercase tracking-widest text-xs hover:bg-white hover:text-black hover:shadow-[0_0_40px_currentColor]  transition-colors shadow-[0_0_30px_rgba(147,51,234,0.3)] rounded-sm">
            Start Your Agency <SafeIcon icon={LuIcons.LuArrowUpRight} className="ml-3 w-4 h-4" />
          </a>
        </motion.div>
      </section>

      {/* Sticky Mobile CTA */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-[#050505] border-t border-white/10 p-4 z-50 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-white font-black text-xs uppercase tracking-widest">Powur Partner</span>
          <span className="text-axim-purple text-[0.65rem] font-mono uppercase tracking-widest">Launch Agency</span>
        </div>
        <a
          href={affiliateLink}
          onClick={(e) => handlePartnerRedirect(e, 'sticky_mobile')}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 bg-axim-purple text-white font-black uppercase tracking-widest text-[0.65rem] hover:bg-white hover:text-black hover:shadow-[0_0_40px_currentColor]  transition-colors rounded-sm shadow-[0_0_15px_rgba(147,51,234,0.3)]"
        >
          Join Now
        </a>
      </div>
    </motion.div>
  );
}
