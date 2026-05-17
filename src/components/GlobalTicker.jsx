import React from 'react';
import Marquee from './Marquee';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';

export default function GlobalTicker() {
  return (
    <div className="w-full bg-[#050505] border-b border-white/10 py-1.5 relative z-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 flex items-center">
        {/* Static Indicator */}
        <div className="hidden md:flex items-center gap-2 mr-4 pr-4 border-r border-white/10 shrink-0">
          <div className="w-1.5 h-1.5 bg-axim-green rounded-full animate-pulse shadow-[0_0_8px_rgba(0,255,0,0.8)]" />
          <span className="text-[0.6rem] font-mono text-zinc-400 uppercase tracking-widest">Global Network</span>
        </div>

        {/* Scrolling Telemetry */}
        <div className="flex-1 overflow-hidden opacity-80 hover:opacity-100 transition-opacity">
          <Marquee speed={30}>
            <div className="flex space-x-12 items-center text-[0.6rem] font-mono uppercase tracking-widest text-zinc-500">
              <span className="flex items-center gap-2"><SafeIcon icon={LuIcons.LuActivity} className="text-axim-green w-3 h-3"/> UPTIME: 99.999%</span>
              <span className="flex items-center gap-2"><SafeIcon icon={LuIcons.LuGlobe} className="text-axim-purple w-3 h-3"/> ACTIVE EDGE NODES: 142</span>
              <span className="flex items-center gap-2"><SafeIcon icon={LuIcons.LuShieldCheck} className="text-axim-green w-3 h-3"/> ENCRYPTION: AES-256</span>
              <span className="flex items-center gap-2"><SafeIcon icon={LuIcons.LuZap} className="text-axim-gold w-3 h-3"/> LATENCY: &lt; 12ms</span>
              <span className="flex items-center gap-2"><SafeIcon icon={LuIcons.LuCpu} className="text-axim-purple w-3 h-3"/> LOAD BALANCING: OPTIMAL</span>
            </div>
          </Marquee>
        </div>
      </div>
    </div>
  );
}
