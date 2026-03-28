import React from 'react';
import { motion } from 'framer-motion';

export default function NetworkTopology() {
  const nodes = [
    { id: 1, x: 50, y: 20, label: 'CORE_ORACLE' },
    { id: 2, x: 20, y: 50, label: 'GRID_NORTH' },
    { id: 3, x: 80, y: 50, label: 'GRID_SOUTH' },
    { id: 4, x: 35, y: 80, label: 'FIBER_HUB_A' },
    { id: 5, x: 65, y: 80, label: 'FIBER_HUB_B' },
  ];

  const connections = [
    [1, 2], [1, 3], [2, 4], [3, 5], [4, 5], [2, 3]
  ];

  return (
    <div className="relative w-full aspect-square max-w-[500px] mx-auto bg-[#080808] border border-subtle p-8 rounded-sm overflow-hidden">
      <div className="absolute top-4 left-4 font-mono text-[10px] text-axim-gold opacity-50 uppercase">
        Live Topology Map // v4.2
      </div>
      
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Connection Lines */}
        {connections.map(([from, to], i) => {
          const start = nodes.find(n => n.id === from);
          const end = nodes.find(n => n.id === to);
          return (
            <motion.line
              key={`line-${i}`}
              x1={start.x} y1={start.y}
              x2={end.x} y2={end.y}
              stroke="rgba(255, 234, 0, 0.2)"
              strokeWidth="0.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => (
          <g key={node.id}>
            <motion.circle
              cx={node.x} cy={node.y} r="2"
              fill="#FFEA00"
              animate={{ r: [2, 3, 2], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <text 
              x={node.x} y={node.y - 4} 
              textAnchor="middle" 
              className="fill-zinc-500 font-mono text-[3px] uppercase tracking-widest"
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>

      <div className="absolute bottom-4 right-4 text-right">
        <div className="text-[10px] font-mono text-axim-green animate-pulse">● UPLINK_SYNCED</div>
        <div className="text-[8px] font-mono text-zinc-600 mt-1 uppercase">Latency: 14ms</div>
      </div>
    </div>
  );
}