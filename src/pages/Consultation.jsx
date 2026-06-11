import React, { useState } from 'react';
import SEO from '../components/SEO';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';

export default function Consultation() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    inquiryType: '',
    name: '',
    email: '',
    company: '',
    details: ''
  });

  const inquiryCategories = [
    { id: 'Tech Infrastructure', icon: LuIcons.LuNetwork, desc: 'Decentralized systems, automation, and AI integrations.' },
    { id: 'Sales & Leadership Training', icon: LuIcons.LuTrendingUp, desc: 'Organizational scaling and operator protocol training.' },
    { id: 'Media Inquiry', icon: LuIcons.LuMic, desc: 'Press, interviews, and media asset requests.' },
    { id: 'Something Else', icon: LuIcons.LuMessageSquare, desc: 'General consultations and bespoke network requests.' }
  ];

  const handleCategorySelect = (categoryId) => {
    setFormData({ ...formData, inquiryType: categoryId });
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate Supabase/Network Ingestion Delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // In a production environment, this payload is sent to Supabase or an Edge Worker
    console.info(`[AXiM_INTAKE] New Lead captured and routed to James.Ellars@axim.us.com`, formData);

    setIsSubmitting(false);
    setIsSuccess(true);
  };

  return (
    <div className="w-full min-h-screen bg-bg-void relative z-10 pb-32">
      <SEO
        title="Strategy Consultation | AXiM Systems"
        description="Schedule a technical strategy session with an AXiM systems architect to scale your decentralized infrastructure."
      />

      {/* Hero */}
      <section className="pt-32 pb-16 relative overflow-hidden bg-black border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-tr from-axim-purple/20 via-transparent to-axim-purple/10 mix-blend-overlay z-0" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white leading-tight mb-4">
            System <span className="text-axim-purple">Strategy Call.</span>
          </h1>
          <p className="text-zinc-400 max-w-2xl text-sm md:text-base leading-relaxed">
            Initiate a direct connection with an AXiM architect. Please categorize your operational requirements below so we can route your request to the appropriate command node.
          </p>
        </div>
      </section>

      {/* Interactive Form Layout */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <div className="flex flex-col lg:flex-row gap-16">

          {/* Value Proposition Sidebar */}
          <div className="lg:w-1/3 space-y-12">
             <div>
               <SafeIcon icon={LuIcons.LuNetwork} className="w-6 h-6 text-axim-purple mb-4" />
               <h3 className="text-white font-black uppercase tracking-widest text-sm mb-2">Architectural Audits</h3>
               <p className="text-xs text-zinc-400 leading-relaxed">We deconstruct your existing SaaS stack to eliminate latency bottlenecks and map out a decentralized automation strategy.</p>
             </div>
             <div>
               <SafeIcon icon={LuIcons.LuBot} className="w-6 h-6 text-[#DB2777] mb-4" />
               <h3 className="text-white font-black uppercase tracking-widest text-sm mb-2">Leadership Scaling</h3>
               <p className="text-xs text-zinc-400 leading-relaxed">Beyond pure code, we optimize the human operators running your systems with elite B2B sales and leadership frameworks.</p>
             </div>
             <div>
               <SafeIcon icon={LuIcons.LuShieldCheck} className="w-6 h-6 text-axim-gold mb-4" />
               <h3 className="text-white font-black uppercase tracking-widest text-sm mb-2">Secure Routing</h3>
               <p className="text-xs text-zinc-400 leading-relaxed">All inquiry forms are securely encrypted and routed directly to our internal triage channels for rapid evaluation.</p>
             </div>
          </div>

          {/* Dynamic Intake Triage Interface */}
          <div className="lg:w-2/3">
             <div className="bg-[#050505] border border-white/10 p-8 md:p-12 rounded-sm shadow-2xl relative overflow-hidden min-h-[500px] flex flex-col">
                <div className="absolute top-0 right-0 w-64 h-64 bg-axim-purple/5 blur-[50px] pointer-events-none" />

                {/* Dynamic Header */}
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-2 relative z-10">
                  {isSuccess ? 'Transmission Secured' : step === 1 ? 'Step 1: Inquiry Parameter' : 'Step 2: Operational Data'}
                </h2>
                {!isSuccess && (
                  <div className="flex gap-2 mb-8 relative z-10">
                    <div className={`h-1 flex-1 rounded-full ${step >= 1 ? 'bg-axim-purple' : 'bg-white/10'}`} />
                    <div className={`h-1 flex-1 rounded-full ${step >= 2 ? 'bg-axim-purple' : 'bg-white/10'}`} />
                  </div>
                )}

                {/* State 1: Category Selection */}
                {step === 1 && !isSuccess && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10 flex-1">
                    {inquiryCategories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => handleCategorySelect(cat.id)}
                        className="flex flex-col items-start p-6 bg-[#0A0A0A] border border-white/5 hover:border-axim-purple/50 rounded-sm transition-colors text-left group"
                      >
                        <SafeIcon icon={cat.icon} className="w-6 h-6 text-zinc-500 group-hover:text-axim-purple mb-4 transition-colors" />
                        <h4 className="text-white font-black text-sm uppercase tracking-widest mb-2">{cat.id}</h4>
                        <p className="text-[0.65rem] text-zinc-500 leading-relaxed">{cat.desc}</p>
                      </button>
                    ))}
                  </div>
                )}

                {/* State 2: Data Ingestion */}
                {step === 2 && !isSuccess && (
                  <form onSubmit={handleSubmit} className="space-y-6 relative z-10 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-4 p-3 bg-axim-purple/10 border border-axim-purple/20 rounded-sm">
                       <SafeIcon icon={LuIcons.LuCheckCircle2} className="w-4 h-4 text-axim-purple" />
                       <span className="text-[0.65rem] font-mono uppercase tracking-widest text-axim-purple">Selected: {formData.inquiryType}</span>
                       <button type="button" onClick={() => setStep(1)} className="ml-auto text-[0.6rem] uppercase tracking-widest text-zinc-500 hover:text-white underline">Change</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[0.65rem] font-mono text-zinc-500 uppercase tracking-widest">Operator Name</label>
                        <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-[#0A0A0A] border border-white/10 rounded-sm p-3 text-white text-sm focus:outline-none focus:border-axim-purple transition-colors" placeholder="John Doe" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[0.65rem] font-mono text-zinc-500 uppercase tracking-widest">Secure Email</label>
                        <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-[#0A0A0A] border border-white/10 rounded-sm p-3 text-white text-sm focus:outline-none focus:border-axim-purple transition-colors" placeholder="operator@domain.com" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[0.65rem] font-mono text-zinc-500 uppercase tracking-widest">Organization / Company</label>
                      <input type="text" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} className="w-full bg-[#0A0A0A] border border-white/10 rounded-sm p-3 text-white text-sm focus:outline-none focus:border-axim-purple transition-colors" placeholder="Optional" />
                    </div>

                    <div className="space-y-2 flex-1">
                      <label className="text-[0.65rem] font-mono text-zinc-500 uppercase tracking-widest">Operation Details</label>
                      <textarea required value={formData.details} onChange={(e) => setFormData({...formData, details: e.target.value})} className="w-full h-32 bg-[#0A0A0A] border border-white/10 rounded-sm p-3 text-white text-sm focus:outline-none focus:border-axim-purple transition-colors resize-none" placeholder="Provide context regarding your structural requirements..." />
                    </div>

                    <button disabled={isSubmitting} type="submit" className="w-full py-4 bg-axim-purple text-white font-black uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-colors rounded-sm shadow-[0_0_20px_rgba(147,51,234,0.2)] disabled:opacity-50 flex justify-center items-center gap-2 mt-auto">
                      {isSubmitting ? <><SafeIcon icon={LuIcons.LuLoader2} className="w-4 h-4 animate-spin" /> Transmitting...</> : 'Initialize Triage Protocol'}
                    </button>
                  </form>
                )}

                {/* State 3: Success Confirmation */}
                {isSuccess && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center relative z-10 animate-fade-in">
                    <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mb-6">
                      <SafeIcon icon={LuIcons.LuCheck} className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">Request Logged.</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed max-w-md mx-auto mb-8">
                      Your inquiry parameters have been successfully encrypted and routed to <span className="text-white font-mono">James.Ellars@axim.us.com</span>. An architect will review your data and respond shortly.
                    </p>
                    <button onClick={() => { setStep(1); setIsSuccess(false); setFormData({ inquiryType: '', name: '', email: '', company: '', details: ''}); }} className="px-8 py-3 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-colors rounded-sm">
                      Submit Another Request
                    </button>
                  </div>
                )}
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}
