import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';

const { LuZap, LuGlobe, LuCpu } = LuIcons;

// Pre-computed set of keys to exclude from rendering, improving performance during render loop
const EXCLUDED_KEYS = new Set(['id', 'type', 'status', 'icon']);


export default function DashboardNodes({ nodeStatuses, selectedNode, setSelectedNode }) {
  const nodes = [
    {
      id: 'Demand Generator',
      type: 'Micro-App',
      status: nodeStatuses?.demand === 'operational' ? 'Optimal' : 'Degraded',
      metrics: [['Latency', '42ms'], ['Uptime', '99.9%']],
      icon: LuGlobe,
      color: nodeStatuses?.demand === 'operational' ? 'axim-green' : 'red-500'
    },
    {
      id: 'NDA Generator',
      type: 'Micro-App',
      status: nodeStatuses?.nda === 'operational' ? 'Optimal' : 'Degraded',
      metrics: [['Latency', '38ms'], ['Uptime', '99.9%']],
      icon: LuZap,
      color: nodeStatuses?.nda === 'operational' ? 'axim-green' : 'red-500'
    },
    {
      id: 'AXiM Core API',
      type: 'Infrastructure',
      status: nodeStatuses?.core === 'operational' ? 'Optimal' : 'Degraded',
      metrics: [['Throughput', '1.2 Tbps'], ['Uptime', '99.99%']],
      icon: LuCpu,
      color: nodeStatuses?.core === 'operational' ? 'axim-teal' : 'red-500'
    }
  ];

  return (
    <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
      {nodes.map((node) => (
        <motion.div
          key={node.id}
          whileHover={{ y: -5 }}
          onClick={() => setSelectedNode && setSelectedNode(node)}
          className={`cursor-pointer p-8 border transition-all duration-300 ${selectedNode?.id === node.id ? 'bg-axim-gold/10 border-axim-gold shadow-[0_0_30px_rgba(255,234,0,0.1)]' : 'bg-glass backdrop-blur-xl saturate-150 border-subtle hover:border-white/30'}`}
        >
          <div className="flex justify-between items-start mb-6">
            <div className={`p-3 rounded-sm ${selectedNode?.id === node.id ? 'bg-axim-gold text-black' : 'bg-white/5 text-white'}`}>
              <SafeIcon icon={node.icon} className="w-6 h-6" />
            </div>
            <span className={`font-mono text-[0.6rem] flex items-center gap-2 text-${node.color}`}>
              <div className={`w-1.5 h-1.5 rounded-full animate-pulse bg-${node.color}`} /> {node.status.toUpperCase()}
            </span>
          </div>
          <h3 className="text-xl font-bold uppercase mb-1">{node.id}</h3>
          <p className="text-zinc-500 text-xs uppercase tracking-widest mb-4">{node.type}</p>
          <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
            {node.metrics.map(([key, val]) => (
              <div key={key}>
                <div className="text-[0.6rem] text-zinc-600 uppercase mb-1">{key}</div>
                <div className="text-sm font-bold font-mono text-white">{val}</div>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
