import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAximAuth } from '../hooks/useAximAuth';
import { supabase } from '../supabase/supabase';
import { localStore } from '../lib/persistence';
import NetworkTopology from '../components/NetworkTopology';
import AximTerminal from '../components/AximTerminal';
import * as LuIcons from 'react-icons/lu';
import SafeIcon from '../common/SafeIcon';
import { ConnectButton } from "thirdweb/react";
import { client } from "../lib/thirdweb-client";
import { sepolia } from "thirdweb/chains";

const { LuActivity, LuZap, LuShield, LuGlobe, LuCpu, LuLayers, LuClock, LuExternalLink, LuLock, LuDatabase } = LuIcons;

function TelemetryBar({ label, color, initialValue }) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    const interval = setInterval(() => {
      setValue(prev => {
        const diff = Math.floor(Math.random() * 5) - 2;
        const next = prev + diff;
        return Math.min(100, Math.max(0, next));
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const colorClass = color === 'axim-teal' ? 'text-axim-teal bg-axim-teal shadow-[0_0_10px_#00E5FF]' :
                     color === 'axim-gold' ? 'text-axim-gold bg-axim-gold shadow-[0_0_10px_#FFEA00]' :
                     'text-axim-green bg-axim-green shadow-[0_0_10px_#00FF88]';

  const textColor = color === 'axim-teal' ? 'text-axim-teal' :
                    color === 'axim-gold' ? 'text-axim-gold' :
                    'text-axim-green';

  return (
    <div>
      <div className="flex justify-between text-[0.6rem] mb-2 uppercase">
        <span>{label}</span>
        <span className={textColor}>{value}%</span>
      </div>
      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: `${initialValue}%` }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className={`h-full ${colorClass.split(' ')[1]} ${colorClass.split(' ')[2]}`}
        />
      </div>
    </div>
  );
}

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
              const combined = [...cloudData, ...localData.filter(l => !cloudData.find(c => c.recipient === l.recipient))];
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
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center relative z-10">
        <div className="relative mb-12">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="w-32 h-32 border border-axim-gold/20 rounded-full flex items-center justify-center" >
            <div className="w-24 h-24 border border-axim-gold/40 rounded-full border-dashed" />
          </motion.div>
          <SafeIcon icon={LuShield} className="w-12 h-12 text-axim-gold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <h2 className="text-2xl font-black uppercase mb-4 tracking-tight">Access Denied</h2>
        <p className="text-zinc-500 max-w-md mb-8 font-mono text-xs uppercase tracking-[0.2em]">Connect Web3 identity to authenticate session.</p>

        <div className="flex justify-center scale-110 origin-center mb-8">
          <ConnectButton
            client={client}
            accountAbstraction={{ chain: sepolia, sponsorGas: true }}
            theme="dark"
          />
        </div>

        <div className="p-4 bg-white/5 border border-white/10 font-mono text-[10px] text-zinc-600 uppercase mt-4">
          Status: Await_Handshake // Error: 0xAUTH_REQ
        </div>
      </div>
    );
  }

  const nodes = [
    { id: 'AX-101', type: 'Solar', status: 'Optimal', load: '72%', temp: '42°C', icon: LuZap },
    { id: 'AX-102', type: 'Fiber', status: 'Optimal', throughput: '1.2 Tbps', icon: LuGlobe },
    { id: 'AX-103', type: 'Neural', status: 'Active', accuracy: '98.2%', icon: LuCpu },
  ];

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
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
          {nodes.map((node) => (
            <motion.div key={node.id} whileHover={{ y: -5 }} onClick={() => setSelectedNode(node)} className={`cursor-pointer p-8 border transition-all duration-300 ${selectedNode?.id === node.id ? 'bg-axim-gold/10 border-axim-gold shadow-[0_0_30px_rgba(255,234,0,0.1)]' : 'bg-glass border-subtle hover:border-white/30'}`} >
              <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-sm ${selectedNode?.id === node.id ? 'bg-axim-gold text-black' : 'bg-white/5 text-axim-gold'}`}>
                  <SafeIcon icon={node.icon} className="w-6 h-6" />
                </div>
                <span className="font-mono text-[0.6rem] text-axim-green flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-axim-green rounded-full animate-pulse" /> ONLINE
                </span>
              </div>
              <h3 className="text-xl font-bold uppercase mb-1">{node.id}</h3>
              <p className="text-zinc-500 text-xs uppercase tracking-widest mb-4">{node.type} Node</p>
              <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                {Object.entries(node).filter(([key]) => !['id', 'type', 'status', 'icon'].includes(key)).map(([key, val]) => (
                  <div key={key}>
                    <div className="text-[0.6rem] text-zinc-600 uppercase mb-1">{key}</div>
                    <div className="text-sm font-bold font-mono text-white">{val}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

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

        <div className="bg-glass border border-subtle p-8 overflow-hidden relative font-mono">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black uppercase flex items-center gap-3">
              Vaulted Records
            </h3>
            <button className="text-[0.6rem] text-axim-gold hover:text-white uppercase tracking-widest flex items-center gap-2">
              Export Registry <SafeIcon icon={LuExternalLink} className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-2">
            <div className="text-[0.6rem] text-zinc-600 flex justify-between uppercase mb-4 pb-2 border-b border-white/5">
              <span>Document_ID</span>
              <span>Recipient</span>
              <span>Status</span>
            </div>
            {fetching ? (
              <div className="text-center py-12 opacity-20 animate-pulse uppercase text-[0.6rem]">Querying_Blockchain_Registry...</div>
            ) : recentLetters.length > 0 ? (
              recentLetters.map((letter) => (
                <div key={letter.id} className="group flex justify-between items-center text-[0.7rem] py-4 px-4 bg-white/5 border border-white/5 hover:border-axim-gold/30 transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <SafeIcon icon={LuClock} className="text-zinc-600 group-hover:text-axim-gold transition-colors" />
                    <span className="text-white font-bold">{letter.id.startsWith('AXM-') ? letter.id : `#AXM-${letter.id.slice(0, 5).toUpperCase()}`}</span>
                  </div>
                  <span className="text-zinc-400 capitalize">{letter.recipient}</span>
                  <span className={`flex items-center gap-2 font-black ${letter.status === 'draft' ? 'text-axim-gold' : 'text-axim-green'}`}>
                    {letter.status.toUpperCase()}
                  </span>
                </div>
              ))
            ) : (
              <div className="py-16 border border-dashed border-white/5 flex flex-col items-center justify-center text-zinc-800">
                <SafeIcon icon={LuLock} className="w-10 h-10 mb-4 opacity-10" />
                <span className="text-[0.6rem] uppercase tracking-[0.3em]">Registry_Empty // No_Records</span>
              </div>
            )}
            <div className="pt-8 text-center text-zinc-800 text-[0.6rem] uppercase tracking-widest border-t border-white/5 mt-4">
              SECURE_END_OF_FILE
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}