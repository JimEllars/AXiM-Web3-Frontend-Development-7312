import React, { useState } from 'react';
import SEO from '../components/SEO';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';
import { logTelemetry } from '../lib/telemetry';

export default function Consultation() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    details: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const formPayload = new FormData();
      formPayload.append('source', 'consultation_form');
      formPayload.append('firstName', formData.firstName);
      formPayload.append('lastName', formData.lastName);
      formPayload.append('customer_name', `${formData.firstName} ${formData.lastName}`);
      formPayload.append('customer_email', formData.email);
      formPayload.append('company', formData.company);
      formPayload.append('description', formData.details);
      formPayload.append('subject', 'Consultation Request');

      const workerUrl = import.meta.env.VITE_ONYX_WORKER_URL;
      const workerSecret = import.meta.env.VITE_AXIM_ONYX_SECRET;

      if (!workerUrl) {
        console.warn('EDGE WARNING: Missing Environment Keys. Simulating submission...');
        await new Promise(r => setTimeout(r, 1500));
        setSuccess(true);
        if (typeof window.gtag === 'function') {
          window.gtag('event', 'generate_lead', {
            event_category: 'engagement',
            event_label: 'Consultation Form',
          });
        }
        return;
      }

      const res = await fetch(`${workerUrl}/webhooks/intake`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${workerSecret}`
        },
        body: formPayload
      });

      if (!res.ok) throw new Error('Submission rejected by Edge Worker');

      setSuccess(true);
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'generate_lead', {
          event_category: 'engagement',
          event_label: 'Consultation Form',
        });
      }
    } catch (err) {
      setError('Communication link severed. Please try again or use the Chatbase concierge.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-bg-void relative z-10 pb-32">
      <SEO
        title="Book A Consultation | AXiM Systems"
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
            Schedule a dedicated session with an AXiM architect. We will audit your current workflows, identify latency bottlenecks, and map out a decentralized automation strategy.
          </p>
        </div>
      </section>

      {/* Split Form Layout */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <div className="flex flex-col lg:flex-row gap-16">

          {/* Value Proposition Sidebar */}
          <div className="lg:w-1/3 space-y-12">
             <div>
               <SafeIcon icon={LuIcons.LuNetwork} className="w-6 h-6 text-axim-purple mb-4" />
               <h3 className="text-white font-black uppercase tracking-widest text-sm mb-2">Workflow Audits</h3>
               <p className="text-xs text-zinc-400 leading-relaxed">We break down your existing SaaS subscriptions and API limitations to find areas where Make.com logic loops can save manual labor.</p>
             </div>
             <div>
               <SafeIcon icon={LuIcons.LuBot} className="w-6 h-6 text-[#DB2777] mb-4" />
               <h3 className="text-white font-black uppercase tracking-widest text-sm mb-2">AI Implementation</h3>
               <p className="text-xs text-zinc-400 leading-relaxed">Discover how proprietary, firewalled LLM models can be trained on your company data to triage leads and automate support vectors.</p>
             </div>
             <div>
               <SafeIcon icon={LuIcons.LuShieldCheck} className="w-6 h-6 text-axim-gold mb-4" />
               <h3 className="text-white font-black uppercase tracking-widest text-sm mb-2">Security Briefing</h3>
               <p className="text-xs text-zinc-400 leading-relaxed">Ensure your data architecture remains completely insulated when connecting third-party decentralized applications.</p>
             </div>
          </div>

          {/* Booking Widget Container */}
          <div className="lg:w-2/3">
             <div className="bg-[#050505] border border-white/10 p-8 md:p-12 rounded-sm shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-axim-purple/5 blur-[50px] pointer-events-none" />

                <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-6 relative z-10 flex items-center gap-3">
                  <SafeIcon icon={LuIcons.LuCalendar} className="w-5 h-5 text-axim-purple" /> Request A Consultation
                </h2>

                <div className="relative z-10">
                  {success ? (
                    <div className="p-8 border border-axim-green/30 bg-axim-green/10 rounded-sm text-center">
                      <SafeIcon icon={LuIcons.LuCircleCheck} className="w-12 h-12 text-axim-green mx-auto mb-4" />
                      <h3 className="text-white font-bold mb-2">Transmission Successful</h3>
                      <p className="text-zinc-400 text-sm">Our systems architects will reach out shortly to coordinate a time.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-mono text-zinc-400 uppercase tracking-widest">First Name</label>
                          <input
                            required
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 p-3 rounded-sm text-white focus:border-axim-purple focus:outline-none transition-colors"
                            type="text"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-mono text-zinc-400 uppercase tracking-widest">Last Name</label>
                          <input
                            required
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 p-3 rounded-sm text-white focus:border-axim-purple focus:outline-none transition-colors"
                            type="text"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-mono text-zinc-400 uppercase tracking-widest">Email Address</label>
                          <input
                            required
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 p-3 rounded-sm text-white focus:border-axim-purple focus:outline-none transition-colors"
                            type="email"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-mono text-zinc-400 uppercase tracking-widest">Company</label>
                          <input
                            required
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 p-3 rounded-sm text-white focus:border-axim-purple focus:outline-none transition-colors"
                            type="text"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-mono text-zinc-400 uppercase tracking-widest">Project Details</label>
                        <textarea
                          required
                          name="details"
                          value={formData.details}
                          onChange={handleChange}
                          rows={4}
                          className="w-full bg-white/5 border border-white/10 p-3 rounded-sm text-white focus:border-axim-purple focus:outline-none transition-colors resize-none"
                          placeholder="Briefly describe your infrastructure or automation needs..."
                        />
                      </div>

                      {error && (
                        <div className="p-4 border border-red-500/30 bg-red-500/10 rounded-sm flex items-center gap-3">
                          <SafeIcon icon={LuIcons.LuTriangleAlert} className="w-5 h-5 text-red-500 shrink-0" />
                          <p className="text-sm text-red-400">{error}</p>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 bg-axim-purple text-white font-black uppercase tracking-widest text-sm hover:bg-white hover:text-black transition-colors rounded-sm flex justify-center items-center gap-2 disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <span className="animate-pulse">Transmitting...</span>
                        ) : (
                          <>Initialize Contact <SafeIcon icon={LuIcons.LuArrowRight} className="w-4 h-4" /></>
                        )}
                      </button>
                    </form>
                  )}
                </div>
             </div>
          </div>

        </div>
      </section>
    </div>
  );
}
