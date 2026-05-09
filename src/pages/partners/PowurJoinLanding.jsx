import React from 'react';
import { motion } from 'framer-motion';
import SEO from '../../components/SEO';
import SafeIcon from '../../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';

const joinSeoSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "AXiM x Powur | Build Your Solar Business",
  "description": "Join the fastest-growing cloud-based solar platform. Build a decentralized income stream with AXiM and Powur.",
  "offers": { "@type": "Offer", "url": "https://powur.com/axim/join" }
};

export default function PowurJoinLanding() {
  const affiliateLink = "https://powur.com/axim/join";

  return (
    <div className="w-full relative z-10">
      <SEO title="AXiM x Powur | Build Your Business" description="Join the fastest-growing cloud-based solar platform." customSchema={[joinSeoSchema]} />

      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-bg-void border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-axim-purple/10 to-transparent pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            <div className="text-left">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: "circOut" }} className="inline-flex items-center space-x-2 px-3 py-1 bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-widest text-zinc-400 mb-6 rounded-sm">
                <SafeIcon icon={LuIcons.LuTrendingUp} className="w-3 h-3 text-axim-purple" />
                <span>Enterprise Revenue Partner</span>
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1, ease: "circOut" }} className="text-4xl md:text-6xl font-black tracking-tighter mb-6 text-white uppercase leading-tight">
                Scale A Cloud <br /> <span className="text-axim-purple drop-shadow-[0_0_15px_rgba(125,0,255,0.3)]">Solar Business.</span>
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2, ease: "circOut" }} className="text-base text-zinc-400 mb-8 leading-relaxed">
                The solar industry is booming, but traditional models are slow and expensive. Join Powur's revolutionary cloud-based platform and start selling solar with zero installation overhead.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3, ease: "circOut" }}>
                <a href={affiliateLink} target="_blank" rel="noopener noreferrer" className="inline-flex justify-center items-center px-8 py-4 rounded-sm bg-axim-purple text-white font-black uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-colors shadow-[0_0_20px_rgba(125,0,255,0.3)]">
                  Start Your Solar Agency
                  <SafeIcon icon={LuIcons.LuExternalLink} className="ml-3 w-4 h-4" />
                </a>
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="bg-black/80 backdrop-blur-xl border border-white/10 p-8 shadow-2xl rounded-sm">
               <h3 className="text-axim-gold font-mono text-xs uppercase tracking-widest mb-6 border-b border-white/10 pb-4">The Powur Advantage</h3>
               <ul className="space-y-6">
                 <li className="flex items-start gap-4">
                    <div className="p-2 bg-axim-purple/20 text-axim-purple rounded"><SafeIcon icon={LuIcons.LuCloud} className="w-5 h-5"/></div>
                    <div>
                      <p className="text-white font-bold uppercase text-sm mb-1">100% Cloud-Based</p>
                      <p className="text-xs text-zinc-500">Sell from anywhere. No trucks, no inventory, no installation crews to manage.</p>
                    </div>
                 </li>
                 <li className="flex items-start gap-4">
                    <div className="p-2 bg-axim-purple/20 text-axim-purple rounded"><SafeIcon icon={LuIcons.LuChartPie} className="w-5 h-5"/></div>
                    <div>
                      <p className="text-white font-bold uppercase text-sm mb-1">Aggressive Rev-Share</p>
                      <p className="text-xs text-zinc-500">Keep up to 70% of the margin on your deals, plus revenue sharing on team volume.</p>
                    </div>
                 </li>
               </ul>
            </motion.div>

          </div>
        </div>
      </section>
    </div>
  );
}
