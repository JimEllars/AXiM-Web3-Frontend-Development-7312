import React, { useState, useEffect, useMemo } from 'react';
import SafeIcon from '../../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';
import { telemetryStore } from '../../lib/telemetry';

export default function ContentAnalytics() {
  const [logs, setLogs] = useState([...telemetryStore]);
  const [selectedChannel, setSelectedChannel] = useState('All Channels');

  const channels = ['All Channels', 'Powur Solar', 'Chatbase Support', 'Make.com'];

  const filteredLogs = useMemo(() => {
    if (selectedChannel === 'All Channels') return logs;

    return logs.filter(log => {
      if (!log.payload) return false;
      const partner = log.payload.partner || log.payload.source || '';

      if (selectedChannel === 'Powur Solar' && partner.toLowerCase().includes('powur')) return true;
      if (selectedChannel === 'Chatbase Support' && partner.toLowerCase().includes('chatbase')) return true;
      if (selectedChannel === 'Make.com' && partner.toLowerCase().includes('make')) return true;
      return false;
    });
  }, [logs, selectedChannel]);

  const totalAffiliateClicks = useMemo(() => filteredLogs.filter(log => log.type === 'AFFILIATE_CLICK' || log.type === 'PARTNER_FUNNEL_CLICK' || log.type === 'partner_click').length, [filteredLogs]);
  const totalLeadsCaptured = useMemo(() => filteredLogs.filter(log => log.type === 'PARTNER_LEAD_SUBMITTED').length, [filteredLogs]);

  const conversionRate = useMemo(() => {
    if (totalAffiliateClicks === 0) return 0;
    return (totalLeadsCaptured / totalAffiliateClicks) * 100;
  }, [totalAffiliateClicks, totalLeadsCaptured]);

  const conversionColor = useMemo(() => {
    if (conversionRate > 15) return 'text-green-500';
    if (conversionRate >= 5) return 'text-amber-500';
    return 'text-red-500';
  }, [conversionRate]);


  useEffect(() => {
    const handleUpdate = () => setLogs([...telemetryStore]);
    window.addEventListener('axim-telemetry-update', handleUpdate);
    return () => window.removeEventListener('axim-telemetry-update', handleUpdate);
  }, []);

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
          <SafeIcon icon={LuIcons.LuActivity} className="w-8 h-8 text-axim-purple" />
        </div>
      </div>


      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
        <div className="p-6 bg-[#0A0A0A] border border-axim-purple/30 rounded-sm flex flex-col items-center justify-center gap-2 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-axim-purple/5 to-transparent z-0"></div>
          <h3 className="text-zinc-500 font-mono text-[0.65rem] uppercase tracking-widest relative z-10">Total Affiliate Clicks</h3>
          <p className="text-4xl font-black text-white tracking-wider relative z-10">{totalAffiliateClicks}</p>
        </div>
        <div className="p-6 bg-[#0A0A0A] border border-axim-gold/30 rounded-sm flex flex-col items-center justify-center gap-2 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-axim-gold/5 to-transparent z-0"></div>
          <h3 className="text-zinc-500 font-mono text-[0.65rem] uppercase tracking-widest relative z-10">Total Leads Captured</h3>
          <p className="text-4xl font-black text-white tracking-wider relative z-10">{totalLeadsCaptured}</p>
        </div>
        <div className="p-6 bg-[#0A0A0A] border border-white/20 rounded-sm flex flex-col items-center justify-center gap-2 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent z-0"></div>
          <h3 className="text-zinc-500 font-mono text-[0.65rem] uppercase tracking-widest relative z-10">Conversion Rate</h3>
          <p className={`text-4xl font-black tracking-wider relative z-10 ${conversionColor}`}>
            {conversionRate.toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="flex-1 bg-[#0A0A0A] border border-white/5 rounded-sm p-4 overflow-y-auto no-scrollbar">
        {filteredLogs.length === 0 ? (
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
