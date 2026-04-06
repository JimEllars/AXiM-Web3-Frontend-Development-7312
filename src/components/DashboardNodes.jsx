import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';

const { LuZap, LuGlobe, LuCpu } = LuIcons;

const nodes = [
  { id: 'AX-101', type: 'Solar', status: 'Optimal', load: '72%', temp: '42°C', icon: LuZap },
  { id: 'AX-102', type: 'Fiber', status: 'Optimal', throughput: '1.2 Tbps', icon: LuGlobe },
  { id: 'AX-103', type: 'Neural', status: 'Active', accuracy: '98.2%', icon: LuCpu },
];

// Pre-computed set of keys to exclude from rendering, improving performance during render loop
const EXCLUDED_KEYS = new Set(['id', 'type', 'status', 'icon']);

export default function DashboardNodes({ selectedNode, setSelectedNode }) {
  return (
    <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
      {nodes.map((node) => (
        <motion.div
          key={node.id}
          whileHover={{ y: -5 }}
          onClick={() => setSelectedNode(node)}
          className={`cursor-pointer p-8 border transition-all duration-300 ${selectedNode?.id === node.id ? 'bg-axim-gold/10 border-axim-gold shadow-[0_0_30px_rgba(255,234,0,0.1)]' : 'bg-glass border-subtle hover:border-white/30'}`}
        >
          <div className="flex justify-between items-start mb-6">
            <div className={`p-3 rounded-sm ${selectedNode?.id === node.id ? 'bg-axim-gold text-black' : 'bg-white/5 text-axim-gold'}`}>
              <SafeIcon icon={node.icon} className="w-6 h-6" />
            </div>
            <span className="font-mono text-[0.6rem] text-axim-green flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-axim-green rounded-full animate-pulse" /> ONLINE
            </span>
          </div>
          <h3 className="text-xl font-bold uppercase mb-1">{node.id}</h3>
          <p className="text-zinc-500 text-xs uppercase tracking-widest mb-4">{node.type} Node</p>
          <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
            {Object.entries(node).filter(([key]) => !EXCLUDED_KEYS.has(key)).map(([key, val]) => (
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
