import * as LuIcons from 'react-icons/lu';
import SafeIcon from '../common/SafeIcon';
import React, { useRef, useEffect, useState } from 'react';

const { LuCpu, LuScale, LuZap, LuDatabase, LuAntenna, LuShieldCheck, LuMic } = LuIcons;

const BASE_ITEMS = [
  { icon: LuCpu, text: "AXiM Ai" },
  { icon: LuScale, text: "Legal Automation" },
  { icon: LuZap, text: "Smart Grids" },
  { icon: LuDatabase, text: "Core Data" },
  { icon: LuAntenna, text: "Fiber Systems" },
  { icon: LuShieldCheck, text: "Smart Protocols" },
  { icon: LuMic, text: "Neural Transcription" },
];

const MARQUEE_ITEMS = [...BASE_ITEMS, ...BASE_ITEMS, ...BASE_ITEMS];

export default function Marquee({ children, speed = 30 }) {
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const [contentWidth, setContentWidth] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setContentWidth(contentRef.current.offsetWidth);
    }
  }, [children]);

  // If children are provided, render the custom content
  if (children) {
    const animationStyle = {
      animation: `marquee ${speed}s linear infinite`,
      minWidth: '200%' // Ensure we have enough width for seamless loop
    };

    // We render the children twice to create a seamless loop
    return (
      <div className="overflow-hidden flex w-full relative group">
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes marquee {
              0% { transform: translateX(0%); }
              100% { transform: translateX(-50%); }
            }
          `
        }} />
        <div
          className="flex w-max will-change-transform"
          style={animationStyle}
        >
          <div ref={contentRef} className="flex">
             {children}
          </div>
          <div className="flex">
             {children}
          </div>
        </div>
      </div>
    );
  }

  // Original default behavior
  return (
    <div className="bg-[#080808] border-y border-subtle py-8 overflow-hidden flex relative z-10 w-full">
      <div className="animate-marquee flex w-max">
        {MARQUEE_ITEMS.map((item, index) => (
          <div key={index} className="flex items-center gap-3 mr-[60px] font-mono text-[0.8rem] text-zinc-400 uppercase tracking-[1px] whitespace-nowrap">
            <SafeIcon icon={item.icon} className="text-axim-gold/70" /> {item.text}
          </div>
        ))}
      </div>
    </div>
  );
}
