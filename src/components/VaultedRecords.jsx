import React, { useEffect, useState } from 'react';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';
import { useAximStore } from '../store/useAximStore';
import { logTelemetry } from '../lib/telemetry';

const { LuLock } = LuIcons;


const handleExport = (record) => {
  try {
    // Create a formatted HTML string based on the record type
    let htmlContent = `
      <html>
        <head>
          <title>${record.title}</title>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #111; line-height: 1.6; }
            h1 { font-size: 24px; text-transform: uppercase; border-bottom: 2px solid #111; padding-bottom: 10px; margin-bottom: 30px; }
            .meta { font-family: monospace; font-size: 12px; color: #666; margin-bottom: 40px; }
            .section { margin-bottom: 20px; }
            .label { font-weight: bold; text-transform: uppercase; font-size: 12px; color: #444; }
            .value { font-size: 16px; margin-top: 4px; }
            .legal-text { margin-top: 40px; font-size: 11px; color: #555; text-align: justify; }
          </style>
        </head>
        <body>
          <h1>${record.type === 'NDA' ? 'Mutual Non-Disclosure Agreement' : 'Official Earnings Statement'}</h1>
          <div class="meta">DOCUMENT ID: ${record.id}<br/>TIMESTAMP: ${new Date(record.timestamp).toUTCString()}</div>
    `;

    // Dynamically map all properties captured during the wizard
    Object.entries(record.data || {}).forEach(([key, value]) => {
       const cleanLabel = key.replace(/([A-Z])/g, ' $1').toUpperCase();
       htmlContent += `
         <div class="section">
           <div class="label">${cleanLabel}</div>
           <div class="value">${value}</div>
         </div>
       `;
    });

    htmlContent += `
          <div class="legal-text">
             This document was autonomously generated via the AXiM Systems Infrastructure on behalf of the cryptographic operator.
             This cryptographic hash serves as a timestamped verification of intent.
          </div>
        </body>
      </html>
    `;

    // Open a hidden print window, write the HTML, and trigger the native PDF/Print dialog
    const printWindow = window.open('', '_blank');
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();

    // Delay slightly to ensure browser renders the DOM before invoking print
    setTimeout(() => {
      printWindow.print();

      // Notify and track export
      useAximStore.getState().setNotification('PDF successfully generated.');
      logTelemetry('EXPORT_GENERATED', { type: record.type });

      printWindow.close();
    }, 250);

  } catch (error) {
    console.error('Export generation failed:', error);
  }
};

export default function VaultedRecords() {
  const isWeb3Authenticated = useAximStore((state) => state.isWeb3Authenticated);
  const vaultedArtifacts = useAximStore((state) => state.vaultedArtifacts);
  const removeVaultedArtifact = useAximStore((state) => state.removeVaultedArtifact);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFetching(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);




  return (
    <>
        {fetching ? (
          <div className="flex-1 flex items-center justify-center opacity-30 animate-pulse flex-col gap-4 py-8">
            <SafeIcon icon={LuLock} className="w-8 h-8 text-axim-purple" />
            <div className="uppercase text-[0.6rem] text-white tracking-widest font-mono">Querying_Secure_Vault...</div>
          </div>
                ) : isWeb3Authenticated ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Mock Web3 Record 1 */}
            <div className="p-4 border border-white/10 bg-[#050505] rounded-sm hover:border-axim-purple/50 transition-colors group relative">
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-start mb-2 pr-8">
                    <h3 className="text-white font-bold text-sm tracking-wide">Mutual NDA - Partner #812</h3>
                    <span className="text-[0.6rem] px-2 py-0.5 bg-axim-purple/20 text-axim-purple uppercase tracking-widest rounded-sm">
                      NDA
                    </span>
                  </div>
                  <p className="text-zinc-500 text-xs font-mono mb-4 flex items-center gap-2">
                    <SafeIcon icon={LuIcons.LuCalendar} className="w-3 h-3" />
                    {new Date().toLocaleDateString()}
                  </p>
                  <div className="mt-auto">
                    <button
                      onClick={() => { useAximStore.getState().setGlobalLoading(true, 'Decrypting Vaulted Document...'); setTimeout(() => { useAximStore.getState().setGlobalLoading(false); useAximStore.getState().showToast('Mock download was successful.', 'success'); }, 1500); }}
                      className="w-full py-2 bg-transparent border border-white/10 text-zinc-300 text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-colors rounded-sm flex items-center justify-center gap-2"
                    >
                      <SafeIcon icon={LuIcons.LuDownload} className="w-3 h-3" />
                      Download (Mock) &darr;
                    </button>
                  </div>
                </div>
            </div>

            {/* Mock Web3 Record 2 */}
            <div className="p-4 border border-white/10 bg-[#050505] rounded-sm hover:border-axim-purple/50 transition-colors group relative">
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-start mb-2 pr-8">
                    <h3 className="text-white font-bold text-sm tracking-wide">Income Verification - Q3</h3>
                    <span className="text-[0.6rem] px-2 py-0.5 bg-axim-purple/20 text-axim-purple uppercase tracking-widest rounded-sm">
                      PAY STUB
                    </span>
                  </div>
                  <p className="text-zinc-500 text-xs font-mono mb-4 flex items-center gap-2">
                    <SafeIcon icon={LuIcons.LuCalendar} className="w-3 h-3" />
                    {new Date(Date.now() - 86400000).toLocaleDateString()}
                  </p>
                  <div className="mt-auto">
                    <button
                      onClick={() => { useAximStore.getState().setGlobalLoading(true, 'Decrypting Vaulted Document...'); setTimeout(() => { useAximStore.getState().setGlobalLoading(false); useAximStore.getState().showToast('Mock download was successful.', 'success'); }, 1500); }}
                      className="w-full py-2 bg-transparent border border-white/10 text-zinc-300 text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-colors rounded-sm flex items-center justify-center gap-2"
                    >
                      <SafeIcon icon={LuIcons.LuDownload} className="w-3 h-3" />
                      Download (Mock) &darr;
                    </button>
                  </div>
                </div>
            </div>
          </div>
        ) : vaultedArtifacts && vaultedArtifacts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vaultedArtifacts.map((record) => (
              <div key={record.id} className="p-4 border border-white/10 bg-[#050505] rounded-sm hover:border-axim-purple/50 transition-colors group relative">
                <button onClick={() => removeVaultedArtifact(record.id)} className="absolute top-2 right-2 text-zinc-600 hover:text-[#DB2777] p-2 transition-colors z-10" title="Purge Record">
                  <SafeIcon icon={LuIcons.LuTrash2} className="w-4 h-4" />
                </button>
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-start mb-2 pr-8">
                    <h3 className="text-white font-bold text-sm tracking-wide">{record.title || record.name || record.target || 'UNTITLED ASSET'}</h3>
                    <span className="text-[0.6rem] px-2 py-0.5 bg-axim-purple/20 text-axim-purple uppercase tracking-widest rounded-sm">
                      {record.type || 'DOCUMENT'}
                    </span>
                  </div>
                  <p className="text-zinc-500 text-xs font-mono mb-4 flex items-center gap-2">
                    <SafeIcon icon={LuIcons.LuCalendar} className="w-3 h-3" />
                    {record.timestamp || record.date ? new Date(record.timestamp || record.date).toLocaleDateString() : 'UNKNOWN DATE'}
                  </p>

                  <div className="mt-auto">
                    <button
                      onClick={() => handleExport(record)}
                      className="w-full py-2 bg-transparent border border-white/10 text-zinc-300 text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-colors rounded-sm flex items-center justify-center gap-2"
                    >
                      <SafeIcon icon={LuIcons.LuDownload} className="w-3 h-3" />
                      Export Document
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-zinc-500 text-sm font-mono border border-white/5 p-8 text-center rounded-sm">
            NO CRYPTOGRAPHIC RECORDS FOUND. ACCESS THE TOOLS HUB TO GENERATE NEW ASSETS.
          </div>
        )}
    </>
  );
}
