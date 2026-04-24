import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';

const { LuShield } = LuIcons;

export default function DashboardAccessDenied() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center relative z-10">
      <div className="relative mb-12">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="w-32 h-32 border border-red-500/20 rounded-full flex items-center justify-center" >
          <div className="w-24 h-24 border border-red-500/40 rounded-full border-dashed" />
        </motion.div>
        <SafeIcon icon={LuShield} className="w-12 h-12 text-red-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>
      <h2 className="text-2xl font-black uppercase mb-4 tracking-tight">Access Denied</h2>
      <p className="text-zinc-500 max-w-md mb-8 font-mono text-xs uppercase tracking-[0.2em]">Admin Access Only. Valid @axim.us.com identity required.</p>

      <div className="flex justify-center scale-110 origin-center mb-8">

      </div>

      <div className="p-4 bg-white/5 border border-white/10 font-mono text-[10px] text-zinc-600 uppercase mt-4">
        Status: Await_Handshake // Error: 0xAUTH_REQ
      </div>
    </div>
  );
}
