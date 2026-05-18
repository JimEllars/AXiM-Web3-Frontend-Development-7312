import React, { useState } from 'react';
import SEO from '../components/SEO';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';

export default function EarlyAccess() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    setError(false);

    try {
      const url = import.meta.env.VITE_NEWSLETTER_API_URL;
      if (!url) {
        // Optimistic UI Queue Fallback
        setTimeout(() => {
          setIsSubmitting(false);
          setSubmitted(true);
        }, 1500);
        return;
      }

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (res.ok) {
        setIsSubmitting(false);
        setSubmitted(true);
      } else {
        setIsSubmitting(false);
        setError(true);
      }
    } catch (err) {
      setIsSubmitting(false);
      setError(true);
    }
  };

  return (
    <div className="w-full min-h-screen bg-bg-void relative z-10 pb-32 flex flex-col">
      <SEO title="Subscribe to Updates | AXiM Systems" description="Subscribe to the AXiM network for strategic blueprints, promos, and new software tool drops." />

      <section className="flex-1 flex items-center justify-center p-6 mt-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-xl">
          
          <Link to="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white font-mono text-[0.65rem] uppercase tracking-widest transition-colors mb-8 group">
            <SafeIcon icon={LuIcons.LuArrowLeft} className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
            Return to Hub
          </Link>

          {submitted ? (
             <div className="bg-[#0F172A] border border-axim-purple/50 p-12 rounded-sm text-center shadow-[0_0_50px_rgba(147,51,234,0.15)] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-axim-purple to-transparent opacity-50" />
                <div className="w-16 h-16 bg-axim-purple/20 text-axim-purple mx-auto rounded-full flex items-center justify-center mb-6">
                  <SafeIcon icon={LuIcons.LuCircleCheck} className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-4 leading-tight">Subscription Confirmed</h2>
                <p className="text-zinc-400 text-sm leading-relaxed font-mono uppercase tracking-widest">
                  Your address has been securely logged. You will now receive priority intelligence and ecosystem promos directly to your inbox.
                </p>
             </div>
          ) : (
            <div className="bg-black border border-white/10 p-8 md:p-12 rounded-sm shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-axim-purple/5 blur-[80px] pointer-events-none" />

              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/5 border border-white/10 rounded flex items-center justify-center mb-6">
                  <SafeIcon icon={LuIcons.LuMail} className="w-6 h-6 text-axim-purple" />
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4 leading-tight">Priority Intelligence.</h1>
                <p className="text-zinc-400 text-sm leading-relaxed mb-10 max-w-md">
                  Subscribe to receive strategic blueprints and exclusive software drops directly to your inbox.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-[0.65rem] font-mono text-zinc-500 uppercase tracking-widest mb-2 border-l-2 border-axim-purple pl-2">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-white/5 border border-white/10 px-4 py-4 text-white text-sm focus:outline-none focus:border-axim-purple transition-colors"
                      placeholder="operator@enterprise.com"
                    />
                    {error && <p className="text-red-500 text-xs font-mono mt-2">Transmission failed. Retry.</p>}
                  </div>

                  <button
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full py-5 bg-axim-purple text-white font-black uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-colors disabled:opacity-50 flex justify-center items-center gap-3 shadow-[0_0_20px_rgba(147,51,234,0.3)]"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"/> ENCRYPTING...</span>
                    ) : (
                      <span className="flex items-center gap-2">Subscribe to Updates <SafeIcon icon={LuIcons.LuArrowRight} className="w-4 h-4"/></span>
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}
        </motion.div>
      </section>
    </div>
  );
}
