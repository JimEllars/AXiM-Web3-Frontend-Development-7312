import React, { useState } from 'react';
import SEO from '../components/SEO';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';
import { useAximAuth } from '../hooks/useAximAuth';
import DashboardAccessDenied from '../components/DashboardAccessDenied';
import { useAximStore } from '../store/useAximStore';

export default function Profile() {
  const { session, user } = useAximAuth();
  const [activeTab, setActiveTab] = useState('vault');

  const vaultedAssets = useAximStore((state) => state.assets);
  const activeTickets = useAximStore((state) => state.tickets);

  // Strict Authentication Gate
  if (!session) {
    return <DashboardAccessDenied />;
  }

  return (
    <div className="w-full min-h-screen bg-bg-void relative z-10 pb-32">
      <SEO title="Operator Vault | AXiM Systems" />

      {/* Vault Header */}
      <section className="pt-32 pb-12 relative overflow-hidden bg-black border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(147,51,234,0.1),transparent_50%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-axim-green/10 border border-axim-green/30 text-[0.65rem] font-mono uppercase tracking-widest text-axim-green mb-4 rounded-sm">
              <SafeIcon icon={LuIcons.LuLock} className="w-3 h-3" />
              <span>Connection Secure</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white leading-tight">
              Operator <span className="text-axim-purple">Vault.</span>
            </h1>
            <p className="text-zinc-400 text-sm font-mono mt-2 uppercase tracking-widest">
              ID: {user?.email || 'AXIM_GUEST_OP'}
            </p>
          </div>

          <div className="flex gap-2">
            <button className="px-6 py-3 bg-white/5 border border-white/10 text-white text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-colors rounded-sm">
              Settings
            </button>
            <button className="px-6 py-3 bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-colors rounded-sm flex items-center gap-2">
              <SafeIcon icon={LuIcons.LuLogOut} className="w-3 h-3" /> Terminate
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-8 mt-12">
        {/* Navigation Tabs */}
        <div className="flex gap-8 border-b border-white/10 mb-8 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('vault')}
            className={`pb-4 text-xs font-black uppercase tracking-widest transition-colors whitespace-nowrap ${activeTab === 'vault' ? 'text-axim-purple border-b-2 border-axim-purple' : 'text-zinc-500 hover:text-white border-b-2 border-transparent'}`}
          >
            Digital Assets
          </button>
          <button
            onClick={() => setActiveTab('tickets')}
            className={`pb-4 text-xs font-black uppercase tracking-widest transition-colors whitespace-nowrap ${activeTab === 'tickets' ? 'text-[#DB2777] border-b-2 border-[#DB2777]' : 'text-zinc-500 hover:text-white border-b-2 border-transparent'}`}
          >
            Active Consultations
          </button>
        </div>

        {/* Tab 1: Vaulted Assets */}
        {activeTab === 'vault' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
            {vaultedAssets.length === 0 ? (
              <div className="bg-[#050505] border border-white/10 p-12 rounded-sm text-center text-zinc-500 font-mono text-sm uppercase tracking-widest col-span-1 md:col-span-2">
                No encrypted assets detected in this vault.
              </div>
            ) : vaultedAssets.map((asset, idx) => (
              <div key={idx} className="bg-[#050505] border border-white/10 p-6 rounded-sm shadow-xl hover:border-axim-purple/50 transition-colors group relative overflow-hidden flex flex-col justify-between min-h-[200px]">
                <div className={`absolute top-0 right-0 w-32 h-32 opacity-5 blur-[40px] pointer-events-none group-hover:opacity-10 transition-opacity ${asset.color.replace('text-', 'bg-')}`} />
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <SafeIcon icon={asset.icon} className={`w-8 h-8 ${asset.color}`} />
                    <span className="text-[0.6rem] font-mono uppercase tracking-widest text-zinc-500 bg-white/5 px-2 py-1 rounded-sm border border-white/10">
                      {asset.date}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tight mb-1">{asset.type}</h3>
                  <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest">ID: {asset.id}</p>
                </div>
                <div className="mt-8 flex justify-between items-center border-t border-white/5 pt-4">
                  <span className="text-xs font-bold text-axim-green uppercase tracking-widest flex items-center gap-1">
                    <SafeIcon icon={LuIcons.LuCircleCheck} className="w-3 h-3" /> {asset.status}
                  </span>
                  <button className={`text-[0.65rem] font-black uppercase tracking-widest transition-colors flex items-center gap-2 ${asset.color} hover:text-white`}>
                    Extract <SafeIcon icon={LuIcons.LuDownload} className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Tickets */}
        {activeTab === 'tickets' && (
          <div className="space-y-4 animate-fade-in">
            {activeTickets.length === 0 ? (
              <div className="bg-[#050505] border border-white/10 p-12 rounded-sm text-center text-zinc-500 font-mono text-sm uppercase tracking-widest col-span-1 md:col-span-2">
                No active consultations.
              </div>
            ) : activeTickets.map((ticket, idx) => (
              <div key={idx} className="bg-[#0F172A] border border-white/5 p-6 rounded-sm shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[0.6rem] font-mono text-zinc-500 uppercase tracking-widest border border-white/10 px-2 py-0.5 rounded-sm">{ticket.id}</span>
                    <span className={`text-[0.6rem] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm ${ticket.priority === 'High' ? 'bg-red-500/10 text-red-500 border border-red-500/30' : 'bg-white/5 text-zinc-400'}`}>
                      {ticket.priority} Priority
                    </span>
                  </div>
                  <h4 className="text-base font-black text-white uppercase tracking-wider">{ticket.subject}</h4>
                </div>
                <div className="flex flex-col md:items-end">
                  <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest mb-1">{ticket.date}</span>
                  <span className="text-[0.65rem] font-bold text-axim-gold uppercase tracking-widest flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-axim-gold animate-pulse" /> {ticket.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
