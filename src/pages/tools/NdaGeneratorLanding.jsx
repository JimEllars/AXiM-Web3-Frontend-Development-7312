import React, { useState } from 'react';
import SEO from '../../components/SEO';
import SafeIcon from '../../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';

import { logTelemetry } from '../../lib/telemetry';
import { sanitizeInput } from '../../lib/sanitize';

import { useNavigate } from 'react-router-dom';
import { useAximStore } from '../../store/useAximStore';
import { supabase } from '../../lib/supabase';

export default function NdaGeneratorLanding() {
  React.useEffect(() => {
    logTelemetry('APP_TOOL_ACCESSED', { toolName: 'nda_generator' });
  }, []);
  const [showWizard, setShowWizard] = useState(false);
  const NDA_PRODUCTION_TARGET = 'https://quickndacontract.com/?via=axim_apps_and_tools';

  const handleOutboundClick = (e) => {
    e.preventDefault();
    const user = useAximStore.getState().userSession?.user;
    const attAddress = user?.walletAddress || "0x000_GUEST";
    logTelemetry('NDA_FUNNEL_REDIRECT', { destination: 'quickndacontract_production', origin: 'axim_apps_and_tools', attAddress });
    setTimeout(() => {
      window.location.href = NDA_PRODUCTION_TARGET;
    }, 150);
  };
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();


  const handleShareClick = (e) => {
    e.preventDefault();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).then(() => {
        useAximStore.getState().showToast('Link copied to clipboard!', 'success');
        logTelemetry('ORGANIC_SHARE_INTENT', { path: window.location.pathname });
      }).catch((err) => {
        console.error('Failed to copy link', err);
      });
    }
  };

  const addAsset = useAximStore((state) => state.addAsset);
    const showToast = useAximStore((state) => state.showToast);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setShowWizard(false);

      const store = useAximStore.getState();
      store.showToast('NDA Successfully Generated & Vaulted', 'success');

      // Update useAximStore logic
      const newAsset = {
        id: `NDA-${Date.now()}`,
        type: 'Mutual NDA',
        date: new Date().toISOString(),
        status: 'Ready',
        icon: LuIcons.LuShieldCheck,
        color: 'text-axim-purple'
      };

      if (store.addVaultedArtifact) {
        store.addVaultedArtifact(newAsset);
      } else {
        // Fallback for store update
        useAximStore.setState((state) => ({ vaultedArtifacts: [newAsset, ...state.vaultedArtifacts] }));
      }
    }, 2000);
  };

  const ndaSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Mutual NDA Generator",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "provider": { "@type": "Organization", "name": "AXiM Systems" },
    "description": "Generate balanced, two-way non-disclosure agreements optimized for technology, software, and intellectual property collaborations."
  };

  return (

      <div className="w-full min-h-screen bg-bg-void relative z-10 pb-32">
      <SEO
        title="Web3 NDA Generator | AXiM Apps & Tools"
        description="Protect your operational blueprints before entering into B2B consultations. Generate a balanced, two-way non-disclosure agreement optimized for technology and software collaborations."
        image="https://axim-web3.com/og-nda.jpg"
        customSchema={[ndaSchema]}
      />

      {/* Generation Wizard Modal */}
      {showWizard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#050505] border border-white/10 p-8 rounded-sm shadow-2xl relative overflow-hidden animate-fade-in-up">
            <div className="absolute top-0 right-0 w-48 h-48 bg-axim-purple/10 blur-[50px]" />

            <div className="flex justify-between items-center mb-6 relative z-10">
              <h3 className="text-xl font-black text-white uppercase tracking-tighter">Document Setup</h3>
              <button onClick={() => setShowWizard(false)} className="text-zinc-500 hover:text-white transition-colors">
                <SafeIcon icon={LuIcons.LuX} className="w-5 h-5" />
              </button>
            </div>

            <div className="flex gap-2 mb-8 relative z-10">
              <div className={`h-1 flex-1 rounded-full ${step >= 1 ? 'bg-axim-purple' : 'bg-white/10'}`} />
              <div className={`h-1 flex-1 rounded-full ${step >= 2 ? 'bg-axim-purple' : 'bg-white/10'}`} />
            </div>

            <form onSubmit={handleGenerate} className="relative z-10">
              {step === 1 ? (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <label className="block text-[0.65rem] font-mono text-zinc-500 uppercase tracking-widest mb-2 border-l-2 border-axim-purple pl-2">Party A (Your Entity)</label>
                    <input required type="text" className="w-full bg-[#0A0A0A] border border-white/10 p-3 text-white text-sm focus:border-axim-purple outline-none rounded-sm" placeholder="e.g. AXiM Systems LLC" />
                  </div>
                  <div>
                    <label className="block text-[0.65rem] font-mono text-zinc-500 uppercase tracking-widest mb-2 border-l-2 border-axim-purple pl-2">Party B (Counterparty)</label>
                    <input required type="text" className="w-full bg-[#0A0A0A] border border-white/10 p-3 text-white text-sm focus:border-axim-purple outline-none rounded-sm" placeholder="e.g. Acme Corp" />
                  </div>
                  <button type="button" onClick={() => setStep(2)} className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-black uppercase tracking-widest transition-colors mt-4 rounded-sm">
                    Next Step
                  </button>
                </div>
              ) : (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <label className="block text-[0.65rem] font-mono text-zinc-500 uppercase tracking-widest mb-2 border-l-2 border-axim-purple pl-2">Governing Jurisdiction (State)</label>
                    <input required type="text" className="w-full bg-[#0A0A0A] border border-white/10 p-3 text-white text-sm focus:border-axim-purple outline-none rounded-sm" placeholder="e.g. Texas" />
                  </div>
                  <div>
                    <label className="block text-[0.65rem] font-mono text-zinc-500 uppercase tracking-widest mb-2 border-l-2 border-axim-purple pl-2">Operator Email (For Delivery)</label>
                    <input required type="email" className="w-full bg-[#0A0A0A] border border-white/10 p-3 text-white text-sm focus:border-axim-purple outline-none rounded-sm" placeholder="operator@domain.com" />
                  </div>
                  <button disabled={isSubmitting} type="submit" className="w-full py-4 bg-axim-purple text-white text-xs font-black uppercase tracking-widest transition-colors mt-4 shadow-[0_0_20px_rgba(147,51,234,0.3)] disabled:opacity-50 flex justify-center items-center gap-2 rounded-sm">
                    {isSubmitting ? <><SafeIcon icon={LuIcons.LuLoader} className="w-4 h-4 animate-spin"/> Encrypting...</> : 'Generate & Secure Asset'}
                  </button>
                  <button type="button" onClick={() => setStep(1)} className="w-full text-center text-[0.6rem] font-mono text-zinc-500 hover:text-white uppercase tracking-widest mt-2 underline">Back</button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Landing Page Content */}
      <section className="pt-32 pb-20 relative overflow-hidden bg-black border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-tr from-axim-purple/20 via-transparent to-axim-purple/10 mix-blend-overlay z-0" />
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex flex-col items-center gap-4 mb-6"><div className="inline-flex items-center gap-2 px-3 py-1 bg-[#004040]/30 border border-[#004040] rounded-sm shadow-[0_0_15px_rgba(0,64,64,0.4)]"><SafeIcon icon={LuIcons.LuShieldCheck} className="w-3 h-3 text-axim-purple" /><span className="text-[0.6rem] font-bold text-white uppercase tracking-widest">An official utility within the AXiM Apps & Tools suite</span></div></div>
          <div className="w-16 h-16 bg-gradient-to-br from-axim-purple to-[#DB2777] rounded flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(147,51,234,0.3)]">
            <SafeIcon icon={LuIcons.LuShieldCheck} className="w-8 h-8 text-white" />
          </div>
          <div className="mb-4 inline-flex items-center gap-2 px-2 py-1 bg-axim-gold/10 border border-axim-gold/30 rounded-sm"><SafeIcon icon={LuIcons.LuLock} className="w-3 h-3 text-axim-gold" /><span className="text-[0.6rem] font-bold text-axim-gold uppercase tracking-widest">Token-Gated / Partner Access Required</span></div>

          <div className="flex justify-center mb-6">
            <button onClick={handleShareClick} className="px-4 py-2 bg-[#050505] border border-white/10 text-white hover:bg-white hover:text-black transition-colors rounded-sm shadow-md font-mono uppercase tracking-widest text-[0.65rem] flex items-center gap-2">
              <SafeIcon icon={LuIcons.LuShare2} className="w-3.5 h-3.5" /> Share Tool
            </button>
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white leading-tight mb-6">
            Mutual NDA <br/><span className="text-axim-purple">Generator.</span>
          </h1>
          <p className="text-zinc-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed mb-10">
            Protect your operational blueprints before entering into B2B consultations. Generate a balanced, two-way non-disclosure agreement optimized for technology and software collaborations.
          </p>
          <button onClick={handleOutboundClick} className="inline-flex items-center justify-center px-10 py-5 bg-axim-purple text-white font-black uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-colors shadow-[0_0_30px_rgba(147,51,234,0.3)] rounded-sm">
            Launch Generator <SafeIcon icon={LuIcons.LuArrowRight} className="ml-3 w-4 h-4" />
          </button>
        </div>
      </section>

      {/* System Capabilities & Use Cases... (Keep existing structure) */}
      <section className="max-w-7xl mx-auto px-6 py-24">
         <div className="flex items-center gap-3 mb-10 border-b border-white/10 pb-4">
            <SafeIcon icon={LuIcons.LuSettings} className="w-6 h-6 text-axim-purple" />
            <h2 className="text-2xl font-black uppercase tracking-tighter text-white">System Capabilities</h2>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-[#050505]/80 backdrop-blur-md border border-onyx-500/20 p-8 rounded-sm shadow-xl hover:shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:border-axim-purple/30 transition-all duration-300">
               <div className="text-axim-purple text-xs font-mono uppercase tracking-widest mb-3 flex items-center gap-2">
                 <SafeIcon icon={LuIcons.LuScale} className="w-4 h-4" /> 01 // Fairness Standard
               </div>
               <h3 className="text-white font-black text-lg uppercase tracking-tight mb-2">Symmetric Protection</h3>
               <p className="text-xs text-zinc-400 leading-relaxed">Unlike predatory one-way NDAs, our generator structures clauses that equally protect both parties, facilitating faster trust and signature acquisition during negotiations.</p>
             </div>
             <div className="bg-[#050505]/80 backdrop-blur-md border border-onyx-500/20 p-8 rounded-sm shadow-xl hover:shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:border-axim-purple/30 transition-all duration-300">
               <div className="text-axim-purple text-xs font-mono uppercase tracking-widest mb-3 flex items-center gap-2">
                 <SafeIcon icon={LuIcons.LuFileCode2} className="w-4 h-4" /> 02 // Rapid Deployment
               </div>
               <h3 className="text-white font-black text-lg uppercase tracking-tight mb-2">Instant Extraction</h3>
               <p className="text-xs text-zinc-400 leading-relaxed">Input your entity parameters and instantly extract a legally formatted, print-ready document tailored specifically to modern software and intellectual property interactions.</p>
             </div>
         </div>
      </section>

      <section className="py-24 relative overflow-hidden bg-black text-center border-t border-white/10">
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white mb-6">Secure Your Data. <br/>Move Faster.</h2>
          <p className="text-zinc-400 text-sm mb-10">Don't let legal friction slow down your deals. Generate a standard, fair agreement in under 60 seconds.</p>
          <button onClick={handleOutboundClick} className="inline-flex items-center justify-center px-12 py-5 bg-axim-purple text-white font-black uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-colors shadow-[0_0_30px_rgba(147,51,234,0.3)] rounded-sm">
            Initialize Document <SafeIcon icon={LuIcons.LuArrowUpRight} className="ml-3 w-4 h-4" />
          </button>
        </div>
      </section>
    </div>

  );
}
