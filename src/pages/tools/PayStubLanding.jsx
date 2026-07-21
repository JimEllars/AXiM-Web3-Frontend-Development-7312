import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SEO from '../../components/SEO';
import SafeIcon from '../../common/SafeIcon';
import DatabaseUplinkError from '../../common/DatabaseUplinkError';
import * as LuIcons from 'react-icons/lu';

import { logTelemetry } from '../../lib/telemetry';
import { sanitizeInput } from '../../lib/sanitize';

import { useNavigate } from 'react-router-dom';
import { useAximStore } from '../../store/useAximStore';
import { supabase } from '../../lib/supabase';

export default function PayStubLanding() {
  React.useEffect(() => {
    logTelemetry('APP_TOOL_ACCESSED', { toolName: 'paystub_generator' });
  }, []);
  const [showWizard, setShowWizard] = useState(false);

  const PAYSTUB_PRODUCTION_TARGET = 'https://quickpaystub.com/?via=axim_apps_and_tools';
  const isWeb3Authenticated = useAximStore((state) => state.isWeb3Authenticated);

  const handleOutboundClick = (e) => {
    e.preventDefault();
    const activeSessionOwner = useAximStore.getState().userSession?.user?.walletAddress || "GUEST_ANONYMOUS";
    logTelemetry('PAYSTUB_FUNNEL_REDIRECT', { destination: 'quickpaystub_production', origin: 'axim_apps_and_tools', activeSessionOwner });
    setTimeout(() => {
      window.open(PAYSTUB_PRODUCTION_TARGET, '_blank', 'noopener,noreferrer');
    }, 150);
  };

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [networkFault, setNetworkFault] = useState(false);
  const navigate = useNavigate();

    const addAsset = useAximStore((state) => state.addAsset);
    const showToast = useAximStore((state) => state.showToast);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setNetworkFault(false);

    const newAsset = {
      id: `PAY-${Date.now()}`,
      type: 'Pay Stub',
      date: new Date().toISOString(),
      status: 'Ready',
      icon: LuIcons.LuFileText,
      color: 'text-[#DB2777]'
    };

    try {
      await fetch('/api/vault/artifact-mirror', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ artifact: newAsset })
      });
    } catch (err) {
      console.error("Artifact mirror failure", err);
      setIsSubmitting(false);
      setNetworkFault(true);
      return;
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setShowWizard(false);

      const store = useAximStore.getState();
      store.showToast('Pay Stub Successfully Generated & Vaulted', 'success');

      if (store.addVaultedArtifact) {
        store.addVaultedArtifact(newAsset);
      } else {
        useAximStore.setState((state) => ({ vaultedArtifacts: [newAsset, ...state.vaultedArtifacts] }));
      }
    }, 500);
  };

  const payStubSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Autonomous Pay Stub System",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "provider": { "@type": "Organization", "name": "AXiM Systems" },
    "description": "Standardize your payroll documentation. Generate mathematically verified, professional pay stubs instantly."
  };

  return (

      <div className="w-full min-h-screen bg-bg-void relative z-10 pb-32">
      <SEO
        title="Web3 Income Verification | Cryptographic Proofs | AXiM Apps & Tools"
        description="Standardize your independent payroll documentation. Input gross earnings, tax parameters, and deductions into our processing node to receive an instant, mathematically verified document."
        image="https://axim-web3.com/og-paystub.jpg"
        customSchema={[payStubSchema]}
      />

      {/* Generation Wizard Modal */}
      {showWizard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#050505] border border-white/10 p-8 rounded-sm shadow-2xl relative overflow-hidden animate-fade-in-up">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#DB2777]/10 blur-[50px]" />

            <div className="flex justify-between items-center mb-6 relative z-10">
              <h3 className="text-xl font-black text-white uppercase tracking-tighter">Document Setup</h3>
              <button onClick={() => setShowWizard(false)} className="text-zinc-500 hover:text-white transition-colors">
                <SafeIcon icon={LuIcons.LuX} className="w-5 h-5" />
              </button>
            </div>

            <div className="flex gap-2 mb-8 relative z-10">
              <div className={`h-1 flex-1 rounded-full ${step >= 1 ? 'bg-[#DB2777]' : 'bg-white/10'}`} />
              <div className={`h-1 flex-1 rounded-full ${step >= 2 ? 'bg-[#DB2777]' : 'bg-white/10'}`} />
            </div>

                        {networkFault && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md rounded-sm p-4">
                <DatabaseUplinkError onRetry={() => setNetworkFault(false)} />
              </div>
            )}
            <form onSubmit={handleGenerate} className="relative z-10">
              {step === 1 ? (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <label className="block text-[0.65rem] font-mono text-zinc-500 uppercase tracking-widest mb-2 border-l-2 border-[#DB2777] pl-2">Company / Employer Name</label>
                    <input required type="text" className="w-full bg-[#0A0A0A] border border-white/10 p-3 text-white text-sm focus:border-[#DB2777] outline-none rounded-sm" placeholder="e.g. Acme Corp" />
                  </div>
                  <div>
                    <label className="block text-[0.65rem] font-mono text-zinc-500 uppercase tracking-widest mb-2 border-l-2 border-[#DB2777] pl-2">Employee Name</label>
                    <input required type="text" className="w-full bg-[#0A0A0A] border border-white/10 p-3 text-white text-sm focus:border-[#DB2777] outline-none rounded-sm" placeholder="e.g. John Doe" />
                  </div>
                  <button type="button" onClick={() => setStep(2)} className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-black uppercase tracking-widest transition-colors mt-4 rounded-sm">
                    Next Step
                  </button>
                </div>
              ) : (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <label className="block text-[0.65rem] font-mono text-zinc-500 uppercase tracking-widest mb-2 border-l-2 border-[#DB2777] pl-2">Gross Pay Amount ($)</label>
                    <input required type="number" step="0.01" className="w-full bg-[#0A0A0A] border border-white/10 p-3 text-white text-sm focus:border-[#DB2777] outline-none rounded-sm" placeholder="e.g. 5000.00" />
                  </div>
                  <div>
                    <label className="block text-[0.65rem] font-mono text-zinc-500 uppercase tracking-widest mb-2 border-l-2 border-[#DB2777] pl-2">Operator Email (For Delivery)</label>
                    <input required type="email" className="w-full bg-[#0A0A0A] border border-white/10 p-3 text-white text-sm focus:border-[#DB2777] outline-none rounded-sm" placeholder="operator@domain.com" />
                  </div>
                  <button disabled={isSubmitting} type="submit" className="w-full py-4 bg-[#DB2777] text-white text-xs font-black uppercase tracking-widest transition-colors mt-4 shadow-[0_0_20px_rgba(219,39,119,0.3)] disabled:opacity-50 flex justify-center items-center gap-2 rounded-sm">
                    {isSubmitting ? <><SafeIcon icon={LuIcons.LuLoader} className="w-4 h-4 animate-spin"/> Generating...</> : 'Generate Document'}
                  </button>
                  <button type="button" onClick={() => setStep(1)} className="w-full text-center text-[0.6rem] font-mono text-zinc-500 hover:text-white uppercase tracking-widest mt-2 underline">Back</button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Upgraded Multi-Color Hero */}
      <motion.section
        className="pt-32 pb-20 relative overflow-hidden bg-black border-b border-white/10"
        onViewportEnter={() => {
          logTelemetry('paystub_landing_viewed', { origin: 'apps_and_tools' });
        }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-[#DB2777]/20 via-transparent to-[#DB2777]/10 mix-blend-overlay z-0" />
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <div className="mb-6"></div>
          <div className="w-16 h-16 bg-gradient-to-br from-[#DB2777] to-red-600 rounded flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(219,39,119,0.3)]">
            <SafeIcon icon={LuIcons.LuFileText} className="w-8 h-8 text-white" />
          </div>

          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white leading-tight mb-6">
            Autonomous <br/><span className="text-[#DB2777]">Pay Stub System.</span>
          </h1>
          {isWeb3Authenticated && (
            <div className="mt-3 mb-6 inline-flex items-center gap-2 px-2.5 py-1 bg-axim-purple/10 border border-axim-purple/30 text-[9px] font-mono tracking-widest text-axim-purple uppercase rounded-sm select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-axim-purple animate-pulse" />
              [TOOL_NODE: AES_256_ACTIVE // STATELESS]
            </div>
          )}
          <p className="text-zinc-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed mb-10">
            Standardize your independent payroll documentation. Input gross earnings, tax parameters, and deductions into our processing node to receive an instant, mathematically verified document.
          </p>
          <button onClick={(e) => { logTelemetry('paystub_action_triggered', { action: 'start_builder' }); handleOutboundClick(e); }} className="inline-flex items-center justify-center px-10 py-5 bg-[#DB2777] text-white font-black uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-colors shadow-[0_0_30px_rgba(219,39,119,0.3)] rounded-sm">
            Launch Interface <SafeIcon icon={LuIcons.LuArrowRight} className="ml-3 w-4 h-4" />
          </button>
        </div>
      </motion.section>

      {/* Architecture Matrix */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex items-center gap-3 mb-10 border-b border-white/10 pb-4">
          <SafeIcon icon={LuIcons.LuSettings} className="w-6 h-6 text-[#DB2777]" />
          <h2 className="text-2xl font-black uppercase tracking-tighter text-white">System Capabilities</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-[#050505]/80 backdrop-blur-md border border-onyx-500/20 p-8 rounded-sm shadow-xl hover:shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:border-[#DB2777]/30 transition-all duration-300">
             <div className="text-[#DB2777] text-xs font-mono uppercase tracking-widest mb-3 flex items-center gap-2">
               <SafeIcon icon={LuIcons.LuCalculator} className="w-4 h-4" /> 01 // Computational Accuracy
             </div>
             <h3 className="text-white font-black text-lg uppercase tracking-tight mb-2">Automated Routing</h3>
             <p className="text-xs text-zinc-400 leading-relaxed">Our engine automatically computes complex deduction algorithms based on your gross inputs, ensuring mathematical accuracy across the document without manual spreadsheet errors.</p>
           </div>
           <div className="bg-[#050505]/80 backdrop-blur-md border border-onyx-500/20 p-8 rounded-sm shadow-xl hover:shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:border-[#DB2777]/30 transition-all duration-300">
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
          <button onClick={(e) => { logTelemetry('paystub_action_triggered', { action: 'start_builder' }); handleOutboundClick(e); }} className="inline-flex items-center justify-center px-12 py-5 bg-[#DB2777] text-white font-black uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-colors shadow-[0_0_30px_rgba(219,39,119,0.3)] rounded-sm">
            Initialize Generator <SafeIcon icon={LuIcons.LuArrowUpRight} className="ml-3 w-4 h-4" />
          </button>
        </div>
      </section>
    </div>

  );
}
