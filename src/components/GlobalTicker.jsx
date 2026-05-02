import React from 'react';
import { motion } from 'framer-motion';
import { useAximStore } from '../store/useAximStore';
import * as LuIcons from 'react-icons/lu';
import SafeIcon from '../common/SafeIcon';

const { LuActivity, LuAlertTriangle, LuCheckCircle, LuDollarSign, LuMegaphone } = LuIcons;

export default function GlobalTicker() {
  const activeTelemetry = useAximStore(state => state.activeTelemetry) || [];

  return (
    <div className="fixed bottom-0 left-0 w-full h-8 bg-black/90 backdrop-blur-md border-t border-white/10 z-[100] flex items-center overflow-hidden">
      <div className="flex-shrink-0 px-4 bg-black/50 border-r border-white/10 h-full flex items-center gap-2 z-10 font-mono text-[0.6rem] uppercase tracking-widest text-zinc-500">
        <SafeIcon icon={LuActivity} className="w-3 h-3 text-axim-purple animate-pulse" />
        <span>Telemetry</span>
      </div>

      <div className="flex-grow flex relative h-full">
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{
            repeat: Infinity,
            ease: "circOut",
            duration: 30
          }}
          className="flex items-center gap-8 px-4 whitespace-nowrap h-full"
        >
          {activeTelemetry.map((item, idx) => {
            let colorClass = 'text-zinc-400';
            let Icon = LuActivity;

            if (item.type === 'revenue') {
              colorClass = 'text-axim-purple';
              Icon = LuDollarSign;
            } else if (item.type === 'heartbeat') {
              colorClass = 'text-axim-gold';
              Icon = LuCheckCircle;
            } else if (item.type === 'error') {
              colorClass = 'text-red-500 animate-pulse';
              Icon = LuAlertTriangle;
            } else if (item.type === 'marketing_loop') {
              colorClass = 'text-axim-purple';
              Icon = LuMegaphone;
            }

            return (
              <div key={`${item.id}-${idx}`} className="flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-wider">
                <SafeIcon icon={Icon} className={`w-3 h-3 ${colorClass}`} />
                <span className={colorClass}>{item.message}</span>
                <span className="w-1 h-1 bg-white/20 rounded-full mx-2"></span>
              </div>
            );
          })}

          {/* Duplicate for seamless loop */}
          {activeTelemetry.map((item, idx) => {
            let colorClass = 'text-zinc-400';
            let Icon = LuActivity;

            if (item.type === 'revenue') {
              colorClass = 'text-axim-purple';
              Icon = LuDollarSign;
            } else if (item.type === 'heartbeat') {
              colorClass = 'text-axim-gold';
              Icon = LuCheckCircle;
            } else if (item.type === 'error') {
              colorClass = 'text-red-500 animate-pulse';
              Icon = LuAlertTriangle;
            } else if (item.type === 'marketing_loop') {
              colorClass = 'text-axim-purple';
              Icon = LuMegaphone;
            }

            return (
              <div key={`dup-${item.id}-${idx}`} className="flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-wider">
                <SafeIcon icon={Icon} className={`w-3 h-3 ${colorClass}`} />
                <span className={colorClass}>{item.message}</span>
                <span className="w-1 h-1 bg-white/20 rounded-full mx-2"></span>
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
