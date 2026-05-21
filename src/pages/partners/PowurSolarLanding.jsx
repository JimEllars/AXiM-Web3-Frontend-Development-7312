import React from 'react';
import SEO from '../../components/SEO';
import SafeIcon from '../../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';

export default function PowurSolarLanding() {
  const affiliateLink = "https://powur.com/axim/solar";

  const solarSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Solar Energy Installation",
    "provider": {
      "@type": "Organization",
      "name": "Powur"
    },
    "areaServed": "US",
    "description": "Decentralized tier-1 residential solar installation and grid freedom provided via the AXiM partner network.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "description": "Zero-down financing options available."
    }
  };

  return (
    <div className="w-full min-h-screen bg-bg-void relative z-10 pb-32">
      <SEO
        title="Decentralize Your Energy | AXiM x Powur"
        description="Transition to clean, Tier-1 residential solar. Take ownership of your power production with zero-down financing."
        customSchema={[solarSchema]}
      />

      <section className="pt-32 pb-16 relative overflow-hidden bg-black border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(240,255,0,0.1),transparent_50%)] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <SafeIcon icon={LuIcons.LuSun} className="w-12 h-12 text-axim-gold mx-auto mb-6" />
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white leading-tight mb-6">
            Decentralize Your <br/><span className="text-axim-gold">Power Grid.</span>
          </h1>
          <p className="text-zinc-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed mb-10">
            Stop leasing energy from centralized utility monopolies. AXiM has partnered with Powur to deliver Tier-1 residential solar. Take ownership of your production with zero-down financing.
          </p>
          <a href={affiliateLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-10 py-5 bg-axim-gold text-black font-black uppercase tracking-widest text-xs hover:bg-white transition-colors shadow-[0_0_30px_rgba(240,255,0,0.3)] rounded-sm">
            Calculate Energy Savings <SafeIcon icon={LuIcons.LuArrowRight} className="ml-3 w-4 h-4" />
          </a>
        </div>
      </section>
    </div>
  );
}
