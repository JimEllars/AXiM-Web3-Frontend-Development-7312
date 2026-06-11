import React from 'react';
import SEO from '../../components/SEO';
import SafeIcon from '../../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';

export default function PowurJoinLanding() {
  const affiliateLink = "https://powur.com/axim/join";

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

  return (
    <div className="w-full min-h-screen bg-bg-void relative z-10 pb-32">
      <SEO
        title="Launch Your Solar Agency | AXiM x Powur"
        description="Build a decentralized solar enterprise. Leverage Powur's national fulfillment grid while keeping your own margins."
        customSchema={[agencySchema]}
      />

      {/* Saturated Neon Purple Hero Canvas */}
      <section className="pt-32 pb-24 relative overflow-hidden bg-black border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(147,51,234,0.15),transparent_60%)] pointer-events-none" />
        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
          <div className="w-14 h-14 bg-gradient-to-br from-axim-purple to-indigo-600 rounded flex items-center justify-center mx-auto mb-6 shadow-[0_0_25px_rgba(147,51,234,0.4)]">
            <SafeIcon icon={LuIcons.LuBriefcase} className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white leading-none mb-6">
            Build Your Own <br/><span className="text-axim-purple">Energy Enterprise.</span>
          </h1>
          <p className="text-zinc-400 text-sm md:text-base max-w-3xl mx-auto leading-relaxed mb-12">
            You secure the contracts. Powur handles the engineering, permitting, and installation. Leverage a decentralized, cloud-based platform to scale your own national solar agency with zero upfront hardware overhead.
          </p>
          <a href={affiliateLink} onClick={() => { if(typeof window !== "undefined" && window.gtag) window.gtag("event", "outbound_partner_click", { event_category: "conversion", event_label: "Powur Join" }); }} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-10 py-5 bg-axim-purple text-white font-black uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-colors shadow-[0_0_30px_rgba(147,51,234,0.3)] rounded-sm">
            Initialize Agency Protocol <SafeIcon icon={LuIcons.LuArrowRight} className="ml-3 w-4 h-4" />
          </a>
        </div>
      </section>

      {/* High-Fidelity Operational Vectors Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 space-y-24">
        <div>
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
               <p className="text-xs text-zinc-400 leading-relaxed">No trucks. No warehouses. No massive payroll. You operate entirely through a cloud portal while Powur’s vetted national network handles the physical deployment of every contract you close.</p>
             </div>
             <div className="bg-[#050505] border border-white/5 p-8 rounded-sm shadow-xl hover:border-axim-purple/30 transition-colors">
               <div className="text-axim-purple text-xs font-mono uppercase tracking-widest mb-3 flex items-center gap-2">
                 <SafeIcon icon={LuIcons.LuBuilding2} className="w-4 h-4" /> 02 // Agency Modeling
               </div>
               <h3 className="text-white font-black text-lg uppercase tracking-tight mb-2">Revenue Share Cascades</h3>
               <p className="text-xs text-zinc-400 leading-relaxed">Build an organization, not just a job. Recruit and train independent operators under your umbrella. The platform automatically tracks overrides and pays out compounding revenue loops to your agency.</p>
             </div>
             <div className="bg-[#050505] border border-white/5 p-8 rounded-sm shadow-xl hover:border-axim-purple/30 transition-colors">
               <div className="text-axim-purple text-xs font-mono uppercase tracking-widest mb-3 flex items-center gap-2">
                 <SafeIcon icon={LuIcons.LuTrendingUp} className="w-4 h-4" /> 03 // Margin Control
               </div>
               <h3 className="text-white font-black text-lg uppercase tracking-tight mb-2">Dynamic Proposal Pricing</h3>
               <p className="text-xs text-zinc-400 leading-relaxed">You control the economics. Adjust margins, add custom adders (like roof replacements or tree removal), and instantly generate legally binding, digital-signature-ready proposals on the fly.</p>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}
