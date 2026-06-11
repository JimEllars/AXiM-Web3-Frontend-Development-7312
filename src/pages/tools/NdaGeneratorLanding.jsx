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
          <button onClick={() => { if(typeof window !== "undefined" && window.gtag) window.gtag("event", "launch_tool", { event_category: "conversion", event_label: "NDA Generator" }); }} className="inline-flex items-center justify-center px-10 py-5 bg-axim-purple text-white font-black uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-colors shadow-[0_0_30px_rgba(147,51,234,0.3)] rounded-sm">
            Launch Generator <SafeIcon icon={LuIcons.LuArrowRight} className="ml-3 w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Architecture Matrix */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex items-center gap-3 mb-10 border-b border-white/10 pb-4">
          <SafeIcon icon={LuIcons.LuSettings} className="w-6 h-6 text-axim-purple" />
          <h2 className="text-2xl font-black uppercase tracking-tighter text-white">System Capabilities</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-[#050505] border border-white/5 p-8 rounded-sm shadow-xl hover:border-axim-purple/30 transition-colors">
             <div className="text-axim-purple text-xs font-mono uppercase tracking-widest mb-3 flex items-center gap-2">
               <SafeIcon icon={LuIcons.LuScale} className="w-4 h-4" /> 01 // Fairness Standard
             </div>
             <h3 className="text-white font-black text-lg uppercase tracking-tight mb-2">Symmetric Protection</h3>
             <p className="text-xs text-zinc-400 leading-relaxed">Unlike predatory one-way NDAs, our generator structures clauses that equally protect both parties, facilitating faster trust and signature acquisition during negotiations.</p>
           </div>
           <div className="bg-[#050505] border border-white/5 p-8 rounded-sm shadow-xl hover:border-axim-purple/30 transition-colors">
             <div className="text-axim-purple text-xs font-mono uppercase tracking-widest mb-3 flex items-center gap-2">
               <SafeIcon icon={LuIcons.LuFileCode2} className="w-4 h-4" /> 02 // Rapid Deployment
             </div>
             <h3 className="text-white font-black text-lg uppercase tracking-tight mb-2">Instant Extraction</h3>
             <p className="text-xs text-zinc-400 leading-relaxed">Input your entity parameters and instantly extract a legally formatted, print-ready document tailored specifically to modern software and intellectual property interactions.</p>
           </div>
        </div>
      </section>

      {/* Enterprise Use Cases */}
      <section className="bg-[#0F172A] border-y border-white/10 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black uppercase tracking-tighter text-white mb-4">When To Use A Mutual NDA</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-sm">Common scenarios where reciprocal protection is mandatory.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="flex gap-6">
               <SafeIcon icon={LuIcons.LuBriefcase} className="w-8 h-8 text-axim-purple shrink-0" />
               <div>
                 <h4 className="text-white font-black uppercase tracking-widest text-sm mb-2">Joint Ventures & Mergers</h4>
                 <p className="text-zinc-400 text-xs leading-relaxed">Before sharing financial records, customer lists, or proprietary algorithms with a potential partner, ensure both sides are legally bound to absolute confidentiality.</p>
               </div>
            </div>
            <div className="flex gap-6">
               <SafeIcon icon={LuIcons.LuCode} className="w-8 h-8 text-axim-purple shrink-0" />
               <div>
                 <h4 className="text-white font-black uppercase tracking-widest text-sm mb-2">Contractor Onboarding</h4>
                 <p className="text-zinc-400 text-xs leading-relaxed">When hiring external development teams or marketing agencies, protect your trade secrets while simultaneously giving them the confidence that their bespoke strategies are safe with you.</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Conversion Block */}
      <section className="py-24 relative overflow-hidden bg-black text-center">
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white mb-6">Secure Your Data. <br/>Move Faster.</h2>
          <p className="text-zinc-400 text-sm mb-10">Don't let legal friction slow down your deals. Generate a standard, fair agreement in under 60 seconds.</p>
          <button onClick={() => { if(typeof window !== "undefined" && window.gtag) window.gtag("event", "launch_tool", { event_category: "conversion", event_label: "NDA Generator" }); }} className="inline-flex items-center justify-center px-12 py-5 bg-axim-purple text-white font-black uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-colors shadow-[0_0_30px_rgba(147,51,234,0.3)] rounded-sm">
            Initialize Document <SafeIcon icon={LuIcons.LuArrowUpRight} className="ml-3 w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
