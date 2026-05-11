import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAximStore } from '../../store/useAximStore';
import SafeIcon from '../../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';
import SEO from '../../components/SEO';

export default function PayStubLanding() {
  const navigate = useNavigate();
  const enqueueAction = useAximStore((state) => state.enqueueAction);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleGenerate = () => {
    setIsProcessing(true);

    // Simulate secure generation routing & log to the autonomous queue
    setTimeout(() => {
      enqueueAction({ type: 'GENERATE_DOCUMENT', target: 'PAYSTUB_v1', name: 'Enterprise Payroll Record' });
      setIsProcessing(false);
      navigate('/profile'); // Send them to the vault to see it queued
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-20 relative z-10">
      <SEO title="Enterprise Pay Stub Generator | AXiM Tools" description="Instantly generate rigorously structured, enterprise-grade payroll records." />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 md:p-12 bg-black border border-white/10 shadow-2xl rounded-sm relative overflow-hidden">

        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-axim-purple via-zinc-500 to-axim-purple" />

        <Link to="/tools" className="inline-flex items-center gap-2 text-axim-purple hover:text-white font-mono text-[0.65rem] uppercase tracking-widest transition-colors mb-8 group">
          <SafeIcon icon={LuIcons.LuArrowLeft} className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
          Back to Offerings
        </Link>

        <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4">Enterprise Payroll Record</h1>
        <p className="text-zinc-400 max-w-2xl text-sm leading-relaxed mb-10">
          Instantly deploy rigorously structured, compliant payroll documentation. Designed to streamline compensation tracking and generate verifiable income records for your workforce.
        </p>

        <div className="p-6 bg-white/5 border border-white/10 mb-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-[0.6rem] font-mono text-zinc-500 uppercase tracking-widest mb-1">Processing Engine</div>
              <div className="text-sm font-bold text-white flex items-center gap-2"><SafeIcon icon={LuIcons.LuCpu} className="text-axim-purple w-4 h-4"/> ONYX_FINANCE_PARSER</div>
            </div>
            <div>
              <div className="text-[0.6rem] font-mono text-zinc-500 uppercase tracking-widest mb-1">Est. Generation Time</div>
              <div className="text-sm font-bold text-white flex items-center gap-2"><SafeIcon icon={LuIcons.LuClock} className="text-axim-purple w-4 h-4"/> &lt; 1.8 Seconds</div>
            </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isProcessing}
          className="w-full md:w-auto px-10 py-4 bg-white text-black font-black uppercase text-sm tracking-widest hover:bg-axim-purple hover:text-white transition-colors flex items-center justify-center gap-3 disabled:opacity-50"
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
