import React from 'react';
import SEO from '../components/SEO';
import SafeIcon from '../common/SafeIcon';
import { useAximStore } from '../store/useAximStore';
import { useAximAuth } from '../hooks/useAximAuth';
import * as LuIcons from 'react-icons/lu';
import DashboardNodes from '../components/DashboardNodes';

const { LuLayoutDashboard, LuLock, LuActivity, LuTrendingUp, LuUsers } = LuIcons;

export default function Dashboard() {
  const userSession = useAximStore((state) => state.userSession);
  const nodeStatuses = useAximStore((state) => state.nodeStatuses);
  const isWeb3Enabled = import.meta.env.VITE_ENABLE_WEB3 === 'true';
  const { account } = useAximAuth();

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-20 relative z-10">
      <SEO title="Dashboard" description="AXiM Ecosystem Dashboard." />

      <div className="mb-12">
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-2 flex items-center gap-3">
          <SafeIcon icon={LuLayoutDashboard} className="text-axim-teal" />
          Command Center
        </h1>
        <p className="text-zinc-500 text-sm">Centralized node management and ecosystem routing.</p>
      </div>

      {(!userSession && !account) ? (
        <div className="p-12 border border-white/10 bg-[#0a0a0a] flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-axim-gold/10 flex items-center justify-center text-axim-gold border border-axim-gold/40 shadow-[0_0_15px_rgba(255,234,0,0.1)] mb-6">
            <SafeIcon icon={LuLock} className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-black uppercase mb-2">Access Restricted</h3>
          <p className="text-zinc-400 text-sm max-w-md mx-auto mb-8">
            {isWeb3Enabled
              ? "This dashboard requires an active AXiM Protocol Pass or active B2B Enterprise Session."
              : "This dashboard requires an active B2B Enterprise Session."}
          </p>
          {isWeb3Enabled && (
            <button className="px-8 py-3 bg-axim-gold text-black font-bold uppercase tracking-widest text-sm hover:bg-yellow-400 transition-colors">
              Connect Identity
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <DashboardNodes nodeStatuses={nodeStatuses} setSelectedNode={() => {}} /></div>
      )}
    </div>
  );
}
