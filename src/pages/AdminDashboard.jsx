import React, { useState } from 'react';
import SEO from '../components/SEO';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';
import { useAximAuth } from '../hooks/useAximAuth';
import DashboardAccessDenied from '../components/DashboardAccessDenied';
import { logTelemetry } from '../lib/telemetry';
import { motion } from 'framer-motion';
import { useAximStore } from '../store/useAximStore';

// Import the previously orphaned admin components
import OnyxTerminal from '../components/admin/OnyxTerminal';
import LeadManager from '../components/admin/LeadManager';
import ContentAnalytics from '../components/admin/ContentAnalytics';
import EcosystemRegistry from '../components/admin/EcosystemRegistry';

export default function AdminDashboard() {
  const { session, user } = useAximAuth();
  const [activeTab, setActiveTab] = useState('terminal');
  const isWeb3Authenticated = useAximStore((state) => state.isWeb3Authenticated);
  const walletAddress = useAximStore((state) => state.walletAddress);

  // Hard gate: Only authenticated operators can access the Command Center
  if (!session && !user && !isWeb3Authenticated) {
    return <DashboardAccessDenied />;
  }

  const tabs = [
    { id: 'terminal', label: 'Onyx Terminal', icon: LuIcons.LuTerminal },
    { id: 'leads', label: 'Lead Triage', icon: LuIcons.LuUsers },
    { id: 'analytics', label: 'Telemetry', icon: LuIcons.LuActivity },
    { id: 'ecosystem', label: 'Registry', icon: LuIcons.LuNetwork }
  ];

  return (
    <div className="w-full min-h-screen bg-bg-void relative z-10 pb-32">
      <SEO title="Command Center | AXiM Systems" />

      <section className="pt-32 pb-8 relative overflow-hidden bg-black border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.1),transparent_50%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-red-500/10 border border-red-500/30 text-[0.65rem] font-mono uppercase tracking-widest text-red-500 mb-4 rounded-sm">
            <SafeIcon icon={LuIcons.LuShieldAlert} className="w-3 h-3" />
            <span>Level 5 Clearance Authorized</span>
          </div>
          {isWeb3Authenticated && walletAddress && (
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/30 text-[9px] font-mono tracking-widest text-red-400 uppercase rounded-sm select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              [COMMAND_GATEWAY: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)} // LEVEL_5_CLEARANCE]
            </div>
          )}
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white leading-tight">
            Master <span className="text-red-500">Command.</span>
          </h1>
        </div>
      </section>

      <motion.section
        className="max-w-7xl mx-auto px-6 lg:px-8 mt-8"
        onViewportEnter={() => { logTelemetry('admin_dashboard_viewed', { initialTab: activeTab }); }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="flex gap-2 overflow-x-auto snap-x snap-mandatory hide-scrollbar no-scrollbar border-b border-white/10 pb-4 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
              setActiveTab(tab.id);
              logTelemetry('admin_tab_switched', { tabId: tab.id, tabLabel: tab.label });
            }}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-widest rounded-sm transition-colors whitespace-nowrap snap-start ${
                activeTab === tab.id
                  ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                  : 'bg-white/5 text-zinc-500 hover:text-white hover:bg-white/10'
              }`}
            >
              <SafeIcon icon={tab.icon} className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        <div className="animate-fade-in bg-[#050505] border border-white/10 rounded-sm shadow-2xl relative overflow-hidden min-h-[600px]">
           {activeTab === 'terminal' && <OnyxTerminal />}
           {activeTab === 'leads' && <LeadManager />}
           {activeTab === 'analytics' && <ContentAnalytics />}
           {activeTab === 'ecosystem' && <EcosystemRegistry />}
        </div>
      </motion.section>
    </div>
  );
}
