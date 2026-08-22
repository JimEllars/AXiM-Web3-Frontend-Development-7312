import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { logTelemetry } from '../lib/telemetry';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';

export default function HubNavigator({ title = "Explore Core Hubs" }) {
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "circOut" } }
  };

  return (
    <section className="py-16 relative z-10 w-full">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <h3 className="text-xl font-black uppercase tracking-tighter text-white mb-8 border-b border-white/10 pb-4">{title}</h3>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Business Development Hub */}
          <motion.div variants={item} className="h-full">
            <Link
              to="/business"
              onClick={() => logTelemetry('hub_navigator_clicked', { target: 'business' })}
              className="bg-[#050505] border border-white/10 p-8 flex flex-col h-full transition duration-300 hover:border-axim-gold/50 hover:bg-white/5 group rounded-sm shadow-xl"
            >
              <div className="w-12 h-12 bg-axim-gold/10 flex items-center justify-center rounded-sm mb-6 group-hover:bg-axim-gold/20 transition-colors">
                 <SafeIcon icon={LuIcons.LuBriefcase} className="w-6 h-6 text-axim-gold" />
              </div>
              <h4 className="text-lg font-black uppercase tracking-widest text-white mb-4 group-hover:text-axim-gold transition-colors">Business Hub</h4>
              <p className="text-xs font-mono text-zinc-400 leading-relaxed flex-grow mb-6">
                Scale your enterprise. Explore automation, CRM integration, and strategic operational systems.
              </p>
              <div className="font-mono text-[0.65rem] font-bold uppercase inline-flex items-center gap-2 text-axim-gold group-hover:gap-3 transition-all">
                Enter Business Hub <SafeIcon icon={LuIcons.LuArrowRight} className="w-3 h-3" />
              </div>
            </Link>
          </motion.div>

          {/* Personal Development Hub */}
          <motion.div variants={item} className="h-full">
             <Link
              to="/personal"
              onClick={() => logTelemetry('hub_navigator_clicked', { target: 'personal' })}
              className="bg-[#050505] border border-white/10 p-8 flex flex-col h-full transition duration-300 hover:border-emerald-500/50 hover:bg-white/5 group rounded-sm shadow-xl"
            >
              <div className="w-12 h-12 bg-emerald-500/10 flex items-center justify-center rounded-sm mb-6 group-hover:bg-emerald-500/20 transition-colors">
                 <SafeIcon icon={LuIcons.LuUser} className="w-6 h-6 text-emerald-400" />
              </div>
              <h4 className="text-lg font-black uppercase tracking-widest text-white mb-4 group-hover:text-emerald-400 transition-colors">Personal Hub</h4>
              <p className="text-xs font-mono text-zinc-400 leading-relaxed flex-grow mb-6">
                Optimize individual output. Discover high-leverage habits, productivity tools, and cognitive strategies.
              </p>
              <div className="font-mono text-[0.65rem] font-bold uppercase inline-flex items-center gap-2 text-emerald-400 group-hover:gap-3 transition-all">
                Enter Personal Hub <SafeIcon icon={LuIcons.LuArrowRight} className="w-3 h-3" />
              </div>
            </Link>
          </motion.div>

          {/* Tech Development Hub */}
          <motion.div variants={item} className="h-full">
            <Link
              to="/tech"
              onClick={() => logTelemetry('hub_navigator_clicked', { target: 'tech' })}
              className="bg-[#050505] border border-white/10 p-8 flex flex-col h-full transition duration-300 hover:border-axim-purple/50 hover:bg-white/5 group rounded-sm shadow-xl"
            >
              <div className="w-12 h-12 bg-axim-purple/10 flex items-center justify-center rounded-sm mb-6 group-hover:bg-axim-purple/20 transition-colors">
                 <SafeIcon icon={LuIcons.LuCpu} className="w-6 h-6 text-axim-purple" />
              </div>
              <h4 className="text-lg font-black uppercase tracking-widest text-white mb-4 group-hover:text-axim-purple transition-colors">Tech Hub</h4>
              <p className="text-xs font-mono text-zinc-400 leading-relaxed flex-grow mb-6">
                Access the infrastructure. Cloudflare Edge Compute, Web3 Integrations, and Autonomous Agents.
              </p>
              <div className="font-mono text-[0.65rem] font-bold uppercase inline-flex items-center gap-2 text-axim-purple group-hover:gap-3 transition-all">
                Enter Tech Hub <SafeIcon icon={LuIcons.LuArrowRight} className="w-3 h-3" />
              </div>
            </Link>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
