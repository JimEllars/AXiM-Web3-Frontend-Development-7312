import React from 'react';
import * as LuIcons from 'react-icons/lu';
import SafeIcon from '../common/SafeIcon';

const { LuUser } = LuIcons;

export default function ProfileCard({ address, clearanceLevel }) {
  return (
    <div className="bg-glass border border-subtle p-8 text-center">
      <div className="w-24 h-24 bg-axim-gold/10 border border-axim-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
        <SafeIcon icon={LuUser} className="w-10 h-10 text-axim-gold" />
      </div>
      <h2 className="font-black uppercase tracking-tight text-xl mb-1">Operator</h2>
      <p className="font-mono text-[0.65rem] text-zinc-500 uppercase truncate mb-6">{address}</p>
      <div className="inline-block px-4 py-1.5 bg-axim-purple text-[0.6rem] font-black rounded-sm border border-axim-purple/30">
        CLEARANCE_LEVEL_{clearanceLevel || 1}
      </div>
    </div>
  );
}