import React, { useEffect, useState } from 'react';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';
import { useAximStore } from '../store/useAximStore';

const { LuLock } = LuIcons;

export default function VaultedRecords() {
  const vaultedArtifacts = useAximStore((state) => state.vaultedArtifacts);
  const removeAction = useAximStore((state) => state.removeAction);
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
        ) : vaultedArtifacts && vaultedArtifacts.length > 0 ? (
          <div className="space-y-2">
            {vaultedArtifacts.map((record) => (
              <div key={record.id} className="group relative p-4 mb-3 bg-[#050505] border border-white/5 hover:border-axim-purple/40 rounded-sm flex items-center justify-between transition-colors overflow-hidden">
          <div className="absolute left-0 top-0 w-1 h-full bg-zinc-800 group-hover:bg-axim-purple transition-colors" />

          <div className="flex items-center gap-4 pl-3">
             <div className="w-10 h-10 bg-white/5 border border-white/10 rounded flex items-center justify-center shrink-0">
               <SafeIcon icon={LuIcons.LuFileCode2} className="w-5 h-5 text-axim-purple" />
             </div>
             <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-1">{record.name || record.target}</h4>
                <div className="flex items-center gap-3">
                  <span className="text-[0.6rem] font-mono text-zinc-500 uppercase tracking-widest">{new Date(record.timestamp || record.date).toLocaleDateString()}</span>
                  <span className="text-[0.55rem] font-mono text-axim-gold uppercase tracking-widest px-2 py-0.5 bg-axim-gold/10 border border-axim-gold/20 rounded">Pending Parse</span>
                </div>
             </div>
          </div>

          <button onClick={() => removeAction(record.id)} className="text-zinc-600 hover:text-[#DB2777] p-2 transition-colors" title="Purge Record">
             <SafeIcon icon={LuIcons.LuTrash2} className="w-4 h-4" />
          </button>
        </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 border border-dashed border-white/10 flex flex-col items-center justify-center text-zinc-600 py-12">
            <SafeIcon icon={LuLock} className="w-10 h-10 mb-4 opacity-30" />
            <span className="text-[0.6rem] uppercase tracking-[0.3em] font-mono text-zinc-500">Registry_Empty // No_Records</span>
          </div>
        )}
    </>
  );
}
