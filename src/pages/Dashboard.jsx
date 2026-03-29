import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAximAuth } from '../hooks/useAximAuth';
import { supabase } from '../supabase/supabase';
import { localStore } from '../lib/persistence';
import NetworkTopology from '../components/NetworkTopology';
import AximTerminal from '../components/AximTerminal';
import * as LuIcons from 'react-icons/lu';
import SafeIcon from '../common/SafeIcon';
import TelemetryBar from '../components/TelemetryBar';
import DashboardAccessDenied from '../components/DashboardAccessDenied';
import DashboardNodes from '../components/DashboardNodes';
import VaultedRecords from '../components/VaultedRecords';

const { LuActivity, LuLayers, LuDatabase } = LuIcons;

export default function Dashboard() {
  const { account, profile, loading } = useAximAuth();
  const [selectedNode, setSelectedNode] = useState(null);
  const [recentLetters, setRecentLetters] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    async function fetchActivity() {
      if (!profile) return;
      
      try {
        setFetching(true);
        // Always get local letters first
        const localData = localStore.getLetters(profile.id);
        
        if (!profile.is_mock) {
          try {
            const { data: cloudData } = await supabase
              .from('demand_letters_1774676062318')
              .select('*')
              .eq('user_id', profile.id)
              .order('created_at', { ascending: false })
              .limit(5);
              
            if (cloudData) {
              const cloudRecipients = new Set(cloudData.map(c => c.recipient));
              const combined = [...cloudData, ...localData.filter(l => !cloudRecipients.has(l.recipient))];
              setRecentLetters(combined.slice(0, 5));
            } else {
              setRecentLetters(localData);
            }
          } catch (e) {
            setRecentLetters(localData);
          }
        } else {
          setRecentLetters(localData);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setFetching(false);
      }
    }
    fetchActivity();
  }, [profile]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center font-mono text-axim-gold">
      <div className="flex flex-col items-center gap-4">
        <SafeIcon icon={LuActivity} className="w-12 h-12 animate-pulse" />
        <span className="animate-pulse uppercase tracking-[0.3em]">Syncing_Protocol...</span>
      </div>
    </div>
  );

  if (!account) {
    return <DashboardAccessDenied />;
  }

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12 relative z-10">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-6">
        <div>
          <span className="section-label text-axim-gold">Operational Command</span>
          <h1 className="text-5xl font-black uppercase tracking-tighter flex items-center gap-4">
            Command Center
            <span className="inline-block px-3 py-1 bg-axim-purple text-[0.6rem] font-black rounded shadow-[0_0_10px_#8A2BE2]">
              LVL_{profile?.clearance_level || 1}
            </span>
          </h1>
        </div>
        <div className="flex flex-col items-end gap-2">
          {profile?.is_mock && (
            <div className="flex items-center gap-2 text-[0.6rem] font-mono text-axim-gold bg-axim-gold/10 px-3 py-1 border border-axim-gold/20 mb-2">
              <SafeIcon icon={LuDatabase} className="w-3 h-3" /> LOCAL_VAULT_MODE
            </div>
          )}
          <div className="flex gap-4 font-mono text-[0.6rem] text-zinc-500 bg-white/5 p-4 border border-white/10 rounded-sm">
            <div>STATUS: <span className="text-axim-green">ENCRYPTED</span></div>
            <div className="w-px h-4 bg-white/10" />
            <div>ID: <span className="text-white">{account.address.slice(0, 6)}...{account.address.slice(-4)}</span></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
        <DashboardNodes selectedNode={selectedNode} setSelectedNode={setSelectedNode} />

        <div className="space-y-6">
          <div className="bg-glass border border-subtle p-8 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-axim-teal/5 blur-3xl" />
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
              <SafeIcon icon={LuActivity} className="w-3 h-3 text-axim-teal" /> Global Telemetry
            </h4>
            <div className="space-y-6 relative z-10">
              <TelemetryBar label="System Load" color="axim-teal" initialValue={42} />
              <TelemetryBar label="Grid Efficiency" color="axim-gold" initialValue={94} />
              <TelemetryBar label="Active Nodes Sync" color="axim-green" initialValue={88} />
            </div>
          </div>
          <AximTerminal />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-glass border border-subtle p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black uppercase flex items-center gap-3">
              <SafeIcon icon={LuLayers} className="text-axim-gold" /> Network Topology
            </h3>
            <span className="font-mono text-[10px] text-zinc-500 uppercase">Live Node Map</span>
          </div>
          <NetworkTopology />
        </div>

        <VaultedRecords fetching={fetching} recentLetters={recentLetters} />
      </div>
    </div>
  );
}
