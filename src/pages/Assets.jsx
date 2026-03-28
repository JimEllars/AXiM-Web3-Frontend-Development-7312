import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as LuIcons from 'react-icons/lu';
import SafeIcon from '../common/SafeIcon';

const { LuZap, LuGlobe, LuBuilding2, LuHardDrive, LuAnchor, LuX, LuActivity, LuShieldCheck } = LuIcons;

const assets = [
  { 
    id: "SOL-01", 
    name: "Phoenix Solar Array", 
    location: "Arizona, USA", 
    type: "Energy", 
    status: "Operational", 
    yield: "1.2GW/yr", 
    icon: LuZap, 
    color: "text-axim-gold",
    details: "Primary solar generation node. 1.2M panels deployed across 4,000 acres. Direct uplink to Southwest Grid."
  },
  { 
    id: "FIB-42", 
    name: "Trans-Pacific Trunk", 
    location: "Pacific Basin", 
    type: "Connectivity", 
    status: "Active", 
    yield: "400Tbps", 
    icon: LuGlobe, 
    color: "text-axim-teal",
    details: "Ultra-low latency subsea fiber optic cable connecting Seattle, WA and Tokyo, JP. Protocol layer: AXM-FIBER-V4."
  },
  { 
    id: "STR-09", 
    name: "Neo-Habitat Alpha", 
    location: "Austin, TX", 
    type: "Infrastructure", 
    status: "In-Construction", 
    yield: "250 Units", 
    icon: LuBuilding2, 
    color: "text-axim-purple",
    details: "Experimental 3D-printed residential structure. Featuring integrated AXiM Solar roofing and localized neural data storage."
  },
  { 
    id: "DAT-22", 
    name: "Arctic Edge Node", 
    location: "Svalbard", 
    type: "Intelligence", 
    status: "Operational", 
    yield: "14PB Storage", 
    icon: LuHardDrive, 
    color: "text-axim-green",
    details: "Deep-cold data storage for mission-critical neural weights. Completely air-gapped from public internet."
  }
];

export default function Assets() {
  const [selectedAsset, setSelectedAsset] = useState(null);

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-20 relative z-10">
      <div className="mb-20">
        <span className="section-label">Physical Backbone</span>
        <h1 className="text-6xl font-black uppercase tracking-tighter mb-4">Global Assets</h1>
        <p className="text-zinc-500 max-w-xl font-mono text-xs uppercase tracking-widest">
          Real-time registry of AXiM physical infrastructure and utility-scale deployments.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {assets.map((asset, idx) => (
          <motion.div 
            key={asset.id} 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: idx * 0.1 }}
            onClick={() => setSelectedAsset(asset)}
            className="group bg-glass border border-subtle p-8 hover:border-axim-gold/50 cursor-pointer transition-all relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-axim-gold/5 blur-[60px] translate-x-16 -translate-y-16 group-hover:bg-axim-gold/10 transition-colors" />
            
            <div className="flex justify-between items-start mb-12 relative z-10">
              <div className={`p-4 bg-white/5 border border-white/5 rounded-sm ${asset.color}`}>
                <SafeIcon icon={asset.icon} className="w-8 h-8" />
              </div>
              <div className="text-right">
                <div className="text-[0.6rem] font-mono text-zinc-600 uppercase tracking-widest mb-1">Asset_ID</div>
                <div className="text-sm font-black font-mono">{asset.id}</div>
              </div>
            </div>

            <h3 className="text-2xl font-black uppercase mb-2 relative z-10 group-hover:text-axim-gold transition-colors">{asset.name}</h3>
            <div className="flex items-center gap-2 text-xs text-zinc-500 uppercase tracking-widest mb-8 relative z-10">
              <SafeIcon icon={LuAnchor} className="w-3 h-3" /> {asset.location}
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/5 relative z-10">
              <div>
                <div className="text-[0.5rem] text-zinc-600 uppercase mb-1">Status</div>
                <div className="text-[0.7rem] font-bold text-axim-green uppercase flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-axim-green rounded-full animate-pulse" /> {asset.status}
                </div>
              </div>
              <div>
                <div className="text-[0.5rem] text-zinc-600 uppercase mb-1">Type</div>
                <div className="text-[0.7rem] font-bold uppercase">{asset.type}</div>
              </div>
              <div>
                <div className="text-[0.5rem] text-zinc-600 uppercase mb-1">Yield</div>
                <div className="text-[0.7rem] font-bold font-mono text-white">{asset.yield}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedAsset && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setSelectedAsset(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, y: 20 }} 
              className="w-full max-w-2xl bg-[#080808] border border-white/10 p-12 relative z-10 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-axim-gold" />
              <button 
                onClick={() => setSelectedAsset(null)}
                className="absolute top-8 right-8 text-zinc-500 hover:text-white transition-colors"
              >
                <SafeIcon icon={LuX} className="w-6 h-6" />
              </button>

              <div className="flex items-center gap-6 mb-10">
                <div className={`p-5 bg-white/5 border border-white/5 rounded-sm ${selectedAsset.color}`}>
                  <SafeIcon icon={selectedAsset.icon} className="w-10 h-10" />
                </div>
                <div>
                  <div className="text-xs font-mono text-axim-gold uppercase mb-1">{selectedAsset.id}</div>
                  <h2 className="text-3xl font-black uppercase tracking-tight">{selectedAsset.name}</h2>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <h4 className="text-[0.6rem] font-mono text-zinc-500 uppercase tracking-[0.2em] mb-3">Operational Summary</h4>
                  <p className="text-zinc-300 leading-relaxed text-lg italic">"{selectedAsset.details}"</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="p-6 bg-white/5 border border-white/5">
                    <div className="flex items-center gap-2 text-[0.6rem] font-mono text-zinc-500 uppercase mb-2">
                      <SafeIcon icon={LuActivity} className="text-axim-teal" /> Telemetry Stream
                    </div>
                    <div className="text-xl font-bold text-white">ACTIVE_SYNC</div>
                  </div>
                  <div className="p-6 bg-white/5 border border-white/5">
                    <div className="flex items-center gap-2 text-[0.6rem] font-mono text-zinc-500 uppercase mb-2">
                      <SafeIcon icon={LuShieldCheck} className="text-axim-purple" /> Governance
                    </div>
                    <div className="text-xl font-bold text-white">DEC_2024_REVISION</div>
                  </div>
                </div>

                <button className="w-full py-5 bg-white text-black font-black uppercase text-sm tracking-widest hover:bg-axim-gold transition-colors">
                  Access Real-time Monitoring
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}