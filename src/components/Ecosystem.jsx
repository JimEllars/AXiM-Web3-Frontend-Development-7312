import React from 'react';
import { motion } from 'framer-motion';
import { coreLinks } from '../data/companyOfferings';
import * as LuIcons from 'react-icons/lu';
import SafeIcon from '../common/SafeIcon';

export default function Ecosystem() {
  return (
    <section className="py-16 relative z-10 bg-grid border-t border-subtle">
      <div className="absolute inset-0 bg-axim-gold/5 mix-blend-overlay z-0 pointer-events-none"></div>

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="section-label">Discover</span>
          <h2 className="section-title !mb-0 text-axim-gold">The AXiM Ecosystem</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {coreLinks.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className="bg-zinc-900 border border-zinc-700 p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between h-full hover:-translate-y-1 hover:border-axim-gold/50 transition duration-300 group"
            >
              <div className="flex items-center gap-5 mb-6 sm:mb-0">
                <div className="w-14 h-14 rounded bg-zinc-800 flex items-center justify-center text-zinc-300 group-hover:text-axim-gold transition-colors">
                  <SafeIcon icon={LuIcons[item.iconName]} className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-[1.3rem] font-bold uppercase leading-tight text-white group-hover:text-axim-gold transition-colors">{item.title}</h3>
                  <p className="text-zinc-400 text-sm mt-1">{item.desc}</p>
                </div>
              </div>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline whitespace-nowrap !py-2 !px-5 !text-xs group-hover:border-axim-gold group-hover:text-axim-gold"
              >
                Open Catalog
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
