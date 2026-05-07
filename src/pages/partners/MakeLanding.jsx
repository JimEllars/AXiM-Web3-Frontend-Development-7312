import React from 'react';
import { motion } from 'framer-motion';
import SEO from '../../components/SEO';
import SafeIcon from '../../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';

const makeSeoSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "AXiM x Make Partner Program",
  "description": "Automate your business systems with Make. Official AXiM partner portal.",
  "offers": {
    "@type": "Offer",
    "url": "https://www.make.com/en/register?pc=aximpartner",
    "name": "Make Automation Platform - Free Tier"
  }
};

export default function MakeLanding() {
  const affiliateLink = "https://www.make.com/en/register?pc=aximpartner";
  const featuredImage = "https://wp.axim.us.com/wp-content/uploads/2026/05/Best-featuresat-Make-Dark.webp";

  return (
    <div className="w-full relative z-10">
      <SEO
        title="AXiM x Make | Automate Your Business Systems"
        description="Stop doing busywork. Start building systems. Get started with Make through the official AXiM partner program."
        customSchema={[makeSeoSchema]}
        image={featuredImage}
      />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:40px_40px] pointer-events-none opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-bg-void pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Hero Content */}
            <div className="text-left">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: "circOut" }} className="inline-flex items-center space-x-3 px-4 py-1.5 rounded-sm bg-white/5 border border-white/10 text-sm font-medium mb-6 backdrop-blur-md">
                <div className="flex items-center space-x-1.5">
                  <span className="text-white font-black tracking-tight uppercase">make</span>
                  <SafeIcon icon={LuIcons.LuX} className="w-3 h-3 text-zinc-500" />
                  <span className="text-axim-purple font-bold tracking-tight uppercase">AXiM</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-zinc-600"></div>
                <span className="text-zinc-400 font-mono text-[0.65rem] uppercase tracking-widest">Official Partner Program</span>
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1, ease: "circOut" }} className="text-5xl lg:text-7xl font-extrabold tracking-tighter mb-6 leading-tight text-white uppercase">
                Stop Doing Busywork. <br />
                Start Building <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#9333EA] to-[#DB2777]">Systems.</span>
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2, ease: "circOut" }} className="text-lg text-zinc-400 mb-8 max-w-2xl leading-relaxed">
                Visual automation that lets you design, build, and automate anything—from simple tasks to complex enterprise workflows. No coding required.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3, ease: "circOut" }} className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <a href={affiliateLink} target="_blank" rel="noopener noreferrer" className="inline-flex justify-center items-center px-8 py-4 rounded-sm bg-gradient-to-r from-[#9333EA] to-[#DB2777] text-white font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform shadow-[0_0_30px_rgba(219,39,119,0.3)]">
                  Get Started with Make
                  <SafeIcon icon={LuIcons.LuArrowRight} className="ml-2 w-4 h-4" />
                </a>
                <a href="#story" className="inline-flex justify-center items-center px-8 py-4 rounded-sm bg-white/5 border border-white/10 text-white font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-colors">
                  Read Our Strategy
                </a>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-8 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                   <div className="flex -space-x-2">
                     <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-600"></div>
                     <div className="w-6 h-6 rounded-full bg-zinc-700 border border-zinc-500"></div>
                     <div className="w-6 h-6 rounded-full bg-[#9333EA] border border-[#DB2777] flex items-center justify-center text-[0.4rem] font-bold text-white">+</div>
                   </div>
                   <span className="text-[0.65rem] font-mono text-zinc-400 uppercase tracking-widest">Join 500,000+ Modern Operators</span>
                </div>
                <p className="text-[0.65rem] font-mono text-zinc-500 flex items-center uppercase tracking-widest">
                  <SafeIcon icon={LuIcons.LuCheck} className="w-3 h-3 text-axim-gold mr-2" />
                  Free forever plan available. No credit card required.
                </p>
              </motion.div>
            </div>

            {/* Hero Visual (Workflow Mockup & Featured Image) */}
            <div className="relative hidden lg:block w-full max-w-lg ml-auto mt-8">
              {/* Ambient Glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#9333EA]/30 to-[#DB2777]/30 rounded-full blur-[100px] opacity-70 pointer-events-none" />

              {/* Featured Image Glass Frame */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "circOut", delay: 0.2 }}
                className="relative rounded-md overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(147,51,234,0.15)] z-10 bg-black"
              >
                <img
                  src={featuredImage}
                  alt="Make Visual Automation Features"
                  className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition-opacity duration-500"
                />
              </motion.div>

              {/* Overlapping Floating Node for Depth */}
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-8 -left-12 bg-black/80 backdrop-blur-xl p-4 rounded-sm flex items-center space-x-4 border border-white/10 w-64 shadow-2xl z-20"
              >
                <div className="w-10 h-10 rounded bg-[#DB2777]/20 flex items-center justify-center text-[#DB2777]">
                  <SafeIcon icon={LuIcons.LuZap} className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white uppercase tracking-widest">Active Sync</p>
                  <p className="text-[0.6rem] font-mono text-zinc-500 uppercase">System Optimized</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* The AXiM Story Section */}
      <section id="story" className="py-24 bg-axim-deep/50 border-y border-white/5 relative">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4 text-white">Why AXiM Runs on <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#9333EA] to-[#DB2777]">Make</span></h2>
            <p className="text-sm font-mono uppercase tracking-widest text-zinc-500">A story of operational scale.</p>
          </div>

          <div className="prose prose-invert prose-lg max-w-none text-zinc-300 leading-relaxed text-sm md:text-base">
            <p>At AXiM, we talk a lot about "operational excellence." We believe that a business should serve the creator, not the other way around. But a few years ago, we hit a wall. We were scaling fast, but our internal operations were held together by digital duct tape.</p>

            <p>We were using standard, linear automation tools. They worked fine for simple "if this, then that" scenarios. But as our workflows became more complex—syncing custom document generators, routing lead data through multiple AI tools, and managing outputs—the standard tools broke down. They were too rigid, and creating multi-step logic was a nightmare.</p>

            <div className="my-10 p-8 bg-white/5 backdrop-blur-md rounded-sm border border-white/10 border-l-4 border-l-[#9333EA]">
              <h3 className="text-xl font-black uppercase tracking-tighter text-white mb-2 mt-0">The Turning Point</h3>
              <p className="mb-0 text-zinc-400 text-sm">We needed a platform that allowed us to <strong>see</strong> our systems. We needed branching logic, error handling, and the ability to connect to literally any API. That's when we discovered Make.</p>
            </div>

            <p>Make didn't just give us triggers and actions; it gave us a visual canvas. We were suddenly able to drag and drop complex systems into reality. We mapped our entire lead generation funnel, integrated our AI tools, and automated our backend administration.</p>

            <p><strong>The result?</strong> We eliminated over 40 hours of manual administrative work per week. That’s an entire full-time employee’s worth of time, instantly reallocated to high-level strategy and content creation.</p>

            <p>We don't just recommend Make; we rely on it. It is the invisible infrastructure that powers AXiM. If you are serious about treating your digital business like a scalable machine, Make is the tool you need.</p>
          </div>

          <div className="mt-16 text-center">
            <a href={affiliateLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-[#9333EA] hover:text-[#DB2777] font-mono text-xs uppercase tracking-widest transition-colors group">
              Build your first automation with Make today <SafeIcon icon={LuIcons.LuArrowRight} className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* Use Cases Grid */}
      <section id="use-cases" className="py-24 relative overflow-hidden bg-bg-void">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white mb-4">Unleash Your Operations</h2>
            <p className="text-sm text-zinc-500 max-w-2xl mx-auto">Here is exactly what you can build when you upgrade from linear tasks to visual systems.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} className="bg-white/5 border border-white/10 p-8 rounded-sm hover:border-[#9333EA]/50 transition-colors group">
              <div className="w-12 h-12 rounded bg-gradient-to-br from-[#9333EA] to-[#DB2777] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <SafeIcon icon={LuIcons.LuUsers} className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-black uppercase tracking-tighter text-white mb-3">Lead Gen on Autopilot</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">Capture leads from your site, enrich their data, add them to your CRM, and alert your team in Slack—all in one instant motion.</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.1 }} className="bg-white/5 border border-white/10 p-8 rounded-sm hover:border-[#DB2777]/50 transition-colors group">
              <div className="w-12 h-12 rounded bg-gradient-to-br from-[#9333EA] to-[#DB2777] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <SafeIcon icon={LuIcons.LuFileText} className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-black uppercase tracking-tighter text-white mb-3">Content Distribution</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">Publish a new video and automatically generate a blog draft, schedule social posts, and send a summary out via your newsletter.</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.2 }} className="bg-white/5 border border-white/10 p-8 rounded-sm hover:border-[#9333EA]/50 transition-colors group">
              <div className="w-12 h-12 rounded bg-gradient-to-br from-[#9333EA] to-[#DB2777] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <SafeIcon icon={LuIcons.LuGitBranch} className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-black uppercase tracking-tighter text-white mb-3">Complex Branching Logic</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">Unlike basic tools, Make allows infinite branching. Route VIP clients down one path, and standard clients down another, visually.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#9333EA]/10 to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto px-6 lg:px-8 relative z-10 text-center bg-white/5 backdrop-blur-xl p-12 md:p-20 rounded-sm border border-white/10 shadow-[0_0_50px_rgba(147,51,234,0.1)]">
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-6">
            Ready to scale without the overhead?
          </h2>
          <p className="text-sm md:text-base text-zinc-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join AXiM and thousands of other operators who are using Make to build the future of their businesses. Click below to claim your free account through our partner portal.
          </p>
          <a href={affiliateLink} target="_blank" rel="noopener noreferrer" className="inline-flex justify-center items-center px-10 py-5 rounded-sm bg-white text-black font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.2)]">
            Create Your Free Make Account
            <SafeIcon icon={LuIcons.LuExternalLink} className="ml-3 w-4 h-4" />
          </a>
          <p className="mt-8 text-[0.65rem] font-mono uppercase tracking-widest text-zinc-500">
            Disclosure: If you register using our partner link, we may earn a commission at no cost to you.
          </p>
        </div>
      </section>

    </div>
  );
}
