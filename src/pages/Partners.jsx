import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';

export default function Partners() {
  return (
    <div className="w-full relative z-10 bg-bg-void">
      <SEO title="Partner Ecosystem | Smarter Systems" description="Explore AXiM's vetted network of enterprise infrastructure and automation partners." />

      {/* 1. Master Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:40px_40px] pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-axim-purple to-transparent opacity-50" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="inline-flex items-center space-x-2 px-3 py-1 bg-white/5 border border-white/10 text-[0.65rem] font-mono uppercase tracking-widest text-zinc-400 mb-6 rounded-sm">
            <SafeIcon icon={LuIcons.LuGlobe} className="w-3 h-3 text-axim-purple" />
            <span>Vetted Integrations</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white mb-6 leading-tight">
            The AXiM Partner <br/><span className="text-axim-purple drop-shadow-[0_0_15px_rgba(125,0,255,0.3)]">Ecosystem</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            We don't just build software. We integrate with best-in-class platforms to expand your operational capabilities. From digital automation to physical grid infrastructure, welcome to the edge.
          </motion.p>
        </div>
      </section>

      {/* 2. Philosophy / Value Prop */}
      <section className="py-12 bg-black border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-white/10">
            <div className="p-4 md:p-8 text-center flex flex-col items-center">
              <SafeIcon icon={LuIcons.LuShieldCheck} className="w-8 h-8 text-axim-purple mb-4" />
              <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-2">Rigorous Vetting</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">We extensively test and utilize every platform internally before ever recommending them to our user base.</p>
            </div>
            <div className="p-4 md:p-8 text-center flex flex-col items-center">
              <SafeIcon icon={LuIcons.LuNetwork} className="w-8 h-8 text-axim-purple mb-4" />
              <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-2">Seamless Integration</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">Our partners provide the API and physical infrastructure required to plug directly into the AXiM methodology.</p>
            </div>
            <div className="p-4 md:p-8 text-center flex flex-col items-center">
              <SafeIcon icon={LuIcons.LuTrendingUp} className="w-8 h-8 text-axim-purple mb-4" />
              <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-2">Scale & Earn</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">Leverage our affiliate pipelines to not only streamline your life, but generate independent revenue streams.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Category: Digital Automation */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-12 border-b border-white/10 pb-6 flex items-center gap-4">
            <div className="w-8 h-8 bg-white/5 border border-white/10 flex items-center justify-center rounded">
              <SafeIcon icon={LuIcons.LuCpu} className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Digital Automation</h2>
              <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest mt-1">Software & Workflow Systems</p>
            </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex flex-col lg:flex-row bg-black border border-white/10 rounded-sm overflow-hidden group hover:border-[#9333EA]/50 transition-colors shadow-2xl">
            <div className="w-full lg:w-2/5 bg-gradient-to-br from-[#9333EA]/10 to-[#DB2777]/10 p-12 flex flex-col justify-center items-center border-b lg:border-b-0 lg:border-r border-white/10 relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-50"></div>
              <div className="flex items-center space-x-2 relative z-10 mb-6">
                 <span className="text-white text-3xl font-black tracking-tight uppercase">make</span>
              </div>
              <p className="text-center text-[0.65rem] font-mono uppercase tracking-widest text-[#DB2777] font-bold">Official Partner</p>
            </div>
            <div className="w-full lg:w-3/5 p-8 lg:p-12 flex flex-col justify-center relative">
              <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">Make.com Automation</h3>
              <p className="text-sm text-zinc-400 leading-relaxed mb-8">
                Stop doing busywork. Make is the visual automation platform that lets you design, build, and automate anything—from simple task routing to complex, branching enterprise workflows. No coding required. We use it to power the backend of AXiM.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/partners/make" className="inline-flex items-center px-6 py-3 bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-[#9333EA] hover:text-white transition-colors">
                  View Integration Funnel <SafeIcon icon={LuIcons.LuArrowRight} className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. Category: Physical Infrastructure */}
      <section className="py-24 bg-axim-deep/30 border-t border-white/10 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-12 border-b border-white/10 pb-6 flex items-center gap-4">
            <div className="w-8 h-8 bg-white/5 border border-white/10 flex items-center justify-center rounded">
              <SafeIcon icon={LuIcons.LuFactory} className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Physical Infrastructure</h2>
              <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest mt-1">Energy & Real-World Assets</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Powur Customer */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-black border border-white/10 rounded-sm overflow-hidden group hover:border-axim-gold/50 transition-colors flex flex-col">
              <div className="p-10 bg-gradient-to-br from-axim-gold/5 to-transparent border-b border-white/10 flex-grow">
                <div className="w-12 h-12 bg-axim-gold/20 text-axim-gold rounded flex items-center justify-center mb-6">
                  <SafeIcon icon={LuIcons.LuSun} className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-3">Powur Solar <span className="text-axim-gold">(For Homes)</span></h3>
                <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                  Stop wasting money on utility bills. Transition to Tier-1, zero-down residential solar systems. Take ownership of your power production and save up to 50% on your energy costs.
                </p>
                <ul className="space-y-2 mb-8">
                   <li className="flex items-center text-xs text-zinc-500 font-mono uppercase"><SafeIcon icon={LuIcons.LuCheck} className="w-3 h-3 text-axim-gold mr-2"/> 30-Year Warranty</li>
                   <li className="flex items-center text-xs text-zinc-500 font-mono uppercase"><SafeIcon icon={LuIcons.LuCheck} className="w-3 h-3 text-axim-gold mr-2"/> $0 Down Options</li>
                </ul>
              </div>
              <div className="p-6 bg-white/5">
                <Link to="/partners/powur-solar" className="w-full flex items-center justify-center px-6 py-4 border border-axim-gold/30 text-axim-gold font-bold uppercase tracking-widest text-xs hover:bg-axim-gold hover:text-black transition-colors">
                  Calculate Savings Funnel
                </Link>
              </div>
            </motion.div>

            {/* Powur Agency */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="bg-black border border-white/10 rounded-sm overflow-hidden group hover:border-axim-purple/50 transition-colors flex flex-col">
              <div className="p-10 bg-gradient-to-br from-axim-purple/5 to-transparent border-b border-white/10 flex-grow">
                <div className="w-12 h-12 bg-axim-purple/20 text-axim-purple rounded flex items-center justify-center mb-6">
                  <SafeIcon icon={LuIcons.LuTrendingUp} className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-3">Powur Agency <span className="text-axim-purple">(For Sellers)</span></h3>
                <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                  Join the fastest-growing 100% cloud-based solar platform. Build an enterprise solar agency with massive rev-share margins, zero inventory, and no installation crews to manage.
                </p>
                <ul className="space-y-2 mb-8">
                   <li className="flex items-center text-xs text-zinc-500 font-mono uppercase"><SafeIcon icon={LuIcons.LuCheck} className="w-3 h-3 text-axim-purple mr-2"/> 70/30 Revenue Split</li>
                   <li className="flex items-center text-xs text-zinc-500 font-mono uppercase"><SafeIcon icon={LuIcons.LuCheck} className="w-3 h-3 text-axim-purple mr-2"/> Work From Anywhere</li>
                </ul>
              </div>
              <div className="p-6 bg-white/5">
                <Link to="/partners/powur-join" className="w-full flex items-center justify-center px-6 py-4 border border-axim-purple/30 text-axim-purple font-bold uppercase tracking-widest text-xs hover:bg-axim-purple hover:text-white transition-colors">
                  View Agency Funnel
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. Bottom CTA */}
      <section className="py-20 border-t border-white/10 text-center relative overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent pointer-events-none" />
         <div className="max-w-3xl mx-auto px-6 relative z-10">
            <h2 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter mb-4">Build With Us</h2>
            <p className="text-zinc-500 text-sm mb-8">Have an enterprise platform or physical infrastructure service that aligns with the AXiM ecosystem? We are always looking for high-fidelity integration partners.</p>
            <Link to="/consultation" className="inline-flex items-center px-8 py-3 bg-white/10 text-white border border-white/20 font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-colors">
              Propose Partnership
            </Link>
         </div>
      </section>
    </div>
  );
}
