import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as LuIcons from 'react-icons/lu';
import SafeIcon from '../common/SafeIcon';

export default function Hero() {
  const [typewriterText, setTypewriterText] = useState("");
  const phrases = ["AXiM_CORE_CONNECTED", "LEGAL_PROTOCOLS_ACTIVE", "GRID_STATUS: OPTIMAL", "Ai_UPLINK: ACTIVE", "NEW_ERA_ENABLED"];
  
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

  return (
    <section className="min-h-[90vh] flex items-center justify-center pt-32 pb-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid pointer-events-none z-0"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "circOut" }}
        className="max-w-4xl w-full mx-auto px-6 relative z-10 text-center flex flex-col items-center"
      >
        <a href="https://quickdemandletter.com/start" target="_blank" rel="noopener noreferrer"
           className="font-mono text-[0.7rem] text-axim-gold bg-axim-gold/10 px-4 py-2 rounded border border-axim-gold uppercase font-bold mb-8 inline-flex items-center gap-2 shadow-[0_0_15px_rgba(255,234,0,0.1)] transition hover:bg-axim-gold/20">
          <SafeIcon icon={LuIcons.LuSparkles} className="w-3.5 h-3.5" /> NEW: $4.00 QUICK DEMAND LETTER GENERATOR
        </a>

        <div className="font-mono text-xs text-axim-purple bg-axim-purple/10 px-5 py-2.5 rounded-full border border-axim-purple/30 mb-8 inline-flex items-center gap-3 backdrop-blur-md mx-auto">
          <span className="w-2 h-2 bg-axim-purple rounded-full shadow-[0_0_10px_#7D00FF] animate-pulse"></span>
          <span>{typewriterText}<span className="animate-ping">_</span></span>
        </div>

        <h1 className="text-[clamp(3rem,8vw,6.5rem)] leading-none font-black tracking-[-0.04em] mb-6 uppercase">
          Smarter<br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-axim-purple to-[#DB2777]"> Systems</span>
        </h1>

        <p className="text-[clamp(1.1rem,2vw,1.25rem)] text-zinc-400 max-w-2xl mx-auto mb-10 leading-[1.6] font-light">
          On-Demand Business Systems without Breaking the Bank.
        </p>

        <div className="flex gap-5 flex-wrap justify-center">
          <Link to="/tools" className="inline-flex justify-center items-center px-8 py-4 bg-axim-purple text-white font-black uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-colors shadow-[0_0_20px_rgba(147,51,234,0.3)] rounded-sm">
            Explore Offerings <SafeIcon icon={LuIcons.LuArrowRight} className="ml-3 w-4 h-4" />
          </Link>
          <Link to="/consultation" className="inline-flex justify-center items-center px-8 py-4 border border-white/20 text-white font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-colors rounded-sm">
            Request Consultation
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
