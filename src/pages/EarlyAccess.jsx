import React from 'react';
import SDKWrapper from '../components/SDKWrapper';
import { motion } from 'framer-motion';
import * as LuIcons from 'react-icons/lu';
import SafeIcon from '../common/SafeIcon';

const { LuLock, LuShieldCheck, LuZap } = LuIcons;

export default function EarlyAccess() {
  return (
    <div className="max-w-[1200px] mx-auto px-6 py-20 min-h-[80vh] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-axim-purple/5 blur-[120px] rounded-full pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="text-center mb-16 relative z-10"
      >
        <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-8">
          <SafeIcon icon={LuLock} className="text-axim-gold w-4 h-4" />
          <span className="font-mono text-[0.6rem] uppercase tracking-widest text-zinc-400">Restricted Access Protocol</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black uppercase mb-6 tracking-tighter leading-none">
          Unified <span className="text-axim-gold">Onboarding</span>
        </h1>
        <p className="text-zinc-500 max-w-lg mx-auto text-lg leading-relaxed">
          Complete your operational profile to synchronize with the AXiM Digital backbone and unlock infrastructure-level governance.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -30 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ delay: 0.2 }}
          className="space-y-8 hidden lg:block"
        >
          <div className="p-8 bg-glass border border-subtle">
            <div className="flex gap-6 items-start">
              <div className="p-4 bg-axim-gold/10 text-axim-gold border border-axim-gold/20">
                <SafeIcon icon={LuShieldCheck} className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold uppercase mb-2">Verified Identity</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">Secure your operator profile using Web3 authentication and clearance level indexing.</p>
              </div>
            </div>
          </div>
          
          <div className="p-8 bg-glass border border-subtle">
            <div className="flex gap-6 items-start">
              <div className="p-4 bg-axim-purple/10 text-axim-purple border border-axim-purple/20">
                <SafeIcon icon={LuZap} className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold uppercase mb-2">Instant Allocation</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">Early access members receive priority allocation in upcoming grid-scale energy deployments.</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 30 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ delay: 0.4 }}
          className="w-full"
        >
          <SDKWrapper />
        </motion.div>
      </div>
    </div>
  );
}