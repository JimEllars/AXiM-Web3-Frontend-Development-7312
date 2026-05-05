import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAximStore } from '../store/useAximStore';
import SEO from '../components/SEO';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';

export default function Consultation() {
  const navigate = useNavigate();
  const enqueueAction = useAximStore((state) => state.enqueueAction);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', focus: 'automation' });

  const handleBooking = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    setIsProcessing(true);

    // Simulate secure network routing to Autonomous Queue
    setTimeout(() => {
      enqueueAction({
        type: 'CONSULTATION_REQUEST',
        target: formData.email,
        name: `Strategy Session: ${formData.name}`
      });
      setIsProcessing(false);
      navigate('/profile'); // Send to vault to see queued action
    }, 800);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-20 relative z-10">
      <SEO title="Strategy Session | AXiM Systems" description="Book a consultation to streamline your business architecture." />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 md:p-12 bg-black/60 backdrop-blur-xl border border-white/10 shadow-[0_0_50px_rgba(125,0,255,0.05)] rounded-sm">

        <header className="mb-10 border-b border-white/10 pb-8 text-center">
          <div className="inline-flex items-center gap-2 text-axim-purple font-mono text-xs uppercase tracking-widest mb-4 px-3 py-1 bg-axim-purple/10 border border-axim-purple/20 rounded-sm">
            <div className="w-1.5 h-1.5 bg-axim-purple rounded-full animate-pulse" />
            Direct Uplink
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter mb-4">Strategy Session</h1>
          <p className="text-zinc-400 text-sm leading-relaxed max-w-lg mx-auto">
            Connect with our architecture team to identify bottlenecks, deploy autonomous tools, and scale your operations efficiently.
          </p>
        </header>

        <form onSubmit={handleBooking} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[0.65rem] font-mono text-zinc-500 uppercase tracking-widest">Operator Name</label>
              <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-black border border-white/10 p-3 text-white font-mono text-sm focus:border-axim-purple focus:outline-none transition-colors" placeholder="e.g. John Doe" />
            </div>
            <div className="space-y-2">
              <label className="text-[0.65rem] font-mono text-zinc-500 uppercase tracking-widest">Secure Comms (Email)</label>
              <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-black border border-white/10 p-3 text-white font-mono text-sm focus:border-axim-purple focus:outline-none transition-colors" placeholder="sysadmin@company.com" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[0.65rem] font-mono text-zinc-500 uppercase tracking-widest">Primary Objective</label>
            <select value={formData.focus} onChange={e => setFormData({...formData, focus: e.target.value})} className="w-full bg-black border border-white/10 p-3 text-white font-mono text-sm focus:border-axim-purple focus:outline-none transition-colors appearance-none">
              <option value="automation">Process Automation & Tooling</option>
              <option value="infrastructure">Decentralized Infrastructure Setup</option>
              <option value="intelligence">Custom Intelligence Feeds</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full mt-4 px-10 py-4 bg-axim-gold text-black font-black uppercase text-sm tracking-widest hover:bg-white transition-colors flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"/> TRANSMITTING...</span>
            ) : (
              <span className="flex items-center gap-2">Request Authorization <SafeIcon icon={LuIcons.LuArrowRight} className="w-4 h-4"/></span>
            )}
          </button>
        </form>

      </motion.div>
    </div>
  );
}
