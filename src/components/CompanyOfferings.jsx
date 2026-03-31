import React from 'react';
import { motion } from 'framer-motion';
import * as LuIcons from 'react-icons/lu';
import SafeIcon from '../common/SafeIcon';

const { LuFileText, LuShieldCheck, LuBookOpen, LuDatabase, LuCreditCard, LuBriefcase, LuLibrary, LuGraduationCap } = LuIcons;

export default function CompanyOfferings() {
  const generators = [
    {
      id: "G_DEMAND",
      title: "Demand Letter",
      desc: "Instant legal demand letter generation ($9.00).",
      icon: LuFileText,
      url: "https://axim.us.com/axim-demand-letter-generator/"
    },
    {
      id: "G_NDA",
      title: "NDA Generator",
      desc: "Standard Non-Disclosure Agreements for B2B ops.",
      icon: LuShieldCheck,
      url: "#"
    },
    {
      id: "G_PRIVACY",
      title: "Right to Privacy",
      desc: "Generate Cease and Desist or Privacy notices.",
      icon: LuBriefcase,
      url: "#"
    },
    {
      id: "G_DISPUTE",
      title: "Credit Dispute",
      desc: "Automated Credit Error Dispute Letters.",
      icon: LuCreditCard,
      url: "#"
    },
    {
      id: "G_PAYSTUB",
      title: "Pay Stub",
      desc: "Verifiable Pay Stub Generation Tool.",
      icon: LuDatabase,
      url: "#"
    }
  ];

  const coreLinks = [
    {
      id: "C_ARCHIVE",
      title: "Articles Archive",
      desc: "Access the full library of AXiM Intelligence.",
      icon: LuLibrary,
      url: "https://axim.us.com/category/article/"
    },
    {
      id: "C_COURSES",
      title: "AXiM Courses",
      desc: "Technical training and certification catalog.",
      icon: LuGraduationCap,
      url: "https://axim.us.com/courses/"
    }
  ];

  return (
    <section className="py-24 relative z-10 bg-grid border-y border-subtle">
      <div className="absolute inset-0 bg-axim-green/5 mix-blend-overlay z-0 pointer-events-none"></div>

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="section-label">Core Infrastructure</span>
          <h2 className="section-title !mb-0 text-axim-green">Company Offerings</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {generators.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className="bg-black/60 border border-axim-green/20 p-8 flex flex-col h-full hover:-translate-y-2 hover:bg-black/80 hover:border-axim-green/50 transition duration-300 group shadow-[0_0_15px_rgba(58,170,116,0.05)] hover:shadow-[0_0_20px_rgba(58,170,116,0.15)]"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-axim-green/10 flex items-center justify-center text-axim-green border border-axim-green/30">
                  <SafeIcon icon={item.icon} className="w-6 h-6" />
                </div>
                <div>
                  <span className="font-mono text-[0.6rem] opacity-70 text-axim-green uppercase tracking-wider block">{item.id}</span>
                  <h3 className="text-[1.2rem] font-bold uppercase leading-tight group-hover:text-axim-green transition-colors">{item.title}</h3>
                </div>
              </div>
              <p className="text-zinc-400 text-sm leading-[1.6] flex-grow mb-6">{item.desc}</p>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[0.7rem] font-bold uppercase inline-flex items-center gap-2 text-axim-green/80 group-hover:text-axim-green transition-colors mt-auto border border-axim-green/20 rounded px-4 py-2 w-fit bg-axim-green/5"
              >
                Access Tool
              </a>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {coreLinks.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (generators.length + idx) * 0.1, duration: 0.6 }}
              className="bg-zinc-900 border border-zinc-700 p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between h-full hover:-translate-y-1 hover:border-zinc-500 transition duration-300 group"
            >
              <div className="flex items-center gap-5 mb-6 sm:mb-0">
                <div className="w-14 h-14 rounded bg-zinc-800 flex items-center justify-center text-zinc-300">
                  <SafeIcon icon={item.icon} className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-[1.3rem] font-bold uppercase leading-tight group-hover:text-white transition-colors">{item.title}</h3>
                  <p className="text-zinc-400 text-sm mt-1">{item.desc}</p>
                </div>
              </div>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline whitespace-nowrap !py-2 !px-5 !text-xs"
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
