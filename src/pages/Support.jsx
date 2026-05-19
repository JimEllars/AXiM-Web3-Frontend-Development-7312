import React, { useState } from 'react';
import SEO from '../components/SEO';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';

export default function Support() {
  const [formData, setFormData] = useState({ email: '', issue: '', priority: 'Standard' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Optimistic UI Queue
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  const faqs = [
    { q: "How do I access generated digital byproducts?", a: "Navigate to the Operator Vault via your Profile. All parsed legal and financial documents are securely encrypted and vaulted there for extraction." },
    { q: "Are digital byproducts legally binding?", a: "AXiM generators provide structural efficiency and standardized formatting. However, operators must consult independent counsel to guarantee jurisdictional compliance." },
    { q: "How do I upgrade my infrastructure tier?", a: "Enterprise scaling requires a Consultation protocol. Submit a request via the footer uplink to speak with our engineering team." }
  ];

  const wikiCategories = [
    { title: "Operator Guide", icon: LuIcons.LuBookOpen, desc: "Standard operating procedures for the AXiM Hub." },
    { title: "API Documentation", icon: LuIcons.LuCode, desc: "Endpoints and payloads for headless integrations." },
    { title: "Billing & Subscriptions", icon: LuIcons.LuCreditCard, desc: "Manage your decentralized infrastructure costs." },
    { title: "Security Protocols", icon: LuIcons.LuShieldCheck, desc: "Overview of AXiM encryption and data handling." }
  ];

  return (
    <div className="w-full min-h-screen bg-bg-void relative z-10 pb-32">
      <SEO title="System Support | AXiM" description="Technical support, FAQs, and ecosystem documentation." />

      {/* Hero */}
      <section className="pt-32 pb-16 relative overflow-hidden border-b border-white/10 bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:40px_40px] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10 text-center">
          <div className="w-16 h-16 bg-axim-purple/10 border border-axim-purple/30 rounded flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(147,51,234,0.2)]">
            <SafeIcon icon={LuIcons.LuLifeBuoy} className="w-8 h-8 text-axim-purple" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white leading-tight mb-4">
            System <span className="text-axim-purple">Support.</span>
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Initialize a support ticket, browse frequently asked parameters, or access the comprehensive ecosystem wiki.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12">

        {/* Left Col: Support Form */}
        <div className="lg:col-span-5">
          {submitted ? (
             <div className="bg-[#0F172A] border border-axim-purple/50 p-10 rounded-sm text-center shadow-[0_0_50px_rgba(147,51,234,0.15)] relative overflow-hidden h-full flex flex-col justify-center min-h-[400px]">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-axim-purple to-transparent opacity-50" />
                <SafeIcon icon={LuIcons.LuCircleCheck} className="w-12 h-12 text-axim-purple mx-auto mb-4" />
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Ticket Logged</h2>
                <p className="text-zinc-400 text-xs leading-relaxed font-mono tracking-widest uppercase">
                  Support protocol initialized. Our technicians will ping your comms shortly.
                </p>
             </div>
          ) : (
            <div className="bg-black border border-white/10 p-8 rounded-sm shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-axim-purple/5 blur-[80px] pointer-events-none" />

              <div className="relative z-10">
                <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2 flex items-center gap-2">
                  <SafeIcon icon={LuIcons.LuTerminal} className="w-5 h-5 text-axim-purple" /> Request Assistance
                </h3>
                <p className="text-xs text-zinc-500 mb-6 leading-relaxed">Submit your operational error or request. High-priority tickets are triaged immediately.</p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-[0.65rem] font-mono text-zinc-500 uppercase tracking-widest mb-2 border-l-2 border-axim-purple pl-2">Secure Comms (Email)</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                      placeholder="operator@enterprise.com"
                      className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white text-sm focus:outline-none focus:border-axim-purple transition-colors rounded-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[0.65rem] font-mono text-zinc-500 uppercase tracking-widest mb-2 border-l-2 border-axim-purple pl-2">Priority Level</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({...formData, priority: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white text-sm focus:outline-none focus:border-axim-purple transition-colors rounded-sm appearance-none"
                    >
                      <option value="Standard" className="bg-[#0F172A]">Standard (24-48h)</option>
                      <option value="High" className="bg-[#0F172A]">High (System Degradation)</option>
                      <option value="Critical" className="bg-[#0F172A]">Critical (Complete Outage)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[0.65rem] font-mono text-zinc-500 uppercase tracking-widest mb-2 border-l-2 border-axim-purple pl-2">Error / Request Details</label>
                    <textarea
                      value={formData.issue}
                      onChange={(e) => setFormData({...formData, issue: e.target.value})}
                      required
                      rows="4"
                      placeholder="Detail your system error or requirement..."
                      className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white text-sm focus:outline-none focus:border-axim-purple transition-colors resize-none rounded-sm"
                    />
                  </div>

                  <button
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full py-4 bg-axim-purple text-white font-black uppercase tracking-widest text-[0.65rem] hover:bg-white hover:text-black transition-colors disabled:opacity-50 flex justify-center items-center gap-2 rounded-sm shadow-lg"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2"><div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"/> Transmitting...</span>
                    ) : (
                       <span className="flex items-center gap-2">Initialize Ticket <SafeIcon icon={LuIcons.LuArrowRight} className="w-3 h-3"/></span>
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Right Col: FAQ & Wiki */}
        <div className="lg:col-span-7 space-y-12">

          {/* FAQ */}
          <section>
            <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
              <SafeIcon icon={LuIcons.LuCircleHelp} className="w-5 h-5 text-axim-gold" />
              <h2 className="text-xl font-black uppercase tracking-tighter text-white">Frequently Asked Parameters</h2>
            </div>
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="bg-black border border-white/10 p-6 rounded-sm hover:border-axim-gold/50 transition-colors shadow-lg">
                  <h4 className="text-sm font-bold text-white mb-2">{faq.q}</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Wiki */}
          <section>
            <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
              <SafeIcon icon={LuIcons.LuLibrary} className="w-5 h-5 text-axim-purple" />
              <h2 className="text-xl font-black uppercase tracking-tighter text-white">System Wiki</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {wikiCategories.map((wiki, idx) => (
                <div key={idx} className="group cursor-pointer bg-[#0F172A] border border-white/5 p-6 rounded-sm hover:border-axim-purple/50 transition-colors shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-axim-purple/5 group-hover:bg-axim-purple/10 transition-colors blur-xl rounded-full" />
                  <SafeIcon icon={wiki.icon} className="w-6 h-6 text-axim-purple mb-4" />
                  <h4 className="text-sm font-bold text-white mb-2 group-hover:text-axim-purple transition-colors">{wiki.title}</h4>
                  <p className="text-[0.65rem] text-zinc-500 uppercase tracking-widest font-mono">{wiki.desc}</p>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
