import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';
import SafeIcon from '../../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';

export default function MakeLanding() {
  const AFFILIATE_LINK = "https://www.make.com/en/register?pc=aximpartner";

  const makeSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Automate with Make | AXiM Systems Partner",
    "description": "Visually design, build, and automate anything with Make and AXiM Systems."
  };

  return (
    <div className="w-full relative z-10">
      <SEO title="Automate with Make | Partner Solutions" description="Visually design, build, and automate anything with Make and AXiM Systems." customSchema={[makeSchema]} />

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16">
        <Link to="/partners" className="inline-flex items-center gap-2 text-axim-purple hover:text-axim-gold font-mono text-[0.65rem] uppercase tracking-widest transition-colors mb-12 group">
          <SafeIcon icon={LuIcons.LuArrowLeft} className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
          Back to Partners
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "circOut" }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="px-3 py-1 bg-axim-purple/10 border border-axim-purple/30 text-axim-purple font-mono text-xs uppercase tracking-widest rounded-sm">Official Alliance</div>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 leading-tight">
            Smarter Systems. <br/><span className="text-axim-purple">Limitless Automation.</span>
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl leading-relaxed mb-10">
            We've partnered with Make to give you the power to visually design, build, and automate anything in minutes. Connect AXiM Hub to thousands of apps without writing a single line of code.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href={AFFILIATE_LINK} target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-axim-gold text-black font-black uppercase text-sm tracking-widest hover:bg-white transition-colors flex items-center justify-center gap-3">
              Start Automating Free <SafeIcon icon={LuIcons.LuArrowRight} className="w-4 h-4"/>
            </a>
          </div>
        </motion.div>
      </section>

      {/* Feature Grid */}
      <section className="bg-layered-purple py-24 border-y border-white/5">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-black text-white tracking-tighter mb-12 text-center">Why We Recommend Make</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: LuIcons.LuWorkflow, title: "Visual Workflows", desc: "Watch your processes run in real-time. Drag, drop, and connect nodes instantly." },
              { icon: LuIcons.LuBlocks, title: "1000+ Integrations", desc: "Connect the tools you already use. Seamlessly bridge your existing software stack." },
              { icon: LuIcons.LuZap, title: "Zero Code Required", desc: "Build enterprise-grade automation architecture without hiring an engineering team." }
            ].map((feat, i) => (
              <div key={i} className="p-8 bg-black/40 border border-white/10 hover:border-axim-purple/50 transition-colors">
                <SafeIcon icon={feat.icon} className="w-8 h-8 text-axim-purple mb-6" />
                <h3 className="text-xl font-bold text-white mb-3">{feat.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl font-black text-white tracking-tighter mb-6">Ready to scale your infrastructure?</h2>
        <p className="text-zinc-400 mb-10 max-w-xl mx-auto">Join thousands of forward-thinking operators building the future of work. Create your free Make account through our partner portal today.</p>
        <a href={AFFILIATE_LINK} target="_blank" rel="noopener noreferrer" className="inline-flex px-10 py-5 bg-axim-purple text-white font-black uppercase text-sm tracking-widest hover:bg-axim-gold hover:text-black transition-colors items-center justify-center gap-3 border border-axim-purple hover:border-axim-gold shadow-[0_0_30px_rgba(125,0,255,0.2)]">
          Claim Your Free Account <SafeIcon icon={LuIcons.LuExternalLink} className="w-4 h-4"/>
        </a>
      </section>
    </div>
  );
}
