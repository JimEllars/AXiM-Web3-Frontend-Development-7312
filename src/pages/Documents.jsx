import { motion } from 'framer-motion';
import * as LuIcons from 'react-icons/lu';
import SafeIcon from '../common/SafeIcon';
import { generators } from '../data/companyOfferings';
import { sanitizeURL } from '../lib/sanitize';

const { LuArrowRight } = LuIcons;

export default function Documents() {
  return (
    <div className="max-w-[1200px] mx-auto px-6 py-20 relative z-10">
      <div className="mb-20">
        <span className="section-label">Legal Infrastructure</span>
        <h1 className="text-6xl font-black uppercase tracking-tighter mb-6">Documents</h1>
        <p className="text-zinc-500 max-w-2xl text-lg leading-relaxed mb-12">
          AXiM Document Generator Apps. Deploy robust legal frameworks, demands, and agreements through our automated protocols.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {generators.map((doc, idx) => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
            className="group bg-glass border border-subtle p-8 hover:border-axim-gold/50 cursor-pointer transition-all relative overflow-hidden flex flex-col h-full"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-axim-gold/5 blur-[60px] translate-x-16 -translate-y-16 group-hover:bg-axim-gold/10 transition-colors pointer-events-none" />

            <div className="flex items-center gap-4 mb-6 relative z-10">
              <div className="w-14 h-14 rounded-full bg-axim-gold/10 flex items-center justify-center text-axim-gold border border-axim-gold/40 shadow-[0_0_15px_rgba(255,234,0,0.1)]">
                <SafeIcon icon={LuIcons[doc.iconName] || LuIcons.LuFileText} className="w-7 h-7" />
              </div>
            </div>

            <h3 className="text-2xl font-black uppercase mb-4 relative z-10 group-hover:text-axim-gold transition-colors">{doc.title}</h3>
            <p className="text-zinc-400 text-sm leading-relaxed mb-8 relative z-10 flex-grow">
              {doc.desc}
            </p>

            <a
              href={sanitizeURL(doc.url)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 mt-auto border border-axim-gold/30 text-axim-gold font-bold uppercase text-xs tracking-widest group-hover:bg-axim-gold group-hover:text-black transition-colors flex items-center justify-center gap-2 relative z-10"
            >
              Generate Document <SafeIcon icon={LuArrowRight} />
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
