import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAximStore } from '../../store/useAximStore';
import SafeIcon from '../../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';

export default function NdaGeneratorLanding() {
  const navigate = useNavigate();
  const enqueueAction = useAximStore((state) => state.enqueueAction);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleGenerate = () => {
    setIsProcessing(true);

    setTimeout(() => {
      enqueueAction({ type: 'GENERATE_DOCUMENT', target: 'NDA_MUTUAL_v2', name: 'Mutual Non-Disclosure Agreement' });
      setIsProcessing(false);
      navigate('/profile'); // Send them to the vault to see it queued
    }, 800);
  };

  return (
    <div className="w-full relative z-10 flex flex-col items-center py-20 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 md:p-12 bg-black/60 backdrop-blur-xl border border-white/10 shadow-[0_0_50px_rgba(125,0,255,0.05)] rounded-sm relative overflow-hidden w-full max-w-3xl"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-axim-purple via-axim-gold to-axim-purple" />

        <Link to="/tools" className="inline-flex items-center gap-2 text-axim-purple hover:text-axim-gold font-mono text-[0.65rem] uppercase tracking-widest transition-colors mb-8 group">
          <SafeIcon icon={LuIcons.LuArrowLeft} className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
          Back to Offerings
        </Link>

        <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter mb-4">Mutual Non-Disclosure Agreement</h1>
        <p className="text-zinc-400 max-w-2xl text-sm leading-relaxed mb-10">
          Instantly deploy a rigorously structured, mutual NDA. Designed to protect proprietary information and trade secrets before entering into joint ventures or vendor negotiations.
        </p>

        <div className="p-6 bg-white/5 border border-white/10 mb-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="text-[0.6rem] font-mono text-zinc-500 uppercase tracking-widest mb-1">Processing Engine</div>
            <div className="text-sm font-bold text-white flex items-center gap-2"><SafeIcon icon={LuIcons.LuCpu} className="text-axim-purple w-4 h-4"/> ONYX_LEGAL_PARSER</div>
          </div>
          <div>
            <div className="text-[0.6rem] font-mono text-zinc-500 uppercase tracking-widest mb-1">Est. Generation Time</div>
            <div className="text-sm font-bold text-white flex items-center gap-2"><SafeIcon icon={LuIcons.LuClock} className="text-axim-purple w-4 h-4"/> &lt; 2.4 Seconds</div>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isProcessing}
          className="w-full md:w-auto px-10 py-4 bg-axim-gold text-black font-black uppercase text-sm tracking-widest hover:bg-white transition-colors flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {isProcessing ? (
            <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"/> INITIALIZING...</span>
          ) : (
            <span className="flex items-center gap-2">Deploy Generator <SafeIcon icon={LuIcons.LuArrowRight} className="w-4 h-4"/></span>
          )}
        </button>
      </motion.div>
    </div>
  );
}
