import React, { useState, useEffect, useMemo } from 'react';
import SafeIcon from '../../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';
import { telemetryStore } from '../../lib/telemetry';

export default function ContentAnalytics() {
  const [logs, setLogs] = useState([...telemetryStore]);

  const totalAffiliateClicks = useMemo(() => logs.filter(log => log.type === 'AFFILIATE_CLICK').length, [logs]);
  const totalLeadsCaptured = useMemo(() => logs.filter(log => log.type === 'PARTNER_LEAD_SUBMITTED').length, [logs]);


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
        <SafeIcon icon={LuIcons.LuActivity} className="w-8 h-8 text-axim-purple" />
      </div>


      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
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
      </div>

      <div className="flex-1 bg-[#0A0A0A] border border-white/5 rounded-sm p-4 overflow-y-auto no-scrollbar">
        {logs.length === 0 ? (
          <div className="h-full flex items-center justify-center text-zinc-600 font-mono text-xs uppercase tracking-widest">
            Waiting for system events...
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {logs.map(log => (
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
