import React from 'react';
import { motion } from 'framer-motion';
import * as LuIcons from 'react-icons/lu';
import SafeIcon from '../common/SafeIcon';

const { LuBuilding2, LuDatabase, LuBrainCircuit, LuChevronRight } = LuIcons;

export default function Pillars() {
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  
  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "circOut" } }
  };

  return (
    <section id="axim-solutions" className="py-24 border-t border-subtle relative z-10 bg-[#050505]/50">
      <div className="max-w-[1200px] mx-auto px-6">
        <span className="section-label">The Full Stack</span>
        <h2 className="section-title">Cohesive Operational Ecosystem</h2>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {/* AXiM Built */}
          <motion.div variants={item} className="bg-glass backdrop-blur-xl saturate-150 border border-subtle p-12 flex flex-col h-full transition duration-500 hover:-translate-y-3 hover:bg-glass-hover hover:border-active group">
            <SafeIcon icon={LuBuilding2} size={40} className="text-transparent bg-clip-text bg-gradient-to-tr from-axim-purple to-axim-gold" style={{ display: "inline-block" }} />
            <h3 className="text-[1.75rem] font-extrabold my-6 uppercase">AXiM Built</h3>
            <p className="text-zinc-400 leading-[1.7] flex-grow mb-8">Physical infrastructure for a connected world. From next-gen 3D printed smart-structures to utility solar arrays and nationwide fiber networks.</p>
            <a href="https://axim.us.com/built/" className="font-mono text-[0.8rem] font-bold uppercase inline-flex items-center gap-3 text-axim-gold group-hover:gap-4 transition-all">
              Physical Assets <SafeIcon icon={LuChevronRight} />
            </a>
          </motion.div>

          {/* AXiM Digital */}
          <motion.div variants={item} className="bg-glass backdrop-blur-xl saturate-150 border border-subtle p-12 flex flex-col h-full transition duration-500 hover:-translate-y-3 hover:bg-glass-hover hover:border-active group">
            <SafeIcon icon={LuDatabase} size={40} className="text-transparent bg-clip-text bg-gradient-to-tr from-axim-purple to-axim-gold" style={{ display: "inline-block" }} />
            <h3 className="text-[1.75rem] font-extrabold my-6 uppercase">AXiM Digital</h3>
            <p className="text-zinc-400 leading-[1.7] flex-grow mb-8">The unified data backbone. Centralizing telemetry, proprietary APIs, and legal automation into a secure, single source of operational truth.</p>
            <a href="https://axim.us.com/digital/" className="font-mono text-[0.8rem] font-bold uppercase inline-flex items-center gap-3 text-axim-purple group-hover:gap-4 transition-all">
              Data Layer <SafeIcon icon={LuChevronRight} />
            </a>
          </motion.div>

          {/* AXiM Intelligence */}
          <motion.div variants={item} className="bg-glass backdrop-blur-xl saturate-150 border border-subtle p-12 flex flex-col h-full transition duration-500 hover:-translate-y-3 hover:bg-glass-hover hover:border-active group">
            <SafeIcon icon={LuBrainCircuit} size={40} className="text-transparent bg-clip-text bg-gradient-to-tr from-axim-purple to-axim-gold" style={{ display: "inline-block" }} />
            <h3 className="text-[1.75rem] font-extrabold my-6 uppercase">AXiM Intelligence</h3>
            <p className="text-zinc-400 leading-[1.7] flex-grow mb-8">The orchestrator. We plan and manage strategic growth via AXiM Ai, smart protocols, and high-performance document extraction logic.</p>
            <a href="https://axim.us.com/intelligence/" className="font-mono text-[0.8rem] font-bold uppercase inline-flex items-center gap-3 text-axim-purple group-hover:gap-4 transition-all">
              Autonomous Logic <SafeIcon icon={LuChevronRight} />
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}