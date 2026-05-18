import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as LuIcons from 'react-icons/lu';
import SafeIcon from '../common/SafeIcon';

const { LuSparkles, LuArrowRight, LuMail, LuCheckCircle2 } = LuIcons;

export default function Hero() {
  // Typewriter State
  const [typewriterText, setTypewriterText] = useState("");
  const phrases = ["AXiM_CORE_CONNECTED", "LEGAL_PROTOCOLS_ACTIVE", "GRID_STATUS: OPTIMAL", "Ai_UPLINK: ACTIVE", "NEW_ERA_ENABLED"];
  
  // Newsletter State
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    let pIndex = 0, i = 0, isDeleting = false, timeoutId;

    const type = () => {
      const current = phrases[pIndex];
      setTypewriterText(current.substring(0, i));
      
      let speed = isDeleting ? 50 : 100;
      if (!isDeleting && i === current.length) {
        isDeleting = true;
        speed = 2000;
      } else if (isDeleting && i === 0) {
        isDeleting = false;
        pIndex = (pIndex + 1) % phrases.length;
        speed = 500;
      }
      
      i += isDeleting ? -1 : 1;
      timeoutId = setTimeout(type, speed);
    };

    type();
    return () => clearTimeout(timeoutId);
  }, []);

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
    <section className="min-h-[90vh] flex items-center pt-32 pb-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid pointer-events-none z-0"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "circOut" }}
        className="max-w-[1200px] w-full mx-auto px-6 relative z-10"
      >

        {/* Top Badges */}
        <div className="text-center lg:text-left">
          <a href="https://quickdemandletter.com/start" target="_blank" rel="noopener noreferrer"
             className="font-mono text-[0.7rem] text-axim-gold bg-axim-gold/10 px-3.5 py-1.5 rounded border border-axim-gold uppercase font-bold mb-8 inline-flex items-center gap-2 shadow-[0_0_15px_rgba(255,234,0,0.1)] transition hover:bg-axim-gold/20">
            <SafeIcon icon={LuSparkles} className="w-3.5 h-3.5" /> NEW: $4.00 QUICK DEMAND LETTER GENERATOR
          </a>

          <div className="font-mono text-xs text-axim-purple bg-axim-purple/10 px-4 py-2 rounded-full border border-axim-purple/30 mb-8 inline-flex items-center gap-3 backdrop-blur-md mx-auto lg:mx-0 flex">
            <span className="w-2 h-2 bg-axim-purple rounded-full shadow-[0_0_10px_#7D00FF] animate-pulse"></span>
            <span>{typewriterText}<span className="animate-ping">_</span></span>
          </div>
        </div>

        {/* Split Hero Layout */}
        <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between gap-12 lg:gap-8">

          {/* Left Content */}
          <div className="w-full lg:w-3/5 text-center lg:text-left">
            <h1 className="text-[clamp(2.5rem,8vw,5.5rem)] leading-none font-black tracking-[-0.04em] mb-6 uppercase">
              Smarter<br className="hidden md:block" />
              <span className="gradient-text"> Systems</span>
            </h1>

            <p className="text-[clamp(1.1rem,2vw,1.25rem)] text-zinc-400 max-w-[700px] mb-10 leading-[1.6] font-light mx-auto lg:mx-0">
              AXiM System offers products and services built to make your life easier without breaking the bank. See what we have to offer &gt;&gt;&gt;
            </p>

            <div className="flex gap-5 flex-wrap justify-center lg:justify-start">
              <Link to="/tools" className="btn btn-primary">
                Explore Tools <SafeIcon icon={LuArrowRight} className="ml-2 w-4 h-4" />
              </Link>
              <Link to="/consultation" className="btn btn-outline">
                Request a Consultation
              </Link>
            </div>
          </div>

          {/* Right Newsletter Terminal */}
          <div className="w-full lg:w-2/5 max-w-md bg-[#050505]/90 border border-white/10 p-8 backdrop-blur-xl rounded-xl shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-axim-purple/10 blur-[60px] pointer-events-none group-hover:bg-axim-purple/20 transition-colors duration-700" />

            {subscribed ? (
               <div className="text-center py-8 relative z-10">
                  <SafeIcon icon={LuCheckCircle2} className="w-12 h-12 text-axim-purple mx-auto mb-4" />
                  <h4 className="text-white font-black uppercase tracking-widest text-sm mb-2">Comms Secured</h4>
                  <p className="text-xs text-zinc-500 font-mono tracking-widest uppercase">Awaiting Transmission.</p>
               </div>
            ) : (
              <form onSubmit={handleSubscribe} className="relative z-10">
                <h4 className="text-white font-black uppercase tracking-widest text-sm mb-2 flex items-center gap-2">
                  <SafeIcon icon={LuMail} className="text-axim-purple w-4 h-4" /> Priority Intelligence
                </h4>
                <p className="text-xs text-zinc-400 mb-6 leading-relaxed">Subscribe to receive strategic blueprints and exclusive software drops directly to your inbox.</p>

                <div className="space-y-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="operator@enterprise.com"
                    className="w-full bg-black border border-white/10 px-4 py-3.5 text-white text-sm focus:outline-none focus:border-axim-purple transition-colors rounded-sm"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-axim-purple text-white font-black uppercase tracking-widest text-[0.65rem] hover:bg-white hover:text-black transition-colors disabled:opacity-50 flex justify-center items-center gap-2 rounded-sm shadow-[0_0_15px_rgba(147,51,234,0.2)]"
                  >
                    {isSubmitting ? 'Encrypting...' : 'Initialize Uplink'}
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>
      </motion.div>
    </section>
  );
}
