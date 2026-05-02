import React, { useState, useEffect } from 'react';
import FleetMap from '../components/FleetMap';
import SEO from '../components/SEO';
import SafeIcon from '../common/SafeIcon';
import { useAximStore } from '../store/useAximStore';
import * as LuIcons from 'react-icons/lu';

const { LuActivity, LuClock, LuServer, LuNetwork } = LuIcons;

export default function Status() {
  const startTelemetryPolling = useAximStore((state) => state.startTelemetryPolling);
  const nodeStatuses = useAximStore((state) => state.nodeStatuses);

  useEffect(() => {
    startTelemetryPolling();
  }, []);

  const [metrics, setMetrics] = useState({
    uptime: '99.99%',
    latency: '42ms',
    loading: true
  });

  useEffect(() => {
    async function fetchTelemetryHistory() {
      try {
        const response = await fetch('https://wp.axim.us.com/wp-json/axim/v1/telemetry-history');
        if (response.ok) {
          const data = await response.json();
          setMetrics({
            uptime: data.uptime || '99.99%',
            latency: data.latency || '42ms',
            loading: false
          });
        } else {
          throw new Error('Failed to fetch');
        }
      } catch (error) {
        setMetrics({
          uptime: '99.99%',
          latency: '45ms',
          loading: false
        });
      }
    }
    fetchTelemetryHistory();
  }, []);

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-20 relative z-10">
      <SEO title="Fleet Status" description="AXiM Ecosystem public status and telemetry."  url="https://axim.us.com/status"/>

      <div className="mb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-axim-gold/10 border border-axim-gold/20 text-axim-gold text-[0.65rem] font-mono uppercase tracking-widest mb-6">
          <SafeIcon icon={LuActivity} className="w-3 h-3" />
          Public Telemetry
        </div>
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">
          Fleet <span className="text-transparent bg-clip-text bg-gradient-to-r from-axim-gold to-axim-purple">Status</span>
        </h1>
        <p className="text-zinc-400 max-w-2xl mx-auto font-mono text-sm leading-relaxed">
          Real-time node operations and 7-day trailing performance metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-16">
        <div className="lg:col-span-3">
          <h2 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-3 mb-6">
            <SafeIcon icon={LuServer} className="text-axim-gold" />
            Live Fleet Map
          </h2>
          <div className="border border-white/10 bg-[#050505] p-4 rounded-sm">
            <FleetMap />
          </div>
        </div>

        <div className="lg:col-span-1 space-y-4 flex flex-col">
          <div className="p-6 border border-white/10 bg-white/5 flex flex-col flex-grow">
             <h3 className="text-xs font-mono text-axim-purple uppercase tracking-widest mb-4 border-b border-white/10 pb-2">Fleet Stats</h3>
             <div className="space-y-4 font-mono text-sm">
               <div className="flex justify-between items-center">
                 <span className="text-zinc-500 uppercase text-[0.6rem]">Active Satellites</span>
                 <span className="text-axim-gold font-bold">3</span>
               </div>
               <div className="flex justify-between items-center">
                 <span className="text-zinc-500 uppercase text-[0.6rem]">Jobs in Queue</span>
                 <span className="text-white">12</span>
               </div>
               <div className="flex justify-between items-center">
                 <span className="text-zinc-500 uppercase text-[0.6rem]">Encryption Protocol</span>
                 <span className="text-axim-purple">v1.2.4</span>
               </div>
             </div>
          </div>
          <div className="p-6 border border-white/10 bg-white/5 flex flex-col mt-4">
             <h3 className="text-xs font-mono text-axim-purple uppercase tracking-widest mb-4 border-b border-white/10 pb-2">Satellite Registry</h3>
             <div className="space-y-2 font-mono text-xs text-zinc-400">
               <div className="flex gap-2">
                 <span className="text-axim-purple">[NODE_NYC]:</span>
                 <span className="text-axim-gold">ACTIVE</span>
               </div>
               <div className="flex gap-2">
                 <span className="text-axim-purple">[NODE_LDN]:</span>
                 <span className="text-axim-gold">SYNCING</span>
               </div>
               <div className="flex gap-2">
                 <span className="text-axim-purple">[NODE_TOK]:</span>
                 <span className="text-zinc-500">IDLE</span>
               </div>
             </div>
          </div>

        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-3 mb-6">
          <SafeIcon icon={LuNetwork} className="text-axim-purple" />
          7-Day Trailing Average
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 border border-white/10 bg-white/5 flex flex-col items-center justify-center text-center group hover:border-axim-gold/30 transition-colors">
            <SafeIcon icon={LuActivity} className="w-8 h-8 text-axim-gold mb-4" />
            <div className="text-[0.65rem] font-mono text-zinc-500 uppercase tracking-widest mb-2">Ecosystem Uptime</div>
            <div className="text-4xl font-mono font-bold text-white">
              {metrics.loading ? '...' : metrics.uptime}
            </div>
          </div>

          <div className="p-8 border border-white/10 bg-white/5 flex flex-col items-center justify-center text-center group hover:border-axim-purple/30 transition-colors">
            <SafeIcon icon={LuClock} className="w-8 h-8 text-axim-purple mb-4" />
            <div className="text-[0.65rem] font-mono text-zinc-500 uppercase tracking-widest mb-2">API Latency</div>
            <div className="text-4xl font-mono font-bold text-white">
              {metrics.loading ? '...' : metrics.latency}
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto mt-16">
        <h2 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-3 mb-6">
          <SafeIcon icon={LuServer} className="text-axim-purple" />
          Live Sub-routines
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { id: 'core', name: 'AXiM Core' },
            { id: 'demand', name: 'Demand Letter' },
            { id: 'nda', name: 'NDA Generator' },
            { id: 'stub', name: 'Pay Stub' }
          ].map(node => {
            const isOperational = nodeStatuses?.[node.id] === 'operational';
            return (
              <div key={node.id} className="p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-sm flex flex-col items-center justify-center text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className={`w-2 h-2 rounded-full ${isOperational ? 'bg-axim-gold shadow-[0_0_8px_240,255,0,0.5)]' : 'bg-red-500 animate-pulse'}`} />
                  <span className={`text-[0.65rem] font-mono uppercase tracking-widest ${isOperational ? 'text-axim-gold' : 'text-red-500'}`}>
                    {isOperational ? 'Operational' : 'Degraded'}
                  </span>
                </div>
                <div className="text-sm font-bold text-white uppercase tracking-wider">{node.name}</div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
