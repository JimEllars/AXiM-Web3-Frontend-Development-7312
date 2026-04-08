import React from 'react';
import { motion } from 'framer-motion';
import * as LuIcons from 'react-icons/lu';
import SafeIcon from '../common/SafeIcon';
import { coreLinks } from '../data/companyOfferings';
import { ensureSafeProtocol } from '../lib/sanitize';

const { LuArrowRight } = LuIcons;

export default function More() {
  return (
    <div className="max-w-[1200px] mx-auto px-6 py-20 relative z-10">
      <div className="mb-20">
        <span className="section-label">Ecosystem Explorer</span>
        <h1 className="text-6xl font-black uppercase tracking-tighter mb-6">More AXiM Branches</h1>
        <p className="text-zinc-500 max-w-2xl text-lg leading-relaxed mb-12">
          Discover auxiliary branches, portals, and deeper layers of the AXiM infrastructure that are not pinned to the primary navigation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {coreLinks.map((link, idx) => (
          <motion.div
            key={link.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
            className="group bg-glass border border-subtle p-8 hover:border-axim-gold/50 cursor-pointer transition-all relative overflow-hidden flex flex-col h-full"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-axim-gold/5 blur-[60px] translate-x-16 -translate-y-16 group-hover:bg-axim-gold/10 transition-colors pointer-events-none" />

            <div className="flex items-center gap-6 mb-8 relative z-10">
              <div className="w-16 h-16 rounded bg-white/5 flex items-center justify-center text-zinc-300 group-hover:text-axim-gold border border-white/5 transition-colors">
                <SafeIcon icon={LuIcons[link.iconName] || LuIcons.LuLink} className="w-8 h-8" />
              </div>
              <div>
                <span className="font-mono text-[0.65rem] font-bold text-zinc-500 uppercase tracking-wider block mb-1">AXiM Core Branch</span>
                <h3 className="text-2xl font-black uppercase leading-tight text-white group-hover:text-axim-gold transition-colors">{link.title}</h3>
              </div>
            </div>

            <p className="text-zinc-400 text-sm leading-relaxed mb-8 relative z-10 flex-grow">
              {link.desc}
            </p>

            <a
              href={ensureSafeProtocol(link.url)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 mt-auto bg-white/5 border border-white/10 text-white font-bold uppercase text-xs tracking-widest group-hover:bg-axim-gold group-hover:text-black group-hover:border-axim-gold transition-colors flex items-center justify-center gap-2 relative z-10"
            >
              Access Branch <SafeIcon icon={LuArrowRight} />
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
