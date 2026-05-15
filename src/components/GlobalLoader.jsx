import React from 'react';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';

export default function GlobalLoader() {
  return (
    <div className="fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center">
      <div className="absolute inset-0 bg-[radial-gradient(rgba(147,51,234,0.05)_1px,transparent_1px)] [background-size:20px_20px]" />

      <div className="relative z-10 flex flex-col items-center">
        <div className="relative w-16 h-16 flex items-center justify-center mb-6">
          {/* Outer spinning ring */}
          <div className="absolute inset-0 border-2 border-white/5 border-t-axim-purple rounded-full animate-spin" />
          {/* Inner pulsing icon */}
          <SafeIcon icon={LuIcons.LuCpu} className="w-6 h-6 text-axim-purple animate-pulse" />
        </div>

        <div className="font-mono text-[0.65rem] text-axim-purple uppercase tracking-widest animate-pulse flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-axim-purple rounded-full" />
          Initializing Node Connection...
        </div>
      </div>
    </div>
  );
}
