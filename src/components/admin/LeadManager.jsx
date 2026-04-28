import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';
import { useAximStore } from '../../store/useAximStore';

const { LuMail, LuDownload } = LuIcons;

export default function LeadManager() {
  const partnerLeads = useAximStore((state) => state.partnerLeads);
  const updateLeadStatus = useAximStore((state) => state.updateLeadStatus);

  const handleExportCSV = () => {
    if (!partnerLeads || partnerLeads.length === 0) return;

    const headers = ['Date', 'Company', 'Vertical', 'Contact', 'Email', 'Status'];
    const csvContent = [
      headers.join(','),
      ...partnerLeads.map(lead => [
        new Date(lead.timestamp).toLocaleDateString(),
        `"${(lead.companyName || '').replace(/"/g, '""')}"`,
        `"${(lead.serviceInterest || '').replace(/"/g, '""')}"`,
        `"${(lead.primaryContact || '').replace(/"/g, '""')}"`,
        `"${(lead.emailAddress || '').replace(/"/g, '""')}"`,
        `"${(lead.status || '').replace(/"/g, '""')}"`
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
      transition={{ delay: 0.4 }}
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
              <tr className="border-b border-white/5">
                <th className="py-3 px-4 font-mono uppercase tracking-widest text-[0.65rem] text-zinc-500 font-normal">Date</th>
                <th className="py-3 px-4 font-mono uppercase tracking-widest text-[0.65rem] text-zinc-500 font-normal">Company</th>
                <th className="py-3 px-4 font-mono uppercase tracking-widest text-[0.65rem] text-zinc-500 font-normal">Vertical</th>
                <th className="py-3 px-4 font-mono uppercase tracking-widest text-[0.65rem] text-zinc-500 font-normal">Contact</th>
                <th className="py-3 px-4 font-mono uppercase tracking-widest text-[0.65rem] text-zinc-500 font-normal text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {partnerLeads.map((lead) => (
                <tr key={lead.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-4 text-xs font-mono text-zinc-400">
                    {new Date(lead.timestamp).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-bold text-white uppercase tracking-wider text-sm">{lead.companyName}</div>
                  </td>
                  <td className="py-4 px-4">
                    {lead.serviceInterest && (
                      <span className={`text-[0.55rem] font-mono uppercase tracking-widest px-2 py-1 rounded-sm border ${
                        lead.serviceInterest === 'Fiber Connectivity' ? 'border-axim-teal/30 bg-axim-teal/10 text-axim-teal' :
                        lead.serviceInterest === 'Solar Infrastructure' ? 'border-axim-gold/30 bg-axim-gold/10 text-axim-gold' :
                        'border-zinc-500/30 bg-zinc-500/10 text-zinc-400'
                      }`}>
                        {lead.serviceInterest}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-xs font-mono text-zinc-300">{lead.primaryContact}</div>
                    <div className="text-[0.65rem] font-mono text-zinc-500">{lead.emailAddress}</div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <select
                      value={lead.status || 'Pending'}
                      onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                      className="bg-black/50 border border-white/20 text-[0.65rem] font-mono text-white p-1 rounded-sm focus:outline-none focus:border-axim-teal uppercase tracking-widest appearance-none text-right"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-12 text-zinc-600 text-xs font-mono uppercase tracking-widest border border-dashed border-white/10 bg-black/20 rounded-sm">
            <div className="flex flex-col items-center gap-3">
              <SafeIcon icon={LuMail} className="w-8 h-8 text-white/5" />
              <span className="opacity-50">No active leads</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
