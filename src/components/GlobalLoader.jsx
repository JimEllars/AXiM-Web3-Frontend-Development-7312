import React from 'react';
import { motion } from 'framer-motion';

export default function GlobalLoader({ loadingMessage = 'Initializing Node Connection...' }) {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[50vh] relative z-[100] bg-bg-void/80 backdrop-blur-md">
      <div className="absolute inset-0 bg-[radial-gradient(rgba(125,0,255,0.08)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center p-8 rounded-xl bg-white/5 border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-xl animate-pulse">
        {/* Pulsing geometric node animation */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <motion.div
            className="w-3 h-3 bg-axim-purple rounded-sm"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.5, 1],
            }}
          />
          <motion.div
            className="w-3 h-3 bg-axim-purple rounded-sm"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.5, 1],
              delay: 0.2,
            }}
          />
          <motion.div
            className="w-3 h-3 bg-axim-purple rounded-sm"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.5, 1],
              delay: 0.4,
            }}
          />
        </div>

        <div className="font-mono text-[0.65rem] text-axim-purple uppercase tracking-widest flex items-center gap-2">
          {loadingMessage}
        </div>
      </div>
    </div>
  );
}
