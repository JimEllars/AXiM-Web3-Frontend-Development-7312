import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';

export default function ProactiveBanner() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    setError(false);

    try {
      const url = import.meta.env.VITE_NEWSLETTER_API_URL;
      if (!url) {
        // Fallback
        setTimeout(() => {
          setIsSubmitting(false);
          setSubscribed(true);
        }, 1200);
        return;
      }

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (res.ok) {
        setIsSubmitting(false);
        setSubscribed(true);
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
    <div className="w-full bg-[#050505] border-y border-axim-purple/20 py-16 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-3/4 h-full bg-gradient-to-l from-axim-purple/10 to-transparent blur-[80px] pointer-events-none group-hover:from-axim-purple/20 transition-colors duration-700" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="w-full md:w-2/3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-axim-purple/10 border border-axim-purple/20 text-[0.65rem] font-mono uppercase tracking-widest text-axim-purple mb-4 rounded-sm">
            <SafeIcon icon={LuIcons.LuMail} className="w-3 h-3" />
            <span>Join The Network</span>
          </div>
          <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4 leading-tight">Priority Intelligence.</h3>
          <p className="text-zinc-400 text-sm md:text-base max-w-xl leading-relaxed">
            Subscribe to receive strategic blueprints, new software tool drops, and exclusive enterprise partner promos directly to your inbox.
          </p>
        </div>

        <div className="shrink-0 w-full md:w-auto md:text-right">
          {subscribed ? (
            <div className="w-full md:w-auto inline-flex flex-col justify-center items-center px-10 py-3 bg-axim-purple/20 text-axim-purple border border-axim-purple shadow-[0_0_30px_rgba(147,51,234,0.2)]">
              <span className="font-black uppercase tracking-widest text-xs flex items-center gap-2"><SafeIcon icon={LuIcons.LuCheck} className="w-4 h-4" /> Comms Secured</span>
              <span className="text-[10px] font-mono mt-1 opacity-70">Awaiting Transmission.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2 w-full md:w-80">
              <div className="flex w-full">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="operator@enterprise.com"
                  className="w-full bg-black border border-white/10 px-4 py-4 text-white text-sm focus:outline-none focus:border-axim-purple transition-colors"
                  required
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-4 bg-axim-purple text-white font-black uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-colors disabled:opacity-50 flex justify-center items-center gap-2 shadow-[0_0_30px_rgba(147,51,234,0.2)]"
                >
                  {isSubmitting ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"/> : <SafeIcon icon={LuIcons.LuArrowRight} className="w-4 h-4" />}
                </button>
              </div>
              {error && <p className="text-red-500 text-xs font-mono text-left">Transmission failed. Retry.</p>}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
