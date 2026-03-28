import React from 'react';
import { motion } from 'framer-motion';
import { useAximAuth } from '../hooks/useAximAuth';
import * as LuIcons from 'react-icons/lu';
import SafeIcon from '../common/SafeIcon';

const { LuUser, LuKey, LuShieldAlert, LuDatabase, LuHardDrive, LuSettings } = LuIcons;

export default function Profile() {
  const { account, profile, loading } = useAximAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center font-mono text-axim-gold">INITIALIZING_PROFILE...</div>;

  if (!account) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-6">
        <h2 className="text-2xl font-black uppercase mb-4">Identity Required</h2>
        <p className="text-zinc-500 max-w-md mb-8 font-mono text-xs">Connect your Web3 identity to access secure profile data.</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1000px] mx-auto px-6 py-20 relative z-10">
      <div className="flex flex-col md:flex-row gap-12 items-start">
        <div className="w-full md:w-80 space-y-6">
          <div className="bg-glass border border-subtle p-8 text-center">
            <div className="w-24 h-24 bg-axim-gold/10 border border-axim-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <SafeIcon icon={LuUser} className="w-10 h-10 text-axim-gold" />
            </div>
            <h2 className="font-black uppercase tracking-tight text-xl mb-1">Operator</h2>
            <p className="font-mono text-[0.65rem] text-zinc-500 uppercase truncate mb-6">{account.address}</p>
            <div className="inline-block px-4 py-1.5 bg-axim-purple text-[0.6rem] font-black rounded-sm border border-axim-purple/30">
              CLEARANCE_LEVEL_{profile?.clearance_level || 1}
            </div>
          </div>

          <div className="bg-glass border border-subtle p-6 space-y-4">
            <button className="w-full flex items-center gap-3 p-3 text-[0.65rem] font-mono uppercase text-zinc-400 hover:text-white hover:bg-white/5 transition-all">
              <SafeIcon icon={LuSettings} /> System Settings
            </button>
            <button className="w-full flex items-center gap-3 p-3 text-[0.65rem] font-mono uppercase text-zinc-400 hover:text-white hover:bg-white/5 transition-all">
              <SafeIcon icon={LuKey} /> API Keys
            </button>
            <button className="w-full flex items-center gap-3 p-3 text-[0.65rem] font-mono uppercase text-red-500 hover:bg-red-500/5 transition-all">
              <SafeIcon icon={LuShieldAlert} /> Terminate Session
            </button>
          </div>
        </div>

        <div className="flex-grow space-y-8">
          <div className="bg-glass border border-subtle p-10">
            <h3 className="text-2xl font-black uppercase mb-8 flex items-center gap-3">
              <SafeIcon icon={LuDatabase} className="text-axim-gold" /> Node Association
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 border border-white/5 bg-white/5 rounded-sm">
                <div className="text-[0.6rem] font-mono text-zinc-600 uppercase mb-2">Primary Region</div>
                <div className="font-bold text-white tracking-widest uppercase">US-NORTH-2</div>
              </div>
              <div className="p-6 border border-white/5 bg-white/5 rounded-sm">
                <div className="text-[0.6rem] font-mono text-zinc-600 uppercase mb-2">Data Integrity</div>
                <div className="font-bold text-axim-green tracking-widest uppercase">VERIFIED</div>
              </div>
            </div>
          </div>

          <div className="bg-glass border border-subtle p-10">
            <h3 className="text-2xl font-black uppercase mb-8 flex items-center gap-3">
              <SafeIcon icon={LuHardDrive} className="text-axim-purple" /> Infrastructure Yield
            </h3>
            <div className="space-y-6">
              <div className="flex justify-between items-end border-b border-white/5 pb-4">
                <span className="text-[0.7rem] font-mono text-zinc-500 uppercase">Total Participation</span>
                <span className="text-2xl font-black text-white">1,240 AXM</span>
              </div>
              <div className="flex justify-between items-end border-b border-white/5 pb-4">
                <span className="text-[0.7rem] font-mono text-zinc-500 uppercase">Governance Quorum Participation</span>
                <span className="text-2xl font-black text-axim-gold">82%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}