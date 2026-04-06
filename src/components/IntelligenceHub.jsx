import React from 'react';
import { motion } from 'framer-motion';
import * as LuIcons from 'react-icons/lu';
import SafeIcon from '../common/SafeIcon';

const { LuArrowRight } = LuIcons;

export default function IntelligenceHub() {
  const briefs = [
    {
      id: "[BRIEF_001]",
      title: "Circular Ecosystems",
      desc: "Re-investing operational yield into autonomous infrastructure growth."
    },
    {
      id: "[SPEC_042]",
      title: "Legal Automation ROI",
      desc: "How AXiM document extraction logic speeds up settlement timelines by 85%."
    },
    {
      id: "[INFRA_009]",
      title: "Grid Resilience",
      desc: "Optimizing commercial solar dispatch via unified data monitoring."
    }
  ];

  return (
    <section className="py-24 relative z-10">
      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="section-label">Digital Hub</span>
          <h2 className="section-title !mb-0">Intelligence Briefs</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {briefs.map((brief, idx) => (
            <motion.div 
              key={brief.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className="bg-glass border border-subtle p-10 flex flex-col h-full hover:-translate-y-2 hover:bg-glass-hover hover:border-active transition duration-300 group"
            >
              <span className="font-mono text-[0.7rem] opacity-50 text-axim-teal mb-4 block">{brief.id}</span>
              <h3 className="text-[1.5rem] font-bold uppercase mb-4">{brief.title}</h3>
              <p className="text-zinc-400 leading-[1.7] flex-grow mb-8">{brief.desc}</p>
              <a href="https://axim.us.com/reports" className="font-mono text-[0.8rem] font-bold uppercase inline-flex items-center gap-3 text-white group-hover:text-axim-gold transition-colors">
                Access Brief <SafeIcon icon={LuArrowRight} />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}