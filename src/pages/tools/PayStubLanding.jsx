import React from 'react';
import SEO from '../../components/SEO';
import SafeIcon from '../../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';

export default function PayStubLanding() {
  const payStubSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Autonomous Pay Stub System",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "provider": {
      "@type": "Organization",
      "name": "AXiM Systems"
    },
    "description": "Standardize your payroll documentation. Generate mathematically verified, professional pay stubs instantly.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <div className="w-full min-h-screen bg-bg-void relative z-10 pb-32">
      <SEO
        title="Pay Stub Generator | AXiM Systems"
        description="Standardize your payroll documentation. Input earnings and deductions to generate instant, mathematically verified pay stubs."
        customSchema={[payStubSchema]}
      />

      <section className="pt-32 pb-20 relative overflow-hidden bg-black border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#DB2777]/20 via-transparent to-[#DB2777]/10 mix-blend-overlay z-0" />
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-[#DB2777] to-red-600 rounded flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(219,39,119,0.3)]">
            <SafeIcon icon={LuIcons.LuFileText} className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white leading-tight mb-6">
            Autonomous <br/><span className="text-[#DB2777]">Pay Stub System.</span>
          </h1>
          <p className="text-zinc-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed mb-10">
            Standardize your independent payroll documentation. Input gross earnings, tax parameters, and deductions into our processing node to receive an instant, mathematically verified document.
          </p>
          <button className="inline-flex items-center justify-center px-10 py-5 bg-[#DB2777] text-white font-black uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-colors shadow-[0_0_30px_rgba(219,39,119,0.3)] rounded-sm">
            Launch Interface <SafeIcon icon={LuIcons.LuArrowRight} className="ml-3 w-4 h-4" />
          </button>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="flex items-center gap-3 mb-10 border-b border-white/10 pb-4">
          <SafeIcon icon={LuIcons.LuSettings} className="w-6 h-6 text-[#DB2777]" />
          <h2 className="text-2xl font-black uppercase tracking-tighter text-white">System Capabilities</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-[#0F172A] border border-white/5 p-8 rounded-sm shadow-xl">
             <SafeIcon icon={LuIcons.LuCalculator} className="w-6 h-6 text-zinc-400 mb-4" />
             <h3 className="text-white font-black uppercase tracking-widest text-sm mb-2">Automated Routing</h3>
             <p className="text-xs text-zinc-400 leading-relaxed">Our engine automatically computes state and federal deduction algorithms based on your gross inputs, ensuring mathematical accuracy across the document.</p>
           </div>
           <div className="bg-[#0F172A] border border-white/5 p-8 rounded-sm shadow-xl">
             <SafeIcon icon={LuIcons.LuPrinter} className="w-6 h-6 text-zinc-400 mb-4" />
             <h3 className="text-white font-black uppercase tracking-widest text-sm mb-2">Standardized Layouts</h3>
             <p className="text-xs text-zinc-400 leading-relaxed">Generates clean, professional PDF formats that adhere to standard accounting layouts, ready for immediate printing or secure transmission.</p>
           </div>
        </div>
      </section>
    </div>
  );
}
