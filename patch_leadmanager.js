import fs from 'fs';

const filePath = 'src/components/admin/LeadManager.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// Replace table with CSS grid cards
const oldTableBlock = `<table className="w-full text-left border-collapse min-w-[600px]">
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
                      {lead.payload?.buttonClicked ? \`Clicked: \${lead.payload.buttonClicked}\` : lead.payload?.email ? \`Lead Email: \${lead.payload.email}\` : JSON.stringify(lead.payload)}
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
          </table>`;

const newGridBlock = `<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partnerLeads.map((lead) => {
              const isAffiliate = lead.type === 'AFFILIATE_CLICK';
              const borderClass = isAffiliate ? 'border-axim-purple/30 hover:border-axim-purple/70' : 'border-axim-gold/30 hover:border-axim-gold/70';
              const bgGradient = isAffiliate ? 'bg-gradient-to-br from-axim-purple/5 to-transparent' : 'bg-gradient-to-br from-axim-gold/5 to-transparent';
              const badgeClass = isAffiliate ? 'bg-axim-purple/10 text-axim-purple' : 'bg-axim-gold/10 text-axim-gold';

              return (
                <div key={lead.id} className={\`flex flex-col p-5 bg-[#0A0A0A] border \${borderClass} \${bgGradient} rounded-sm transition-colors relative group shadow-lg\`}>

                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-sm font-black text-white uppercase tracking-wider mb-1">
                        {lead.payload?.partner || lead.payload?.source || 'Unknown Partner'}
                      </h4>
                      <div className="flex items-center gap-2">
                         <span className={\`text-[0.55rem] font-mono uppercase tracking-widest px-2 py-0.5 rounded-sm \${badgeClass}\`}>
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
                      {lead.payload?.buttonClicked ? \`Clicked: \${lead.payload.buttonClicked}\` : lead.payload?.email ? \`Email: \${lead.payload.email}\` : JSON.stringify(lead.payload)}
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
                         onClick={() => {
                            useAximStore.getState().showToast('Lead dismissed from triage board.', 'info');
                         }}
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
          </div>`;

content = content.replace(oldTableBlock, newGridBlock);

fs.writeFileSync(filePath, content);
console.log('Patched src/components/admin/LeadManager.jsx');
