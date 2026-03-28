import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAximAuth } from '../hooks/useAximAuth';
import { supabase } from '../supabase/supabase';
import { localStore } from '../lib/persistence';
import * as LuIcons from 'react-icons/lu';
import SafeIcon from '../common/SafeIcon';

const { LuFileText, LuBrain, LuShieldCheck, LuLoader2, LuArrowRight, LuArrowLeft, LuCheckCircle2, LuAlertCircle } = LuIcons;

export default function DemandGenerator() {
  const { profile, account } = useAximAuth();
  const [step, setStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    opposing: '',
    amount: '',
    details: ''
  });

  const steps = [
    { id: 1, title: 'Identity', icon: LuFileText },
    { id: 2, title: 'Context', icon: LuBrain },
    { id: 3, title: 'Finalize', icon: LuShieldCheck }
  ];

  const handleFinalize = async () => {
    if (!profile) {
      setError("Please connect your wallet to authorize this drafting session.");
      return;
    }

    setIsSaving(true);
    setError(null);

    const letterPayload = {
      recipient: formData.opposing,
      claim_amount: parseFloat(formData.amount) || 0,
      content_json: {
        sender_name: formData.name,
        details: formData.details,
        timestamp: new Date().toISOString()
      },
      status: 'draft'
    };

    try {
      // 1. Attempt Cloud Save
      if (!profile.is_mock) {
        const { error: dbError } = await supabase
          .from('demand_letters_1774676062318')
          .insert([{ ...letterPayload, user_id: profile.id }]);
        
        if (dbError) throw dbError;
      }
      
      // 2. Always save locally as well (Robustness)
      localStore.saveLetter(profile.id, letterPayload);
      
      setStep(3);
    } catch (err) {
      console.error(err);
      // Even if cloud fails, we saved locally in Step 2 if we move it up, 
      // but for now let's just show the error or fallback.
      localStore.saveLetter(profile.id, letterPayload);
      setStep(3);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-[900px] mx-auto px-6 py-20 relative z-10">
      <div className="mb-12 text-center">
        <span className="section-label">Legal Infrastructure</span>
        <h1 className="text-4xl font-black uppercase mb-4 tracking-tight">Drafting Engine</h1>
        <p className="text-zinc-500 font-mono text-[0.6rem] uppercase tracking-widest">Protocol: AXM-LEGAL-GEN-V1</p>
      </div>

      <div className="flex justify-between items-center mb-16 relative">
        <div className="absolute top-1/2 left-0 w-full h-px bg-white/5 -z-10" />
        {steps.map((s) => (
          <div key={s.id} className="flex flex-col items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-500 ${step >= s.id ? 'bg-axim-gold border-axim-gold text-black shadow-[0_0_20px_rgba(255,234,0,0.2)]' : 'bg-[#050505] border-white/10 text-zinc-600'}`}>
              <SafeIcon icon={s.icon} className="w-5 h-5" />
            </div>
            <span className={`font-mono text-[0.6rem] uppercase tracking-widest ${step >= s.id ? 'text-white' : 'text-zinc-600'}`}>{s.title}</span>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-glass border border-subtle p-10 md:p-16" >
            <h2 className="text-2xl font-black uppercase mb-8">Parties Involved</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-mono text-[0.6rem] text-zinc-500 uppercase mb-2">Your Legal Name</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Full Legal Identity" className="w-full bg-white/5 border border-white/10 p-5 focus:border-axim-gold outline-none transition-all font-bold text-white placeholder:text-zinc-800" />
                </div>
                <div>
                  <label className="block font-mono text-[0.6rem] text-zinc-500 uppercase mb-2">Opposing Party</label>
                  <input type="text" value={formData.opposing} onChange={(e) => setFormData({ ...formData, opposing: e.target.value })} placeholder="Entity or Individual" className="w-full bg-white/5 border border-white/10 p-5 focus:border-axim-gold outline-none transition-all font-bold text-white placeholder:text-zinc-800" />
                </div>
              </div>
              <button onClick={() => setStep(2)} disabled={!formData.name || !formData.opposing} className="w-full py-5 bg-white text-black font-black uppercase text-sm tracking-widest hover:bg-axim-gold transition-colors disabled:opacity-20 flex items-center justify-center gap-2" >
                Proceed to Context <SafeIcon icon={LuArrowRight} />
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-glass border border-subtle p-10 md:p-16" >
            <h2 className="text-2xl font-black uppercase mb-8">Dispute Context</h2>
            <div className="space-y-6">
              <div>
                <label className="block font-mono text-[0.6rem] text-zinc-500 uppercase mb-2">Claim Amount (USD)</label>
                <input type="number" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} placeholder="0.00" className="w-full bg-white/5 border border-white/10 p-5 focus:border-axim-gold outline-none transition-all font-bold text-3xl text-axim-gold placeholder:text-zinc-900" />
              </div>
              <div>
                <label className="block font-mono text-[0.6rem] text-zinc-500 uppercase mb-2">Incident Narrative</label>
                <textarea rows={5} value={formData.details} onChange={(e) => setFormData({ ...formData, details: e.target.value })} placeholder="Describe the breach or unpaid obligation..." className="w-full bg-white/5 border border-white/10 p-5 focus:border-axim-gold outline-none transition-all text-white placeholder:text-zinc-800" />
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={() => setStep(1)} className="flex-1 py-5 border border-white/10 text-white font-bold uppercase text-xs tracking-widest hover:bg-white/5">
                  <SafeIcon icon={LuArrowLeft} className="inline mr-2" /> Back
                </button>
                <button onClick={handleFinalize} disabled={!formData.amount || !formData.details || isSaving} className="flex-[2] py-5 bg-axim-gold text-black font-black uppercase text-sm tracking-widest hover:bg-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2" >
                  {isSaving ? <SafeIcon icon={LuLoader2} className="animate-spin" /> : 'Synchronize Draft'}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20" >
            <div className="inline-block p-8 rounded-full bg-axim-green/5 text-axim-green mb-8 border border-axim-green/20">
              <SafeIcon icon={LuCheckCircle2} className="w-16 h-16 shadow-[0_0_30px_rgba(58,170,116,0.2)]" />
            </div>
            <h2 className="text-4xl font-black uppercase mb-4">Registry Updated</h2>
            <p className="text-zinc-500 max-w-md mx-auto mb-10 font-mono text-[0.7rem] uppercase leading-relaxed tracking-wider">
              Document for <span className="text-white font-bold">{formData.opposing}</span> has been committed to the local vault. 
              {profile.is_mock && <span className="block mt-2 text-axim-gold/50">Stored in session cache.</span>}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-12 py-5 bg-white text-black font-black uppercase text-sm tracking-widest hover:bg-axim-gold transition-colors">
                Download PDF
              </button>
              <button onClick={() => {setStep(1); setFormData({name: '', opposing: '', amount: '', details: ''})}} className="px-12 py-5 border border-white/10 text-white font-bold uppercase text-xs tracking-widest hover:bg-white/5">
                New Draft
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}