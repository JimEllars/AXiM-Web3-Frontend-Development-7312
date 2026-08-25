import React, { useState, useEffect, useMemo } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';
import { useAximStore } from '../../store/useAximStore.js';

function AnimatedCounter({ value, prefix = '', suffix = '' }) {
  const nodeRef = React.useRef(null);
  const motionValue = useMotionValue(0);

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration: 1,
      ease: "easeOut",
      onUpdate(latest) {
        if (nodeRef.current) {
          if (value % 1 !== 0) {
            nodeRef.current.textContent = prefix + latest.toFixed(1) + suffix;
          } else {
             nodeRef.current.textContent = prefix + Math.round(latest) + suffix;
          }
        }
      }
    });

    return () => controls.stop();
  }, [value, prefix, suffix, motionValue]);

  return <span ref={nodeRef}>{prefix}0{suffix}</span>;
}

export default function ContentAnalytics() {
  const filteredLogsRaw = useAximStore((state) => state.telemetryCollection) || [];
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const [selectedChannel, setSelectedChannel] = useState('All Channels');
  const channels = ['All Channels', 'Powur Solar', 'Chatbase Support', 'Make.com'];

  const filteredLogs = useMemo(() => {
    if (selectedChannel === 'All Channels') return filteredLogsRaw;

    return filteredLogsRaw.filter(log => {
      if (!log.payload) return false;
      const partner = log.payload.partner || log.payload.source || '';

      if (selectedChannel === 'Powur Solar' && partner.toLowerCase().includes('powur')) return true;
      if (selectedChannel === 'Chatbase Support' && partner.toLowerCase().includes('chatbase')) return true;
      if (selectedChannel === 'Make.com' && partner.toLowerCase().includes('make')) return true;
      return false;
    });
  }, [filteredLogsRaw, selectedChannel]);

  const totalActiveSessions = useMemo(() => {
    const sessionIds = new Set();
    filteredLogs.forEach(log => {
      if (log.sessionId) sessionIds.add(log.sessionId);
    });
    return sessionIds.size;
  }, [filteredLogs]);

  const conversionIntents = useMemo(() => filteredLogs.filter(log => ['consultation_intent', 'store_waitlist_intent'].includes(log.type)).length, [filteredLogs]);

  const pageViews = useMemo(() => filteredLogs.filter(log => log.type === 'PAGE_VIEW' || log.type === 'page_view').length, [filteredLogs]);

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8,"
      + "Timestamp,Type,Payload\n"
      + filteredLogs.map(e => `${new Date(e.timestamp).toISOString()},${e.type},${JSON.stringify(e.payload).replace(/"/g, '""')}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "axim_analytics_summary.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-8 h-full flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h2 className="text-xl font-black text-white uppercase tracking-widest">System Telemetry</h2>
          <p className="text-zinc-500 font-mono text-[0.65rem] uppercase tracking-widest">Live Event Stream</p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value)}
            className="bg-[#0A0A0A] border border-white/10 p-2 text-white text-xs font-mono focus:border-axim-purple outline-none rounded-sm uppercase tracking-widest cursor-pointer"
          >
            {channels.map(channel => (
              <option key={channel} value={channel}>{channel}</option>
            ))}
          </select>
          <button onClick={exportCSV} className="bg-axim-purple/20 hover:bg-axim-purple border border-axim-purple/50 transition-colors text-white text-xs font-mono py-2 px-4 rounded-sm uppercase tracking-widest flex items-center gap-2">
            <SafeIcon icon={LuIcons.LuDownload} className="w-4 h-4" /> Export CSV
          </button>
          <SafeIcon icon={LuIcons.LuActivity} className="w-8 h-8 text-axim-purple" />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
          <div className="p-6 bg-white/5 border border-white/10 rounded-sm animate-pulse h-[120px]"></div>
          <div className="p-6 bg-white/5 border border-white/10 rounded-sm animate-pulse h-[120px]" style={{ animationDelay: '150ms' }}></div>
          <div className="p-6 bg-white/5 border border-white/10 rounded-sm animate-pulse h-[120px]" style={{ animationDelay: '300ms' }}></div>
        </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
        <div className="p-6 bg-[#0A0A0A] border border-axim-purple/30 rounded-sm flex flex-col items-center justify-center gap-2 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-axim-purple/5 to-transparent z-0"></div>
          <h3 className="text-zinc-500 font-mono text-[0.65rem] uppercase tracking-widest relative z-10">Total Active Sessions</h3>
          <p className="text-4xl font-black text-white tracking-wider relative z-10"><AnimatedCounter value={totalActiveSessions} /></p>
        </div>
        <div className="p-6 bg-[#0A0A0A] border border-axim-gold/30 rounded-sm flex flex-col items-center justify-center gap-2 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-axim-gold/5 to-transparent z-0"></div>
          <h3 className="text-zinc-500 font-mono text-[0.65rem] uppercase tracking-widest relative z-10">Conversion Intents</h3>
          <p className="text-4xl font-black text-white tracking-wider relative z-10"><AnimatedCounter value={conversionIntents} /></p>
        </div>
        <div className="p-6 bg-[#0A0A0A] border border-emerald-500/30 rounded-sm flex flex-col items-center justify-center gap-2 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent z-0"></div>
          <h3 className="text-zinc-500 font-mono text-[0.65rem] uppercase tracking-widest relative z-10">Page Views</h3>
          <p className="text-4xl font-black text-white tracking-wider relative z-10"><AnimatedCounter value={pageViews} /></p>
        </div>
      </div>
      )}

      <div className="flex-1 bg-[#0A0A0A] border border-white/5 rounded-sm p-4 overflow-y-auto no-scrollbar">
        {isLoading ? (
          <div className="flex flex-col gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-3 border border-white/5 bg-white/5 animate-pulse rounded-sm h-[60px]" style={{ animationDelay: `${i * 100}ms` }}></div>
            ))}
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="h-full flex items-center justify-center text-zinc-600 font-mono text-xs uppercase tracking-widest">
            Waiting for system events...
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filteredLogs.map(log => (
              <div key={log.id} className="p-3 border border-white/5 bg-black rounded-sm flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-axim-purple font-mono text-[0.65rem] font-bold uppercase tracking-widest">{log.type}</span>
                  <span className="text-zinc-400 text-xs font-mono">{JSON.stringify(log.payload)}</span>
                </div>
                <span className="text-zinc-600 text-[0.60rem] font-mono whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
