import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function AximTerminal() {
  const [logs, setLogs] = useState([
    "> INITIALIZING_AXM_CORE...",
    "> AUTHENTICATING_UPLINK...",
    "> GRID_SYNC: SUCCESSFUL",
    "> LISTENING_FOR_PACKETS..."
  ]);
  const containerRef = useRef(null);

  useEffect(() => {
    const events = [
      "PACKET_RECEIVED: 0x42...F92",
      "NEURAL_INDEXER: ACTIVE",
      "SOLAR_YIELD: +0.42GW",
      "DISPUTE_RESOLUTION_NODE: IDLE",
      "FIBER_LATENCY: 12ms",
      "ENCRYPTION_LAYER: ARMORED"
    ];

    const interval = setInterval(() => {
      setLogs(prev => [...prev.slice(-12), `> ${events[Math.floor(Math.random() * events.length)]}`]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="bg-black/80 border border-white/5 p-4 font-mono text-[10px] h-48 overflow-y-auto scrollbar-hide" ref={containerRef}>
      <div className="text-axim-gold mb-2 opacity-50 uppercase tracking-widest border-b border-white/5 pb-1">
        System_Logs // Live_Stream
      </div>
      {logs.map((log, i) => (
        <motion.div 
          key={i} 
          initial={{ opacity: 0, x: -5 }} 
          animate={{ opacity: 1, x: 0 }}
          className="text-zinc-500 mb-1"
        >
          <span className="text-axim-green mr-2">[{new Date().toLocaleTimeString()}]</span>
          {log}
        </motion.div>
      ))}
    </div>
  );
}