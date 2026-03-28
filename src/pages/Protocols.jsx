import React from 'react';
import { motion } from 'framer-motion';
import GovernanceVote from '../components/GovernanceVote';
import * as LuIcons from 'react-icons/lu';
import SafeIcon from '../common/SafeIcon';

const { LuShieldCheck, LuGavel, LuCode, LuLock } = LuIcons;

const protocols = [
  {
    title: "AXM-01: Resource Allocation",
    desc: "Autonomous distribution of operational surplus into new infrastructure projects.",
    status: "ENFORCED",
    icon: LuShieldCheck
  },
  {
    title: "AXM-02: Dispute Resolution",
    desc: "Machine-assisted arbitration for smart contract failures and service-level violations.",
    status: "ACTIVE",
    icon: LuGavel
  },
  {
    title: "AXM-03: Data Sovereignty",
    desc: "Encryption standards for all telemetry moving through AXiM Fiber trunks.",
    status: "ENFORCED",
    icon: LuLock
  }
];

const activeProposal = {
  title: "AXM-04: Expansion into Orbital Connectivity",
  desc: "Allocate 12.5% of Q4 yield to Low Earth Orbit satellite infrastructure."
};

export default function Protocols() {
  return (
    <div className="max-w-[1200px] mx-auto px-6 py-20 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-7">
          <div className="mb-20">
            <span className="section-label">Governance Logic</span>
            <h1 className="text-6xl font-black uppercase tracking-tighter mb-6">Smart Protocols</h1>
            <p className="text-zinc-500 max-w-2xl text-lg leading-relaxed mb-12">
              The code is the law. AXiM protocols ensure transparent, autonomous, and immutable management of our physical and digital ecosystem.
            </p>
          </div>

          <div className="space-y-6">
            {protocols.map((protocol, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col md:flex-row items-center gap-8 p-8 bg-glass border border-subtle hover:bg-white/5 transition-colors group"
              >
                <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center bg-axim-gold/10 text-axim-gold border border-axim-gold/20">
                  <SafeIcon icon={protocol.icon} className="w-8 h-8" />
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl font-bold uppercase mb-2 group-hover:text-axim-gold transition-colors">
                    {protocol.title}
                  </h3>
                  <p className="text-zinc-400 text-sm">{protocol.desc}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="px-4 py-1 bg-axim-green/10 text-axim-green text-[0.6rem] font-mono font-black border border-axim-green/30 rounded">
                    {protocol.status}
                  </span>
                  <button className="text-[0.6rem] font-mono text-zinc-600 hover:text-white uppercase tracking-widest flex items-center gap-2">
                    <SafeIcon icon={LuCode} className="w-3 h-3" /> View Source
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="sticky top-32">
            <div className="mb-8">
              <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-6">Consensus Engine</h3>
              <GovernanceVote proposal={activeProposal} />
            </div>
            
            <div className="p-8 border border-white/5 bg-glass">
              <h4 className="text-xs font-bold uppercase tracking-widest mb-4">Governance History</h4>
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex justify-between items-center text-[0.65rem] font-mono py-2 border-b border-white/5 last:border-0 text-zinc-500">
                    <span>AXM-00{i}_REVISION</span>
                    <span className="text-axim-green">PASSED</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}