import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAximStore } from '../store/useAximStore';
import * as LuIcons from 'react-icons/lu';
import SafeIcon from '../common/SafeIcon';

const { LuShieldAlert, LuArrowRight, LuX } = LuIcons;

export default function EngagementGuard() {
  const { isGuardEngaged, setGuardEngaged } = useAximStore((state) => ({
    isGuardEngaged: state.isGuardEngaged,
    setGuardEngaged: state.setGuardEngaged
  }));

  return (
    <AnimatePresence>
      {isGuardEngaged && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-2xl px-4"
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L3N2Zz4=')] opacity-50 z-[-1]" />

          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="w-full max-w-lg bg-[#050505] border-2 border-axim-gold/50 shadow-[0_0_50px_rgba(240,255,0,0.15)] rounded-sm p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-axim-gold animate-pulse"></div>

            <button
              onClick={() => setGuardEngaged(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
            >
              <SafeIcon icon={LuX} className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-axim-gold/10 flex items-center justify-center text-axim-gold border border-axim-gold/30 shadow-[0_0_20px_rgba(240,255,0,0.3)] mb-6">
                <SafeIcon icon={LuShieldAlert} className="w-8 h-8" />
              </div>

              <h2 className="text-xl md:text-2xl font-black uppercase tracking-widest text-white mb-2">
                System Guard Engaged
              </h2>
              <div className="font-mono text-[0.65rem] text-axim-gold uppercase tracking-widest bg-axim-gold/10 px-3 py-1 rounded-sm border border-axim-gold/20 mb-6">
                [RESOURCE_LIMIT_EXCEEDED]
              </div>

              <p className="text-zinc-400 text-sm leading-relaxed mb-8">
                Your current operational tier has reached its processing capacity. Continued interaction requires allocation of additional infrastructure resources.
              </p>

              <button
                onClick={() => {
                  setGuardEngaged(false);
                  // Routing or additional action logic can go here
                }}
                className="w-full py-4 bg-axim-gold text-black font-black uppercase tracking-widest hover:bg-[#D4E000] transition-colors rounded-sm flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(240,255,0,0.4)] hover:shadow-[0_0_30px_rgba(240,255,0,0.6)]"
              >
                Request Resource Expansion <SafeIcon icon={LuArrowRight} />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
