import React from 'react';
import SEO from '../../components/SEO';
import SafeIcon from '../../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';

export default function NdaGeneratorLanding() {
  const ndaSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Mutual NDA Generator",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "provider": {
      "@type": "Organization",
      "name": "AXiM Systems"
    },
    "description": "Generate balanced, two-way non-disclosure agreements optimized for technology, software, and intellectual property collaborations.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <div className="w-full min-h-screen bg-bg-void relative z-10 pb-32">
      <SEO
        title="Mutual NDA Generator | AXiM Systems"
        description="Protect your intellectual property. Generate a balanced, enterprise-grade Mutual Non-Disclosure Agreement in seconds."
        customSchema={[ndaSchema]}
      />

      {/* Upgraded Multi-Color Hero */}
      <section className="pt-32 pb-20 relative overflow-hidden bg-black border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-tr from-axim-purple/20 via-transparent to-axim-purple/10 mix-blend-overlay z-0" />
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-axim-purple to-[#DB2777] rounded flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(147,51,234,0.3)]">
            <SafeIcon icon={LuIcons.LuShieldCheck} className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white leading-tight mb-6">
            Mutual NDA <br/><span className="text-axim-purple">Generator.</span>
          </h1>
          <p className="text-zinc-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed mb-10">
            Protect your operational blueprints before entering into B2B consultations. Generate a balanced, two-way non-disclosure agreement optimized for technology and software collaborations.
          </p>
          <button className="inline-flex items-center justify-center px-10 py-5 bg-axim-purple text-white font-black uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-colors shadow-[0_0_30px_rgba(147,51,234,0.3)] rounded-sm">
            Launch Generator <SafeIcon icon={LuIcons.LuArrowRight} className="ml-3 w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Architecture Matrix */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="flex items-center gap-3 mb-10 border-b border-white/10 pb-4">
          <SafeIcon icon={LuIcons.LuSettings} className="w-6 h-6 text-axim-purple" />
          <h2 className="text-2xl font-black uppercase tracking-tighter text-white">System Capabilities</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-[#0F172A] border border-white/5 p-8 rounded-sm shadow-xl">
             <SafeIcon icon={LuIcons.LuScale} className="w-6 h-6 text-zinc-400 mb-4" />
             <h3 className="text-white font-black uppercase tracking-widest text-sm mb-2">Symmetric Protection</h3>
             <p className="text-xs text-zinc-400 leading-relaxed">Unlike predatory one-way NDAs, our generator structures clauses that equally protect both parties, facilitating faster trust and signature acquisition.</p>
           </div>
           <div className="bg-[#0F172A] border border-white/5 p-8 rounded-sm shadow-xl">
             <SafeIcon icon={LuIcons.LuFileCode2} className="w-6 h-6 text-zinc-400 mb-4" />
             <h3 className="text-white font-black uppercase tracking-widest text-sm mb-2">Instant Extraction</h3>
             <p className="text-xs text-zinc-400 leading-relaxed">Input your entity parameters and instantly extract a legally formatted, print-ready document tailored to modern software interactions.</p>
           </div>
        </div>
      </section>
    </div>
  );
}
