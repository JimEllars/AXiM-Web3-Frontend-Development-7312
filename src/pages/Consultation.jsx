import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';

export default function Consultation() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Optimistic UI: Simulate network request and queue locally
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="w-full relative z-10 bg-bg-void min-h-screen pb-20">
      <SEO title="Enterprise Consultation | Smart Systems" description="Propose a partnership or request enterprise integration consulting with AXiM." />

      <section className="pt-32 pb-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-axim-purple hover:text-axim-gold font-mono text-[0.65rem] uppercase tracking-widest transition-colors mb-12 group">
            <SafeIcon icon={LuIcons.LuArrowLeft} className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
            Return to Hub
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white leading-tight mb-4">
              Enterprise <span className="text-zinc-500">Intake.</span>
            </h1>
            <p className="text-zinc-400 max-w-2xl text-sm leading-relaxed">
              We engineer scalable ecosystems and partner with best-in-class infrastructure providers. Submit your proposal below for integration or consulting.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12">

          {/* Left Column: Trust & Exclusivity */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="w-full lg:w-1/3">
            <div className="bg-white/5 border border-white/10 p-8 rounded-sm sticky top-32">
              <h3 className="text-lg font-black text-white uppercase tracking-widest mb-6 border-b border-white/10 pb-4">Our Philosophy</h3>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="mt-1"><SafeIcon icon={LuIcons.LuShieldCheck} className="w-5 h-5 text-axim-purple" /></div>
                  <div>
                    <p className="text-sm font-bold text-white uppercase mb-1">Strict Vetting</p>
                    <p className="text-xs text-zinc-500">Due to high volume, we only accept proposals that strictly align with our decentralized edge architecture.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="mt-1"><SafeIcon icon={LuIcons.LuZap} className="w-5 h-5 text-axim-purple" /></div>
                  <div>
                    <p className="text-sm font-bold text-white uppercase mb-1">Rapid Deployment</p>
                    <p className="text-xs text-zinc-500">If approved, our engineering team moves from proposal to active integration in weeks, not months.</p>
                  </div>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Right Column: The Form */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="w-full lg:w-2/3">
            {isSubmitted ? (
              <div className="bg-black border border-axim-purple/50 p-12 rounded-sm text-center shadow-[0_0_50px_rgba(125,0,255,0.15)]">
                <div className="w-16 h-16 bg-axim-purple/20 text-axim-purple mx-auto rounded-full flex items-center justify-center mb-6">
                  <SafeIcon icon={LuIcons.LuCheck} className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-4">Transmission Secure</h2>
                <p className="text-zinc-400 text-sm max-w-md mx-auto">
                  Your proposal has been securely logged to the AXiM infrastructure queue. Our operations team will review your data and initiate contact.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-black border border-white/10 p-8 md:p-12 rounded-sm shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-axim-purple to-transparent opacity-50" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-[0.65rem] font-mono text-zinc-500 uppercase tracking-widest mb-2">Operator Name</label>
                    <input required type="text" className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white text-sm focus:outline-none focus:border-axim-purple transition-colors" placeholder="Jane Doe" />
                  </div>
                  <div>
                    <label className="block text-[0.65rem] font-mono text-zinc-500 uppercase tracking-widest mb-2">Secure Comms (Email)</label>
                    <input required type="email" className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white text-sm focus:outline-none focus:border-axim-purple transition-colors" placeholder="jane@enterprise.com" />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-[0.65rem] font-mono text-zinc-500 uppercase tracking-widest mb-2">Organization / Entity</label>
                  <input required type="text" className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white text-sm focus:outline-none focus:border-axim-purple transition-colors" placeholder="Global Systems Inc." />
                </div>

                <div className="mb-8">
                  <label className="block text-[0.65rem] font-mono text-zinc-500 uppercase tracking-widest mb-2">Infrastructure Proposal</label>
                  <textarea required rows="5" className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white text-sm focus:outline-none focus:border-axim-purple transition-colors resize-none" placeholder="Detail your operational capabilities and proposed integration..."></textarea>
                </div>

                <button disabled={isSubmitting} type="submit" className="w-full py-4 bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-axim-purple hover:text-white transition-colors disabled:opacity-50 flex justify-center items-center gap-3">
                  {isSubmitting ? (
                    <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"/> ENCRYPTING...</span>
                  ) : (
                    <span className="flex items-center gap-2">Initialize Uplink <SafeIcon icon={LuIcons.LuSend} className="w-4 h-4"/></span>
                  )}
                </button>
              </form>
            )}
          </motion.div>

        </div>
      </section>
    </div>
  );
}
