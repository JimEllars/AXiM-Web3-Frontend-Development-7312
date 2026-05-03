import React from 'react';
import { useAximStore } from '../store/useAximStore';
import * as LuIcons from 'react-icons/lu';
import SafeIcon from '../common/SafeIcon';

export default function GlobalTicker() {
  const telemetryStatus = useAximStore((state) => state.telemetryStatus);

  return (
    <div className="w-full bg-black border-b border-white/10 px-4 py-1.5 flex items-center justify-between text-[0.6rem] font-mono uppercase tracking-widest z-50 relative">
      <div className="flex items-center gap-4">
        <span className="text-zinc-500 font-bold">AXiM // CORE v1.2</span>
        {telemetryStatus === 'LOCAL_BUFFER' ? (
          <span className="text-axim-gold flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-axim-gold rounded-full animate-pulse" />
            [LOCAL_BUFFER_ACTIVE] // AUTONOMOUS_MODE
          </span>
        ) : (
          <span className="text-axim-purple flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-axim-purple rounded-full animate-pulse" />
            SECURE_UPLINK_STABLE
          </span>
        )}
      </div>
      <div className="text-zinc-600 hidden md:block">
        SESSION_ENCRYPTED // {new Date().toISOString().split('T')[0]}
      </div>
    </div>
  );
}
