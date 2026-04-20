import React from 'react';
import SEO from '../components/SEO';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';
import { motion } from 'framer-motion';

const { LuBuilding2, LuActivity, LuArrowRight, LuHardDrive } = LuIcons;

const mockAssets = [
  {
    id: 'RWA-PHX',
    title: 'Phoenix Solar Array',
    location: 'Arizona, USA',
    status: 'Operational',
    yield: '8.4% APY',
    tokenPrice: '$500.00',
    icon: LuActivity
  },
  {
    id: 'RWA-TX',
    title: 'Texas Fiber Node',
    location: 'Texas, USA',
    status: 'Maintenance',
    yield: '11.2% APY',
    tokenPrice: '$1,200.00',
    icon: LuHardDrive
  }
];

export default function Assets() {
  return (
    <div className="max-w-[1200px] mx-auto px-6 py-20 relative z-10">
      <SEO title="Real World Assets" description="Tokenized infrastructure and fractionalized RWA." />

      <div className="mb-12">
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-2 flex items-center gap-3">
          <SafeIcon icon={LuBuilding2} className="text-axim-gold" />
          Real World Assets
        </h1>
        <p className="text-zinc-500 text-sm">Fractionalized tokenization of physical infrastructure.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {mockAssets.map((asset, idx) => (
          <motion.div
            key={asset.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
            className="group bg-glass backdrop-blur-xl saturate-150 border border-subtle p-8 hover:border-axim-gold/50 cursor-pointer transition-all relative overflow-hidden flex flex-col"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-axim-gold/5 blur-[60px] translate-x-16 -translate-y-16 group-hover:bg-axim-gold/10 transition-colors pointer-events-none" />

            <div className="flex justify-between items-start mb-8 relative z-10">
              <div className="p-4 bg-white/5 border border-white/5 rounded-sm text-axim-gold">
                <SafeIcon icon={asset.icon} className="w-8 h-8" />
              </div>
              <div className="text-right flex items-center gap-3">
                <span className={`px-3 py-1 bg-white/5 border border-white/10 text-[0.6rem] font-mono uppercase tracking-widest ${asset.status === 'Operational' ? 'text-axim-green' : 'text-axim-gold'}`}>
                  {asset.status}
                </span>
              </div>
            </div>

            <h3 className="text-2xl font-black uppercase mb-2 relative z-10 group-hover:text-axim-gold transition-colors">{asset.title}</h3>
            <p className="text-zinc-400 text-sm font-mono mb-8 relative z-10 flex-grow">
              Location: {asset.location}
            </p>

            <div className="flex justify-between items-end border-t border-white/10 pt-4 mb-6">
               <div>
                  <div className="text-[0.6rem] font-mono text-zinc-500 uppercase tracking-widest mb-1">Target Yield</div>
                  <div className="text-lg font-bold text-white">{asset.yield}</div>
               </div>
               <div className="text-right">
                  <div className="text-[0.6rem] font-mono text-zinc-500 uppercase tracking-widest mb-1">Token Price</div>
                  <div className="text-lg font-bold text-white">{asset.tokenPrice}</div>
               </div>
            </div>

            <button className="w-full py-3 border border-axim-gold/30 text-axim-gold font-bold uppercase text-xs tracking-widest group-hover:bg-axim-gold group-hover:text-black transition-colors flex items-center justify-center gap-2 relative z-10">
              View Asset Data <SafeIcon icon={LuArrowRight} />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
