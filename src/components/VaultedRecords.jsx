import React, { useEffect, useState } from 'react';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';
import { useAximStore } from '../store/useAximStore';

const { LuClock, LuExternalLink, LuLock, LuDownload, LuEye, LuFileText, LuFileSpreadsheet, LuFileKey } = LuIcons;

export default function VaultedRecords() {
  const vaultedArtifacts = useAximStore((state) => state.vaultedArtifacts);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFetching(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleDownload = (recordName) => {
    // Simulate a download by opening a blank blob
    const blob = new Blob(["Simulated content for " + recordName], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const handlePreview = (recordName) => {
    window.open('about:blank', '_blank');
  };

  const getIconForType = (type) => {
    switch (type) {
      case 'csv': return LuFileSpreadsheet;
      case 'enc': return LuFileKey;
      default: return LuFileText;
    }
  };

  return (
    <div className="bg-black/40 backdrop-blur-xl saturate-150 border border-white/10 p-8 overflow-hidden relative font-mono h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-black uppercase flex items-center gap-3 text-white">
          Vaulted Records
        </h3>
        <button className="text-[0.6rem] text-axim-gold hover:text-white uppercase tracking-widest flex items-center gap-2 transition-colors">
          Export Registry <SafeIcon icon={LuExternalLink} className="w-3 h-3" />
        </button>
      </div>

      <div className="flex-1 flex flex-col min-h-[300px]">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 text-[0.6rem] text-zinc-500 uppercase tracking-widest mb-4 pb-2 border-b border-white/5 px-4">
          <div className="col-span-6">Artifact_Name</div>
          <div className="col-span-2 text-center">Size</div>
          <div className="col-span-2 text-center">Status</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {/* Table Body */}
        {fetching ? (
          <div className="flex-1 flex items-center justify-center opacity-30 animate-pulse flex-col gap-4">
            <SafeIcon icon={LuLock} className="w-8 h-8 text-axim-teal" />
            <div className="uppercase text-[0.6rem] text-white tracking-widest">Querying_Secure_Vault...</div>
          </div>
        ) : vaultedArtifacts && vaultedArtifacts.length > 0 ? (
          <div className="space-y-2">
            {vaultedArtifacts.map((record) => (
              <div
                key={record.id}
                className="group grid grid-cols-12 gap-4 items-center text-[0.7rem] py-3 px-4 bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all rounded-sm"
              >
                {/* Artifact Name & Icon */}
                <div className="col-span-6 flex items-center gap-3 overflow-hidden">
                  <SafeIcon
                    icon={getIconForType(record.type)}
                    className="text-axim-teal w-4 h-4 shrink-0 group-hover:scale-110 transition-transform"
                  />
                  <span className="text-white font-bold truncate tracking-wide">{record.name}</span>
                </div>

                {/* Size */}
                <div className="col-span-2 text-zinc-400 text-center font-mono">
                  {record.size}
                </div>

                {/* Status */}
                <div className="col-span-2 text-center">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[0.6rem] font-bold uppercase tracking-wider ${
                    record.status === 'Verified' ? 'bg-axim-teal/10 text-axim-teal border border-axim-teal/20' :
                    record.status === 'Encrypted' ? 'bg-axim-purple/10 text-axim-purple border border-axim-purple/20' :
                    'bg-zinc-800 text-zinc-400 border border-zinc-700'
                  }`}>
                    {record.status}
                  </span>
                </div>

                {/* Actions */}
                <div className="col-span-2 flex items-center justify-end gap-3 opacity-50 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handlePreview(record.name)}
                    className="text-zinc-400 hover:text-white transition-colors"
                    title="View Asset"
                  >
                    <SafeIcon icon={LuExternalLink} className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDownload(record.name)}
                    className="text-axim-teal hover:text-white transition-colors"
                    title="Download Asset"
                  >
                    <SafeIcon icon={LuDownload} className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 border border-dashed border-white/5 flex flex-col items-center justify-center text-zinc-600">
            <SafeIcon icon={LuLock} className="w-10 h-10 mb-4 opacity-30" />
            <span className="text-[0.6rem] uppercase tracking-[0.3em] text-zinc-500">Registry_Empty // No_Records</span>
          </div>
        )}
      </div>

      <div className="pt-8 text-center text-zinc-600 text-[0.6rem] uppercase tracking-widest border-t border-white/5 mt-auto">
        SECURE_END_OF_FILE
      </div>
    </div>
  );
}
