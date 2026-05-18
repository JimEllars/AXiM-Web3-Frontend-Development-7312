import React, { useState } from 'react';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';

export default function ProactiveBanner() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);

    // Optimistic UI Queue
    setTimeout(() => {
      setIsSubmitting(false);
      setSubscribed(true);
    }, 1200);
  };

  return (
    <div className="w-full bg-[#050505] border-y border-axim-purple/20 py-20 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-axim-purple/10 to-transparent blur-[80px] pointer-events-none group-hover:from-axim-purple/20 transition-colors duration-700" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">

        <div className="w-full lg:w-1/2 text-center lg:text-left">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-axim-purple/10 border border-axim-purple/20 text-[0.65rem] font-mono uppercase tracking-widest text-axim-purple mb-6 rounded-sm">
            <SafeIcon icon={LuIcons.LuMail} className="w-3 h-3" />
            <span>Join The Network</span>
          </div>
          <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4 leading-tight">Priority Intelligence.</h3>
          <p className="text-zinc-400 text-sm md:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Subscribe to receive strategic blueprints, new software tool drops, and exclusive enterprise partner promos directly to your inbox.
          </p>
        </div>

        <div className="w-full lg:w-1/2 max-w-md mx-auto lg:mx-0">
          {subscribed ? (
             <div className="bg-white/5 border border-axim-purple/50 p-8 rounded-sm text-center shadow-[0_0_30px_rgba(147,51,234,0.1)]">
                <SafeIcon icon={LuIcons.LuCheck} className="w-10 h-10 text-axim-purple mx-auto mb-3" />
                <h4 className="text-white font-black uppercase tracking-widest text-sm mb-1">Comms Secured</h4>
                <p className="text-xs text-zinc-500 font-mono tracking-widest uppercase">Awaiting Transmission.</p>
             </div>
          ) : (
            <form onSubmit={handleSubscribe} className="bg-black border border-white/10 p-6 rounded-sm shadow-2xl relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-axim-purple to-transparent opacity-50" />
              <div className="mb-4">
                <label className="block text-[0.65rem] font-mono text-zinc-500 uppercase tracking-widest mb-2 border-l-2 border-axim-purple pl-2">Secure Comms (Email)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="operator@enterprise.com"
                  className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white text-sm focus:outline-none focus:border-axim-purple transition-colors rounded-sm"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-axim-purple text-white font-black uppercase tracking-widest text-[0.65rem] hover:bg-white hover:text-black transition-colors disabled:opacity-50 flex justify-center items-center gap-2 rounded-sm"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2"><div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"/> Encrypting...</span>
                ) : (
                  <span className="flex items-center gap-2">Initialize Uplink <SafeIcon icon={LuIcons.LuArrowRight} className="w-3 h-3"/></span>
                )}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
