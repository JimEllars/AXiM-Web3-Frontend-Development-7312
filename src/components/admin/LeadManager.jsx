import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';
import { useAximStore } from '../../store/useAximStore';
import { useOnyxStream } from '../../hooks/useOnyxStream';
import { useState, useEffect } from 'react';

const { LuMail, LuDownload } = LuIcons;
import { telemetryStore } from '../../lib/telemetry';

export default function LeadManager() {
  // partnerLeads is now managed via local state below
  const updateLeadStatus = useAximStore((state) => state.updateLeadStatus);
  const { executeOnyxCommand, streamResponse, isStreaming } = useOnyxStream();
  const [activeLeadId, setActiveLeadId] = useState(null);
  const [partnerLeads, setPartnerLeads] = useState([]);

  const [dismissedLeadIds, setDismissedLeadIds] = useState([]);


  useEffect(() => {
    const filterLeads = () => {
      const leads = telemetryStore.filter(event =>
        event.type === 'AFFILIATE_CLICK' || event.type === 'PARTNER_LEAD_SUBMITTED'
      );
      setPartnerLeads(leads);
    };

    filterLeads();

    const handleTelemetryUpdate = () => {
      filterLeads();
    };

    window.addEventListener('axim-telemetry-update', handleTelemetryUpdate);
    return () => window.removeEventListener('axim-telemetry-update', handleTelemetryUpdate);
  }, []);

  const handleDeployOnyx = async (lead) => {
    setActiveLeadId(lead.id);
    const prompt = `[SYSTEM] Draft a highly professional, 3-sentence B2B outreach email to ${lead.primaryContact} at ${lead.companyName} regarding their inquiry about ${lead.serviceInterest}. Format with proper spacing.`;
    await executeOnyxCommand(prompt);
  };

  const handleExportCSV = () => {
    if (!partnerLeads || partnerLeads.length === 0) return;

    const headers = ['Date', 'Event Type', 'Partner Source', 'Details'];
    const csvContent = [
      headers.join(','),
      ...partnerLeads.map(lead => [
        new Date(lead.timestamp).toLocaleDateString(),
        `"${lead.type}"`,
        `"${(lead.payload?.partner || lead.payload?.source || '').replace(/"/g, '""')}"`,
        `"${JSON.stringify(lead.payload || {}).replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'axim-leads.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "circOut",
                  delay: 0.4  ,
                }}
      className="lg:col-span-3 p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-sm mt-8"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-axim-gold/10 border border-axim-gold/30 flex items-center justify-center rounded-sm text-axim-gold">
            <SafeIcon icon={LuMail} className="w-4 h-4" />
          </div>
          <h3 className="text-lg font-black uppercase text-white tracking-widest">Recent Partner Inquiries</h3>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-3 py-2 border border-white/20 text-white hover:bg-white/10 transition-colors rounded-sm text-[0.65rem] font-mono uppercase tracking-widest"
        >
          <SafeIcon icon={LuDownload} className="w-3 h-3" />
          Export to CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        {partnerLeads && partnerLeads.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partnerLeads.filter(lead => !dismissedLeadIds.includes(lead.id)).map((lead) => {
              const isAffiliate = lead.type === 'AFFILIATE_CLICK';
              const borderClass = isAffiliate ? 'border-axim-purple/30 hover:border-axim-purple/70' : 'border-axim-gold/30 hover:border-axim-gold/70';
              const bgGradient = isAffiliate ? 'bg-gradient-to-br from-axim-purple/5 to-transparent' : 'bg-gradient-to-br from-axim-gold/5 to-transparent';
              const badgeClass = isAffiliate ? 'bg-axim-purple/10 text-axim-purple' : 'bg-axim-gold/10 text-axim-gold';

              return (
                <div key={lead.id} className={`flex flex-col p-5 bg-[#0A0A0A] border ${borderClass} ${bgGradient} rounded-sm transition-colors relative group shadow-lg`}>

                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-sm font-black text-white uppercase tracking-wider mb-1">
                        {lead.payload?.partner || lead.payload?.source || 'Unknown Partner'}
                      </h4>
                      <div className="flex items-center gap-2">
                         <span className={`text-[0.55rem] font-mono uppercase tracking-widest px-2 py-0.5 rounded-sm ${badgeClass}`}>
                           {lead.type.replace(/_/g, ' ')}
                         </span>
                      </div>
                    </div>
                    <span className="text-[0.65rem] font-mono text-zinc-500 uppercase tracking-widest">
                       {new Date(lead.timestamp).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex-1 mb-6">
                    <p className="text-xs font-mono text-zinc-300 break-all bg-black/40 border border-white/5 p-3 rounded-sm h-full overflow-y-auto max-h-24">
                      {lead.payload?.buttonClicked ? `Clicked: ${lead.payload.buttonClicked}` : lead.payload?.email ? `Email: ${lead.payload.email}` : JSON.stringify(lead.payload)}
                    </p>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-white/10 mt-auto">
                    <select
                      value={lead.status || 'Pending'}
                      onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                      className="bg-black/50 border border-white/20 text-[0.6rem] font-mono text-white px-2 py-1 rounded-sm focus:outline-none focus:border-axim-purple uppercase tracking-widest appearance-none"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Closed">Closed</option>
                    </select>

                    <div className="flex items-center gap-2">
                       <button
                         onClick={() => {
                            useAximStore.getState().showToast('Exporting lead data...', 'info');
                         }}
                         className="p-1.5 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white text-zinc-400 rounded-sm transition-colors text-[0.6rem] uppercase tracking-widest"
                         title="Export Lead"
                       >
                         ↓
                       </button>
                       <button
                         onClick={() => { setDismissedLeadIds(prev => [...prev, lead.id]); useAximStore.getState().showToast('Lead dismissed from triage board.', 'info'); }}
                         className="p-1.5 bg-red-500/10 border border-red-500/20 hover:bg-red-500/30 hover:text-red-300 text-red-500/70 rounded-sm transition-colors text-[0.6rem] uppercase tracking-widest"
                         title="Dismiss Lead"
                       >
                         ✕
                       </button>
                    </div>
                  </div>

                  {/* Optional: Show Onyx Stream UI inside card if active */}
                  {activeLeadId === lead.id && (streamResponse || isStreaming) && (
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-sm border border-axim-purple/50 rounded-sm p-4 z-10 overflow-y-auto">
                       <div className="text-[0.55rem] text-axim-purple uppercase tracking-widest opacity-70 mb-2">
                          Onyx Draft Response
                       </div>
                       <div className="font-mono text-xs text-zinc-300 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: streamResponse || 'Initializing swarm intelligence...' }} />
                       {isStreaming && (
                          <div className="w-2 h-2 bg-axim-purple rounded-full animate-ping inline-block mt-2"></div>
                       )}
                       {!isStreaming && (
                          <button onClick={() => setActiveLeadId(null)} className="mt-4 text-[0.6rem] uppercase tracking-widest text-zinc-500 hover:text-white">Close Draft</button>
                       )}
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-zinc-600 text-xs font-mono uppercase tracking-widest border border-dashed border-white/10 bg-black/20 rounded-sm">
            <div className="flex flex-col items-center gap-3">
              <SafeIcon icon={LuMail} className="w-8 h-8 text-white/5" />
              <span className="opacity-50">Awaiting Inbound Partner Traffic...</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
