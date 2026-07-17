import React, {  useState , useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import SafeIcon from '../common/SafeIcon';
import DatabaseUplinkError from '../common/DatabaseUplinkError';
import * as LuIcons from 'react-icons/lu';
import { logTelemetry } from '../lib/telemetry';
import { sanitizeInput } from '../lib/sanitize';
import { encryptPayload } from '../lib/crypto';
import { useAximStore } from '../store/useAximStore';


export default function Consultation() {

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });



  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [networkFault, setNetworkFault] = useState(false);
  const [formData, setFormData] = useState({ inquiryType: '', name: '', email: '', company: '', details: '' });
  const { isWeb3Authenticated, walletAddress } = useAximStore();

  const inquiryCategories = [
    { id: 'Tech Infrastructure', icon: LuIcons.LuNetwork, desc: 'Decentralized systems, automation, and AI integrations.' },
    { id: 'Sales & Leadership Training', icon: LuIcons.LuTrendingUp, desc: 'Organizational scaling and operator protocol training.' },
    { id: 'Media Inquiry', icon: LuIcons.LuMic, desc: 'Press, interviews, and media asset requests.' },
    { id: 'Something Else', icon: LuIcons.LuMessageSquare, desc: 'General consultations and bespoke network requests.' }
  ];

  const handleCategorySelect = (categoryId) => {
    logTelemetry('consultation_step_advanced', { currentStep: step, nextStep: 2, selectedCategory: categoryId });
    setFormData({ ...formData, inquiryType: categoryId });
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setNetworkFault(false);


    const turnstileResponse = document.querySelector('[name="cf-turnstile-response"]')?.value;

    const missingFields = Object.entries(formData).filter(([key, val]) => (key !== 'company' && !val)).map(([key]) => key);
    if (missingFields.length > 0) {
      logTelemetry('consultation_validation_error', { step: step, missingFields: missingFields });
    }

    if (!turnstileResponse) {
      logTelemetry('consultation_validation_error', { step: step, missingFields: ['turnstile'] });

      useAximStore.getState().showToast('Please complete the security challenge.', 'error');
      setIsSubmitting(false);
      return;
    }

    try {
      // 1. Sanitize Data

      const cleanData = {
        name: sanitizeInput(formData.name),
        email: sanitizeInput(formData.email),
        company: sanitizeInput(formData.company),
        details: sanitizeInput(formData.details),
        inquiryType: sanitizeInput(formData.inquiryType)
      };

      // 2. Async Telemetry (Non-Blocking)
      logTelemetry('consultation_requested', { category: cleanData.inquiryType });

      const workerUrl = import.meta.env.VITE_AXIM_CORE_API_URL;
      const secret = import.meta.env.VITE_AXIM_CORE_ANON_KEY;

      if (!workerUrl || !secret) {
        console.warn("EDGE WARNING: Missing Keys. Simulating secure submission.");
        await new Promise(res => setTimeout(res, 1500));
        setIsSubmitting(false);
        setIsSuccess(true);
        return;
      }

      // 3. Cryptographic Envelope Generation
      const payloadSchema = {
        customer_email: cleanData.email,
        customer_name: cleanData.name,
        subject: `[Consultation: ${cleanData.inquiryType}] ${cleanData.company || 'Independent'}`,
        description: cleanData.details,
        source: 'consultation_form'
      };

      const { ciphertext, iv } = await encryptPayload(payloadSchema, secret);
      const secureFormData = new FormData();
      secureFormData.append('payload', ciphertext);
      secureFormData.append('iv', iv);

      // 4. Edge Handoff
      const response = await fetch(`${workerUrl}/webhooks/intake`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${secret}` },
        body: secureFormData
      });

      if (!response.ok) throw new Error(`Proxy Reject: ${response.status}`);

      setIsSubmitting(false);
      setIsSuccess(true);
    } catch (err) {
      console.error("[AXiM_INTAKE] Transmission Failed:", err);
      setIsSubmitting(false);
      setNetworkFault(true);
    }
  };

  return (
    <div className="w-full min-h-screen bg-bg-void relative z-10 pb-32">

      <SEO title="Web3 Infrastructure Consulting | AXiM Solutions" description="Connect directly with the AXiM team for Web3 and enterprise software consulting." />

      {/* Graceful Degradation Trap */}
      {networkFault && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-6">
           <DatabaseUplinkError onRetry={() => setNetworkFault(false)} />
        </div>
      )}

      {/* Hero */}
      <section className="pt-32 pb-16 relative overflow-hidden bg-black border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-tr from-axim-purple/20 via-transparent to-axim-purple/10 mix-blend-overlay z-0" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white font-mono text-[0.65rem] uppercase tracking-widest transition-colors mb-8 group">
            <SafeIcon icon={LuIcons.LuArrowLeft} className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
            Return to Hub
          </Link>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white leading-tight mb-4">
            Request A <span className="text-axim-purple">Consultation.</span>
          </h1>
          <p className="text-zinc-400 max-w-2xl text-sm md:text-base leading-relaxed">
            Connect directly with the AXiM team. Please categorize your request below so we can route you to the appropriate specialist.
          </p>
          {isWeb3Authenticated && walletAddress && (
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-axim-purple/10 border border-axim-purple/30 text-[9px] font-mono tracking-widest text-axim-purple uppercase rounded-sm select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-axim-purple animate-pulse" />
              [PRIORITY_PASS // WALLET_VERIFIED]
            </div>
          )}
        </div>
      </section>

      {/* Interactive Form Layout */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <div className="flex flex-col lg:flex-row gap-16">

          <div className="lg:w-1/3 space-y-12">
             <div>
               <SafeIcon icon={LuIcons.LuNetwork} className="w-6 h-6 text-axim-purple mb-4" />
               <h3 className="text-white font-black uppercase tracking-widest text-sm mb-2">Tech Audits</h3>
               <p className="text-xs text-zinc-400 leading-relaxed">We deconstruct your existing software stack to eliminate bottlenecks and map out a streamlined automation strategy.</p>
             </div>
             <div>
               <SafeIcon icon={LuIcons.LuBot} className="w-6 h-6 text-[#DB2777] mb-4" />
               <h3 className="text-white font-black uppercase tracking-widest text-sm mb-2">Leadership Scaling</h3>
               <p className="text-xs text-zinc-400 leading-relaxed">Beyond pure code, we optimize the human operators running your systems with elite B2B sales and leadership frameworks.</p>
             </div>
             <div>
               <SafeIcon icon={LuIcons.LuShieldCheck} className="w-6 h-6 text-axim-gold mb-4" />
               <h3 className="text-white font-black uppercase tracking-widest text-sm mb-2">AES-256 Encryption</h3>
               <p className="text-xs text-zinc-400 leading-relaxed">Your data is locked within a cryptographic envelope locally before transmission, ensuring absolute B2B confidentiality.</p>
             </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:w-2/3">
             <div className="bg-[#050505] border border-white/10 p-8 md:p-12 rounded-sm shadow-2xl relative overflow-hidden min-h-[500px] flex flex-col">
                <div className="absolute top-0 right-0 w-64 h-64 bg-axim-purple/5 blur-[80px] pointer-events-none" />

                <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-2 relative z-10">
                  {isSuccess ? 'Request Received' : step === 1 ? 'Step 1: Inquiry Type' : 'Step 2: Contact Details'}
                </h2>
                {!isSuccess && (
                  <div className="flex gap-2 mb-8 relative z-10">
                    <div className={`h-1 flex-1 rounded-full ${step >= 1 ? 'bg-axim-purple' : 'bg-white/10'}`} />
                    <div className={`h-1 flex-1 rounded-full ${step >= 2 ? 'bg-axim-purple' : 'bg-white/10'}`} />
                  </div>
                )}

                {step === 1 && !isSuccess && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10 flex-1">
                    {inquiryCategories.map((cat) => (
                      <button key={cat.id} onClick={() => handleCategorySelect(cat.id)} className="flex flex-col items-start p-6 bg-[#0A0A0A] border border-white/5 hover:border-axim-purple/50 rounded-sm transition-colors text-left group">
                        <SafeIcon icon={cat.icon} className="w-6 h-6 text-zinc-500 group-hover:text-axim-purple mb-4 transition-colors" />
                        <h4 className="text-white font-black text-sm uppercase tracking-widest mb-2">{cat.id}</h4>
                        <p className="text-[0.65rem] text-zinc-500 leading-relaxed">{cat.desc}</p>
                      </button>
                    ))}
                  </div>
                )}

                {step === 2 && !isSuccess && (
                  <form onSubmit={handleSubmit} className="space-y-6 relative z-10 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-4 p-3 bg-axim-purple/10 border border-axim-purple/20 rounded-sm">
                       <SafeIcon icon={LuIcons.LuCheck} className="w-4 h-4 text-axim-purple" />
                       <span className="text-[0.65rem] font-mono uppercase tracking-widest text-axim-purple">Selected: {formData.inquiryType}</span>
                       <button type="button" onClick={() => { logTelemetry('consultation_step_advanced', { currentStep: step, nextStep: 1, selectedCategory: formData.inquiryType }); setStep(1); }} className="ml-auto text-[0.6rem] uppercase tracking-widest text-zinc-500 hover:text-white underline">Change</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[0.65rem] font-mono text-zinc-500 uppercase tracking-widest mb-2 border-l-2 border-axim-purple pl-2">Full Name</label>
                        <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-[#0A0A0A] border border-white/10 rounded-sm p-3.5 text-white text-sm focus:outline-none focus:border-axim-purple transition-colors" placeholder="John Doe" />
                      </div>
                      <div>
                        <label className="block text-[0.65rem] font-mono text-zinc-500 uppercase tracking-widest mb-2 border-l-2 border-axim-purple pl-2">Work Email</label>
                        <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-[#0A0A0A] border border-white/10 rounded-sm p-3.5 text-white text-sm focus:outline-none focus:border-axim-purple transition-colors" placeholder="email@company.com" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[0.65rem] font-mono text-zinc-500 uppercase tracking-widest mb-2 border-l-2 border-axim-purple pl-2">Company Name</label>
                      <input type="text" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} className="w-full bg-[#0A0A0A] border border-white/10 rounded-sm p-3.5 text-white text-sm focus:outline-none focus:border-axim-purple transition-colors" placeholder="Optional" />
                    </div>

                    <div className="flex-1">
                      <label className="block text-[0.65rem] font-mono text-zinc-500 uppercase tracking-widest mb-2 border-l-2 border-axim-purple pl-2">How can we help you?</label>
                      <textarea required value={formData.details} onChange={(e) => setFormData({...formData, details: e.target.value})} className="w-full h-32 bg-[#0A0A0A] border border-white/10 rounded-sm p-3.5 text-white text-sm focus:outline-none focus:border-axim-purple transition-colors resize-none" placeholder="Provide details regarding your request..." />
                    </div>


                    <div className="cf-turnstile mt-4" data-sitekey={import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'} data-theme="dark"></div>

                    <button disabled={isSubmitting} type="submit"
 className="w-full py-5 bg-axim-purple text-white font-black uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-colors rounded-sm shadow-[0_0_20px_rgba(147,51,234,0.3)] disabled:opacity-50 flex justify-center items-center gap-2 mt-auto">
                      {isSubmitting ? <><SafeIcon icon={LuIcons.LuLoader} className="w-4 h-4 animate-spin" /> ENCRYPTING PAYLOAD...</> : 'Submit Consultation Request'}
                    </button>
                  </form>
                )}

                {isSuccess && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center relative z-10 animate-fade-in">
                    <div className="w-16 h-16 rounded-full bg-axim-purple/10 border border-axim-purple/30 flex items-center justify-center mb-6">
                      <SafeIcon icon={LuIcons.LuCheck} className="w-8 h-8 text-axim-purple" />
                    </div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">Request Logged.</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed max-w-md mx-auto mb-8 font-mono uppercase tracking-widest">
                      Your architecture parameters have been securely encrypted and routed. An integration specialist will reach out within 24 hours.
                    </p>
                    <button onClick={() => { logTelemetry('consultation_step_advanced', { currentStep: 'success', nextStep: 1, selectedCategory: null }); setStep(1); setIsSuccess(false); setFormData({ inquiryType: '', name: '', email: '', company: '', details: ''}); }} className="px-8 py-3 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-colors rounded-sm">
                      Submit Another Request
                    </button>
                  </div>
                )}
             </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
