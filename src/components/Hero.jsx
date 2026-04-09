import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as LuIcons from 'react-icons/lu';
import SafeIcon from '../common/SafeIcon';

const { LuSparkles, LuArrowRight } = LuIcons;

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
    <section className="min-h-[90vh] flex items-center pt-32 pb-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid pointer-events-none z-0"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.2, 0.8, 0.2, 1] }}
        className="max-w-[1200px] w-full mx-auto px-6 relative z-10 text-center md:text-left"
      >
        <a href="https://quickdemandletter.com"
           className="font-mono text-[0.7rem] text-axim-gold bg-axim-gold/10 px-3.5 py-1.5 rounded border border-axim-gold uppercase font-bold mb-8 inline-flex items-center gap-2 shadow-[0_0_15px_rgba(255,234,0,0.1)] transition hover:bg-axim-gold/20">
          <SafeIcon icon={LuSparkles} className="w-3.5 h-3.5" /> NEW: $4.00 QUICK DEMAND LETTER GENERATOR
        </a>

        <div className="font-mono text-xs text-axim-green bg-axim-green/10 px-4 py-2 rounded-full border border-axim-green/30 mb-6 inline-flex items-center gap-3 backdrop-blur-md md:flex md:mb-6 mx-auto md:mx-0">
          <span className="w-2 h-2 bg-axim-green rounded-full shadow-[0_0_10px_#3aaa74] animate-pulse"></span>
          <span>{typewriterText}<span className="animate-ping">_</span></span>
        </div>

        <h1 className="text-[clamp(2.5rem,8vw,5.5rem)] leading-none font-black tracking-[-0.04em] mb-6 uppercase">
          Smart Business<br className="hidden md:block" />
          <span className="gradient-text"> Systems</span>
        </h1>

        <p className="text-[clamp(1.1rem,2vw,1.25rem)] text-zinc-400 max-w-[700px] mb-12 leading-[1.6] font-light mx-auto md:mx-0">
          AXiM Systems integrates energy infrastructure, mission-critical connectivity, and autonomous intelligence to power the physical and digital backbone of modern society.
        </p>

        <div className="flex gap-5 flex-wrap justify-center md:justify-start">
          <a href="#axim-solutions" className="btn btn-primary">
            Explore Solutions <SafeIcon icon={LuArrowRight} />
          </a>
          <a href="https://quickdemandletter.com" className="btn btn-outline">
            Start $4.00 Draft
          </a>
        </div>
      </motion.div>
    </section>
  );
}