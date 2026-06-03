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

      {/* Upgraded Multi-Color Hero */}
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

      {/* Architecture Matrix */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex items-center gap-3 mb-10 border-b border-white/10 pb-4">
          <SafeIcon icon={LuIcons.LuSettings} className="w-6 h-6 text-[#DB2777]" />
          <h2 className="text-2xl font-black uppercase tracking-tighter text-white">System Capabilities</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-[#050505] border border-white/5 p-8 rounded-sm shadow-xl hover:border-[#DB2777]/30 transition-colors">
             <div className="text-[#DB2777] text-xs font-mono uppercase tracking-widest mb-3 flex items-center gap-2">
               <SafeIcon icon={LuIcons.LuCalculator} className="w-4 h-4" /> 01 // Computational Accuracy
             </div>
             <h3 className="text-white font-black text-lg uppercase tracking-tight mb-2">Automated Routing</h3>
             <p className="text-xs text-zinc-400 leading-relaxed">Our engine automatically computes complex deduction algorithms based on your gross inputs, ensuring mathematical accuracy across the document without manual spreadsheet errors.</p>
           </div>
           <div className="bg-[#050505] border border-white/5 p-8 rounded-sm shadow-xl hover:border-[#DB2777]/30 transition-colors">
             <div className="text-[#DB2777] text-xs font-mono uppercase tracking-widest mb-3 flex items-center gap-2">
               <SafeIcon icon={LuIcons.LuPrinter} className="w-4 h-4" /> 02 // Document Compliance
             </div>
             <h3 className="text-white font-black text-lg uppercase tracking-tight mb-2">Standardized Layouts</h3>
             <p className="text-xs text-zinc-400 leading-relaxed">Generates clean, professional PDF formats that adhere to strict accounting layouts, ready for immediate printing or secure transmission to your employees.</p>
           </div>
        </div>
      </section>

      {/* Enterprise Use Cases */}
      <section className="bg-[#0F172A] border-y border-white/10 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black uppercase tracking-tighter text-white mb-4">Common Applications</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-sm">Essential documentation scenarios for independent operators.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="flex gap-6">
               <SafeIcon icon={LuIcons.LuBuilding} className="w-8 h-8 text-[#DB2777] shrink-0" />
               <div>
                 <h4 className="text-white font-black uppercase tracking-widest text-sm mb-2">Small Business Payroll</h4>
                 <p className="text-zinc-400 text-xs leading-relaxed">If you manage a small team or run an LLC, providing professional documentation is crucial for both transparency and tax compliance. Generate official stubs in seconds without expensive payroll software.</p>
               </div>
            </div>
            <div className="flex gap-6">
               <SafeIcon icon={LuIcons.LuUser} className="w-8 h-8 text-[#DB2777] shrink-0" />
               <div>
                 <h4 className="text-white font-black uppercase tracking-widest text-sm mb-2">Independent Contractors</h4>
                 <p className="text-zinc-400 text-xs leading-relaxed">Freelancers and 1099 contractors often need to verify their income when securing housing or applying for loans. Synthesize your scattered invoices into a single, standardized proof-of-income document.</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Conversion Block */}
      <section className="py-24 relative overflow-hidden bg-black text-center">
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white mb-6">Standardize Your Docs. <br/>Stay Compliant.</h2>
          <p className="text-zinc-400 text-sm mb-10">Eliminate spreadsheet math errors and elevate the professionalism of your operation.</p>
          <button className="inline-flex items-center justify-center px-12 py-5 bg-[#DB2777] text-white font-black uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-colors shadow-[0_0_30px_rgba(219,39,119,0.3)] rounded-sm">
            Initialize Generator <SafeIcon icon={LuIcons.LuArrowUpRight} className="ml-3 w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
