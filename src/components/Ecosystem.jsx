import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';

const features = [
  { icon: LuIcons.LuZap, title: "Instant Generation", desc: "Create professional-grade documents and business tools in seconds." },
  { icon: LuIcons.LuShieldCheck, title: "Secure & Private", desc: "Your data is encrypted and vaulted locally for maximum privacy." },
  { icon: LuIcons.LuRefreshCw, title: "Always Available", desc: "Our resilient architecture means you never lose access to your work." }
];

export default function Ecosystem() {
  return (
    <div className="w-full max-w-7xl mx-auto py-20 px-6 border-t border-white/10 mt-10">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-black text-white tracking-tighter mb-4">Built for Reliability</h2>
        <p className="text-zinc-400 max-w-2xl mx-auto text-sm">We build tools that meet you where you are, delivering high-value outputs without the complex learning curve.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {features.map((feat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.4, ease: "circOut" }} className="flex flex-col items-center text-center group">
            <div className="w-12 h-12 bg-axim-purple/10 border border-axim-purple/30 rounded flex items-center justify-center mb-6 group-hover:bg-axim-purple/20 transition-colors">
              <SafeIcon icon={feat.icon} className="w-6 h-6 text-axim-purple group-hover:text-axim-gold transition-colors" />
            </div>
            <h3 className="text-lg font-bold text-white mb-3">{feat.title}</h3>
            <p className="text-sm text-zinc-500">{feat.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
