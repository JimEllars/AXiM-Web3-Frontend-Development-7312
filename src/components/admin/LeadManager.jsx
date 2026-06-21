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
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-3 px-4 font-mono uppercase tracking-widest text-[0.65rem] text-zinc-500 font-normal">Date</th>
                <th className="py-3 px-4 font-mono uppercase tracking-widest text-[0.65rem] text-zinc-500 font-normal">Partner Source</th>
                <th className="py-3 px-4 font-mono uppercase tracking-widest text-[0.65rem] text-zinc-500 font-normal">Payload Details</th>
                <th className="py-3 px-4 font-mono uppercase tracking-widest text-[0.65rem] text-zinc-500 font-normal text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {partnerLeads.map((lead) => (
                <React.Fragment key={lead.id}>
                <tr className="border-b border-white/10 hover:bg-white/[0.02] transition-colors">

                  <td className="py-4 px-4 text-xs font-mono text-zinc-400">
                    {new Date(lead.timestamp).toLocaleString()}
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-bold text-white uppercase tracking-wider text-sm">{lead.payload?.partner || lead.payload?.source || 'Unknown Partner'}</div>
                    <div className="text-[0.65rem] font-mono text-axim-purple tracking-widest uppercase">{lead.type.replace(/_/g, ' ')}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-xs font-mono text-zinc-300 max-w-xs truncate" title={JSON.stringify(lead.payload)}>
                      {lead.payload?.buttonClicked ? `Clicked: ${lead.payload.buttonClicked}` : lead.payload?.email ? `Lead Email: ${lead.payload.email}` : JSON.stringify(lead.payload)}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right flex flex-col items-end gap-2">
                    <select
                      value={lead.status || 'Pending'}
                      onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                      className="bg-black/50 border border-white/20 text-[0.65rem] font-mono text-white p-1 rounded-sm focus:outline-none focus:border-axim-purple uppercase tracking-widest appearance-none text-right"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Closed">Closed</option>
                    </select>

                  </td>

                </tr>
                {activeLeadId === lead.id && (streamResponse || isStreaming) && (
                  <tr className="bg-black/40 border-b border-white/10">
                    <td colSpan="5" className="p-4">
                      <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-sm p-4 font-mono text-xs text-zinc-300 whitespace-pre-wrap relative">
                        <div className="absolute top-2 right-2 text-[0.55rem] text-axim-purple uppercase tracking-widest opacity-70">
                          Onyx Draft Response
                        </div>
                        <div dangerouslySetInnerHTML={{ __html: streamResponse || 'Initializing swarm intelligence...' }} />
                        {isStreaming && activeLeadId === lead.id && (
                          <div className="w-2 h-2 bg-axim-purple rounded-full animate-ping inline-block ml-2"></div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
              ))}
            </tbody>
          </table>
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
