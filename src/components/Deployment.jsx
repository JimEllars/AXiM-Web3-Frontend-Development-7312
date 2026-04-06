import { motion } from 'framer-motion';
import * as LuIcons from 'react-icons/lu';
import SafeIcon from '../common/SafeIcon';

const { LuArrowRight } = LuIcons;

export default function Deployment() {
  return (
    <section className="py-24 relative z-10">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="section-label">Operational Deployment</span>
            <h2 className="text-[clamp(2rem,4vw,3rem)] font-black uppercase mb-6 tracking-tight">Physical & Virtual Performance</h2>
            <p className="text-zinc-400 text-[1.1rem] mb-10">Bridging the gap between physical infrastructure and digital optimization at scale.</p>

            <div className="space-y-4">
              <div className="p-6 border-l-2 border-subtle hover:border-axim-gold hover:bg-gradient-to-r from-white/5 to-transparent transition-all duration-300">
                <h4 className="text-[1.1rem] font-extrabold uppercase mb-2">AXiM Solar & Smart Grids</h4>
                <p className="text-zinc-400">Utility-scale energy arrays and next-gen residential power designed for operational excellence.</p>
              </div>
              
              <div className="p-6 border-l-2 border-subtle hover:border-axim-gold hover:bg-gradient-to-r from-white/5 to-transparent transition-all duration-300">
                <h4 className="text-[1.1rem] font-extrabold uppercase mb-2">Legal Infrastructure Automation</h4>
                <p className="text-zinc-400">Generate professional demand letters in 12 minutes for $4.00. High-performance Ai fact-extraction with 97.4% precision.</p>
                <a href="https://axim.us.com/axim-demand-letter-generator/" className="text-[0.75rem] text-axim-gold font-bold uppercase mt-3 inline-flex items-center gap-2 hover:gap-3 transition-all">
                  Access Quick Demand Letter <SafeIcon icon={LuArrowRight} className="w-3 h-3" />
                </a>
              </div>
              
              <div className="p-6 border-l-2 border-subtle hover:border-axim-gold hover:bg-gradient-to-r from-white/5 to-transparent transition-all duration-300">
                <h4 className="text-[1.1rem] font-extrabold uppercase mb-2">Neural Media Processing</h4>
                <p className="text-zinc-400">High-fidelity transcription and media indexing for complex communication logs and business intelligence.</p>
              </div>
            </div>

            <div className="mt-12">
              <a href="https://axim.us.com/solutions" className="btn btn-primary text-sm px-8 py-4">Download Strategic Roadmap</a>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="bg-[#080808] p-10 border border-subtle rounded-sm"
          >
            <svg width="100%" height="300" viewBox="0 0 100 100" fill="none" className="stroke-axim-gold stroke-[0.5]">
              <rect x="10" y="10" width="80" height="80" strokeOpacity="0.2" />
              <circle cx="50" cy="50" r="30" className="stroke-axim-purple" strokeDasharray="2 2" />
              <path d="M20 20 L80 80 M80 20 L20 80" className="stroke-axim-teal" strokeOpacity="0.4" />
              <rect x="42" y="42" width="16" height="16" stroke="#fff" strokeWidth="1" />
              <circle cx="50" cy="50" r="3" fill="#FFEA00">
                <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
              </circle>
            </svg>
            <div className="font-mono text-[0.65rem] text-axim-gold mt-5 opacity-50 text-center uppercase tracking-widest">
              REF: AXM_DEPLOYMENT_MODEL_V4.2 // STATUS: ACTIVE
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}