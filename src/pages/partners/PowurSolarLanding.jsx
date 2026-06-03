import React from 'react';
import SEO from '../../components/SEO';
import SafeIcon from '../../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';

export default function PowurSolarLanding() {
  const affiliateLink = "https://powur.com/axim/solar";

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

  return (
    <div className="w-full min-h-screen bg-bg-void relative z-10 pb-32">
      <SEO
        title="Decentralized Energy Grids | AXiM x Powur Solar"
        description="Stop leasing power from centralized utilities. Transition to clean, Tier-1 residential solar infrastructure with zero-down financing."
        customSchema={[solarSchema]}
      />

      {/* Saturated Neon Gold Hero Canvas */}
      <section className="pt-32 pb-24 relative overflow-hidden bg-black border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,234,0,0.15),transparent_60%)] pointer-events-none" />
        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
          <div className="w-14 h-14 bg-gradient-to-br from-axim-gold to-yellow-600 rounded flex items-center justify-center mx-auto mb-6 shadow-[0_0_25px_rgba(255,234,0,0.4)]">
            <SafeIcon icon={LuIcons.LuSun} className="w-6 h-6 text-black" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white leading-none mb-6">
            Decentralized Home <br/><span className="text-axim-gold">Energy Infrastructure.</span>
          </h1>
          <p className="text-zinc-400 text-sm md:text-base max-w-3xl mx-auto leading-relaxed mb-12">
            Stop leasing power from centralized utility monopolies. AXiM's partnership with the Powur fulfillment grid allows homeowners to transition to Tier-1 solar panels, advanced micro-inverters, and high-capacity battery storage with zero-down financing options.
          </p>
          <a href={affiliateLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-10 py-5 bg-axim-gold text-black font-black uppercase tracking-widest text-xs hover:bg-white transition-colors shadow-[0_0_30px_rgba(255,234,0,0.3)] rounded-sm">
            Calculate Energy Offsets <SafeIcon icon={LuIcons.LuArrowRight} className="ml-3 w-4 h-4" />
          </a>
        </div>
      </section>

      {/* Advanced Infrastructure Matrix */}
      <section className="max-w-7xl mx-auto px-6 py-24 space-y-24">
        <div>
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
        </div>
      </section>
    </div>
  );
}
