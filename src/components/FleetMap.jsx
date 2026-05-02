import React from 'react';
import { useAximStore } from '../store/useAximStore';
import { motion } from 'framer-motion';

export default function FleetMap() {
  const nodeStatuses = useAximStore((state) => state.nodeStatuses);

  const nodes = [
    { id: 'core', cx: 500, cy: 300, label: 'AXiM Core' },
    { id: 'ny', cx: 250, cy: 220, label: 'New York Node' },
    { id: 'lon', cx: 520, cy: 180, label: 'London Node' },
    { id: 'tok', cx: 850, cy: 250, label: 'Tokyo Node' },
  ];

  return (
    <div className="w-full flex justify-center p-4 bg-[#050505]">
      <svg viewBox="0 0 1000 500" className="w-full h-auto border border-axim-purple/30 bg-[#050505]/50 rounded-sm">
        {/* World Map SVG Path (Simplified) */}
        <path
          d="M 150 100 Q 200 50 300 120 T 450 100 T 550 150 T 650 80 T 800 120 T 900 200 T 800 350 T 600 450 T 400 400 T 250 450 T 100 300 Z M 500 200 Q 550 180 600 220 T 650 300 T 550 350 T 450 280 Z"
          fill="rgba(125, 0, 255, 0.05)"
          stroke="rgba(125, 0, 255, 0.3)"
          strokeWidth="1"
        />

        {/* Connections */}
        {nodes.map(node => {
          if (node.id === 'core') return null;
          return (
            <line
              key={`line-${node.id}`}
              x1="500"
              y1="300"
              x2={node.cx}
              y2={node.cy}
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="1"
            />
          );
        })}

        {/* Nodes and Pulses */}
        {nodes.map(node => {
          const status = nodeStatuses?.[node.id] || 'offline';
          let pulseColor = 'rgba(240, 255, 0, 0.8)'; // Electric Yellow
          let dotColor = '#F0FF00';

          if (node.id === 'core') {
            pulseColor = 'rgba(255, 234, 0, 0.8)';
            dotColor = '#FFEA00';
          } else if (status === 'degraded') {
            pulseColor = 'rgba(255, 165, 0, 0.8)';
            dotColor = '#FFA500';
          } else if (status === 'offline') {
            pulseColor = 'rgba(255, 50, 50, 0.4)';
            dotColor = '#FF3232';
          }

          return (
            <g key={node.id}>
              {/* Pulse */}
              <motion.circle
                cx={node.cx}
                cy={node.cy}
                r={node.id === 'core' ? 12 : 8}
                fill={pulseColor}
                animate={{
                  scale: [1, 2.5, 1],
                  opacity: [0.8, 0, 0.8]
                }}
                transition={{ duration: 0.4, ease: "circOut",
                  delay: node.id === 'core' ? 0 : Math.random() * 2,
                  repeat: Infinity,
                }}
              />

              {/* Dot */}
              <circle
                cx={node.cx}
                cy={node.cy}
                r={node.id === 'core' ? 8 : 5}
                fill={dotColor}
                style={{ filter: `drop-shadow(0 0 10px ${dotColor})` }}
              />

              {/* Label */}
              <text
                x={node.cx}
                y={node.cy + (node.id === 'core' ? 25 : 20)}
                fill="rgba(255, 255, 255, 0.6)"
                fontSize="12"
                fontFamily="monospace"
                textAnchor="middle"
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
