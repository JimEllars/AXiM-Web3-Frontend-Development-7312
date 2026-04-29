import React from 'react';
import { motion } from 'framer-motion';

export default function GlobalLoader() {
  return (
    <div className="fixed inset-0 z-[100] bg-black backdrop-blur-xl flex flex-col items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
        className="w-12 h-12 border-t-2 border-b-2 border-axim-gold/50 rounded-full mb-4 shadow-[0_0_15px_rgba(255,234,0,0.3)]"
      />
      <div className="font-mono text-axim-gold/70 text-xs tracking-widest uppercase animate-pulse">
        Initializing...
      </div>
    </div>
  );
}
