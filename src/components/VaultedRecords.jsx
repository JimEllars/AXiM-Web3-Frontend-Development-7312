import React from 'react';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';

const { LuClock, LuExternalLink, LuLock } = LuIcons;

export default function VaultedRecords({ fetching, recentLetters }) {
  return (
    <div className="bg-glass border border-subtle p-8 overflow-hidden relative font-mono">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-black uppercase flex items-center gap-3">
          Vaulted Records
        </h3>
        <button className="text-[0.6rem] text-axim-gold hover:text-white uppercase tracking-widest flex items-center gap-2">
          Export Registry <SafeIcon icon={LuExternalLink} className="w-3 h-3" />
        </button>
      </div>
      <div className="space-y-2">
        <div className="text-[0.6rem] text-zinc-600 flex justify-between uppercase mb-4 pb-2 border-b border-white/5">
          <span>Document_ID</span>
          <span>Recipient</span>
          <span>Status</span>
        </div>
        {fetching ? (
          <div className="text-center py-12 opacity-20 animate-pulse uppercase text-[0.6rem]">Querying_Blockchain_Registry...</div>
        ) : recentLetters.length > 0 ? (
          recentLetters.map((letter) => (
            <div key={letter.id} className="group flex justify-between items-center text-[0.7rem] py-4 px-4 bg-white/5 border border-white/5 hover:border-axim-gold/30 transition-all cursor-pointer">
              <div className="flex items-center gap-3">
                <SafeIcon icon={LuClock} className="text-zinc-600 group-hover:text-axim-gold transition-colors" />
                <span className="text-white font-bold">{letter.id.startsWith('AXM-') ? letter.id : `#AXM-${letter.id.slice(0, 5).toUpperCase()}`}</span>
              </div>
              <span className="text-zinc-400 capitalize">{letter.recipient}</span>
              <span className={`flex items-center gap-2 font-black ${letter.status === 'draft' ? 'text-axim-gold' : 'text-axim-green'}`}>
                {letter.status.toUpperCase()}
              </span>
            </div>
          ))
        ) : (
          <div className="py-16 border border-dashed border-white/5 flex flex-col items-center justify-center text-zinc-800">
            <SafeIcon icon={LuLock} className="w-10 h-10 mb-4 opacity-10" />
            <span className="text-[0.6rem] uppercase tracking-[0.3em]">Registry_Empty // No_Records</span>
          </div>
        )}
        <div className="pt-8 text-center text-zinc-800 text-[0.6rem] uppercase tracking-widest border-t border-white/5 mt-4">
          SECURE_END_OF_FILE
        </div>
      </div>
    </div>
  );
}
