import React from 'react';
import * as LuIcons from 'react-icons/lu';
import SafeIcon from '../common/SafeIcon';

const { LuCpu, LuScale, LuZap, LuDatabase, LuAntenna, LuShieldCheck, LuMic } = LuIcons;

export default function Marquee() {
  const items = [
    { icon: LuCpu, text: "AXiM Ai" },
    { icon: LuScale, text: "Legal Automation" },
    { icon: LuZap, text: "Smart Grids" },
    { icon: LuDatabase, text: "Core Data" },
    { icon: LuAntenna, text: "Fiber Systems" },
    { icon: LuShieldCheck, text: "Smart Protocols" },
    { icon: LuMic, text: "Neural Transcription" },
  ];

  return (
    <div className="bg-[#080808] border-y border-subtle py-8 overflow-hidden flex relative z-10 w-full">
      <div className="animate-marquee flex w-max">
        {[...items, ...items, ...items].map((item, index) => (
          <div key={index} className="flex items-center gap-3 mr-[60px] font-mono text-[0.8rem] text-zinc-400 uppercase tracking-[1px] whitespace-nowrap">
            <SafeIcon icon={item.icon} className="text-axim-gold/70" /> {item.text}
          </div>
        ))}
      </div>
    </div>
  );
}