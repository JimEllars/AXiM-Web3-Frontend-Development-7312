import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';
import { Link } from 'react-router-dom';

const { LuLock, LuShieldCheck, LuArrowRight, LuX } = LuIcons;

export default function UpsellModal({ isOpen, onClose, featureName }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-lg bg-bg-void border border-axim-gold/30 shadow-[0_0_50px_rgba(255,234,0,0.1)] rounded-sm overflow-hidden"
        >
          {/* Background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-axim-gold/10 blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors z-10"
          >
            <SafeIcon icon={LuX} className="w-5 h-5" />
          </button>

          <div className="p-8 relative z-10 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-axim-gold/10 flex items-center justify-center text-axim-gold border border-axim-gold/40 shadow-[0_0_15px_rgba(255,234,0,0.2)] mb-6">
              <SafeIcon icon={LuLock} className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-black uppercase mb-2 tracking-tighter text-white">
              Enterprise Access Required
            </h2>
            <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
              Access to <span className="text-axim-gold font-bold">{featureName || 'this feature'}</span> is restricted to users on the Enterprise Core tier. Upgrade your account to unlock this tool and our full suite of automated infrastructure.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-white/10 text-zinc-400 font-bold uppercase text-xs tracking-widest hover:bg-white/5 hover:text-white transition-colors"
              >
                Go Back
              </button>
              <Link
                to="/billing"
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-axim-gold text-black font-black uppercase text-xs tracking-widest hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2"
              >
                Upgrade Now <SafeIcon icon={LuArrowRight} className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
