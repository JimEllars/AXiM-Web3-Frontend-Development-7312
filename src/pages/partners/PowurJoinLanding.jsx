import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SEO from '../../components/SEO';
import SafeIcon from '../../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';

const joinSeoSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "AXiM x Powur | Build Your Solar Business",
  "description": "Start as a Solar Setter and scale to a closing Consultant. Join the fastest-growing cloud-based solar platform with AXiM and Powur.",
  "offers": { "@type": "Offer", "url": "https://powur.com/axim/join" }
};

export default function PowurJoinLanding() {
  const affiliateLink = "https://powur.com/axim/join";
  const featuredImage = "https://wp.axim.us.com/wp-content/uploads/2026/05/AXiM-Solar-Powur-Image-Panels-tech.png";

  // Advanced Calculator State
  const [sitsPerWeek, setSitsPerWeek] = useState(3);
  const [closeRate, setCloseRate] = useState(25);
  const [teamSize, setTeamSize] = useState(0);

  // Constants based on Powur CSV Data
  const cancelRate = 0.15; // 15% industry average cancellation
  const avgSetterCommission = 1200;
  const avgConsultantCommission = 4000;
  const levelOneOverridePerInstall = 360; // Approx 6% of a $6k margin

  // Math
  const monthlySits = sitsPerWeek * 4.33;
  const grossContracts = monthlySits * (closeRate / 100);
  const netInstalls = grossContracts * (1 - cancelRate);

  const monthlySetterIncome = netInstalls * avgSetterCommission;
  const monthlyConsultantIncome = netInstalls * avgConsultantCommission;

  // Assuming team members do 2 sits/week at a 25% close rate
  const teamInstalls = teamSize * (2 * 4.33) * 0.25 * (1 - cancelRate);
  const monthlyTeamIncome = teamInstalls * levelOneOverridePerInstall;

  return (
    <div className="w-full relative z-10 bg-bg-void min-h-screen">
      <SEO title="AXiM x Powur | Build Your Business" description="Start as a Solar Setter and scale to a closing Consultant." image={featuredImage} customSchema={[joinSeoSchema]} />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-24 overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-axim-purple/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            <div className="text-left">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: "circOut" }} className="inline-flex items-center space-x-2 px-3 py-1 bg-white/5 border border-white/10 text-[0.65rem] font-mono uppercase tracking-widest text-zinc-400 mb-6 rounded-sm">
                <SafeIcon icon={LuIcons.LuTrendingUp} className="w-3 h-3 text-axim-purple" />
                <span>Enterprise Revenue Partner</span>
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1, ease: "circOut" }} className="text-4xl md:text-6xl font-black tracking-tighter mb-6 text-white uppercase leading-tight">
                Scale A Remote <br /> <span className="text-axim-purple drop-shadow-[0_0_15px_rgba(125,0,255,0.3)]">Solar Business.</span>
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2, ease: "circOut" }} className="text-base text-zinc-400 mb-8 leading-relaxed max-w-lg">
                The solar industry is booming, but traditional models are slow and expensive. Join Powur's revolutionary cloud-based platform and build a massive decentralized income stream with zero installation overhead.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3, ease: "circOut" }}>
                <a href={affiliateLink} target="_blank" rel="noopener noreferrer" className="inline-flex justify-center items-center px-8 py-4 rounded-sm bg-axim-purple text-white font-black uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-colors shadow-[0_0_20px_rgba(125,0,255,0.3)]">
                  Start Your Solar Agency
                  <SafeIcon icon={LuIcons.LuExternalLink} className="ml-3 w-4 h-4" />
                </a>
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="bg-black/80 backdrop-blur-xl border border-white/10 p-8 shadow-2xl rounded-sm">
               <h3 className="text-axim-purple font-mono text-xs uppercase tracking-widest mb-6 border-b border-white/10 pb-4">The Powur Career Path</h3>
               <ul className="space-y-8">
                 <li className="flex items-start gap-4">
                    <div className="p-3 bg-axim-purple/10 text-axim-purple border border-axim-purple/30 rounded font-black text-xl">1</div>
                    <div>
                      <p className="text-white font-black uppercase text-lg mb-1 flex items-center gap-2">The Setter <span className="text-axim-gold text-xs font-mono bg-axim-gold/10 px-2 py-0.5 rounded">~$1,200 / Deal</span></p>
                      <p className="text-xs text-zinc-400 leading-relaxed">Everyone starts here. You act as the lead generator. You find the homeowner, collect their utility bill, and hand them off to an expert. You earn massive commissions just for starting the conversation.</p>
                    </div>
                 </li>
                 <li className="flex items-start gap-4">
                    <div className="p-3 bg-axim-purple border border-axim-purple text-white rounded font-black text-xl shadow-[0_0_15px_rgba(125,0,255,0.5)]">2</div>
                    <div>
                      <p className="text-white font-black uppercase text-lg mb-1 flex items-center gap-2">The Consultant <span className="text-axim-gold text-xs font-mono bg-axim-gold/10 px-2 py-0.5 rounded">~$4,000+ / Deal</span></p>
                      <p className="text-xs text-zinc-400 leading-relaxed">Once trained, you graduate to closing. You present the custom proposal, manage the transaction, and capture the lion's share of the aggressive 70/30 revenue split.</p>
                    </div>
                 </li>
               </ul>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Official Trust Indicators */}
      <section className="py-8 bg-black border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500 items-center text-center">
            <div className="text-zinc-400 font-black tracking-tighter flex items-center gap-2">
              <SafeIcon icon={LuIcons.LuAward} className="w-5 h-5 text-axim-purple" />
              INC. 5000 FASTEST GROWING
            </div>
            <div className="text-zinc-400 font-black tracking-tighter flex items-center gap-2">
              <SafeIcon icon={LuIcons.LuCloud} className="w-5 h-5 text-axim-purple" />
              100% CLOUD-BASED
            </div>
            <div className="text-zinc-400 font-black tracking-tighter flex items-center gap-2">
              <SafeIcon icon={LuIcons.LuUsers} className="w-5 h-5 text-axim-purple" />
              80,000+ ACTIVE SELLERS
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Execution Protocol */}
      <section className="py-24 bg-axim-deep/30 border-b border-white/10 relative">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white mb-16 text-center">Built To <span className="text-axim-purple">Grow</span></h2>
          <div className="grid md:grid-cols-3 gap-8 relative">
             <div className="hidden md:block absolute top-6 left-10 right-10 h-0.5 bg-gradient-to-r from-axim-purple/10 via-axim-purple to-axim-purple/10 z-0"></div>

             <div className="relative z-10 bg-black p-8 border border-white/10 rounded-sm text-center hover:border-axim-purple/50 transition-colors">
                <div className="w-12 h-12 mx-auto bg-black border-2 border-axim-purple text-axim-purple flex items-center justify-center font-black rounded-full mb-6 text-lg">1</div>
                <h3 className="text-lg font-bold text-white uppercase tracking-widest mb-3">Onboard & Train</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">Access the enterprise academy. Learn the platform, solar fundamentals, and compliance protocols at your own pace.</p>
             </div>

             <div className="relative z-10 bg-black p-8 border border-white/10 rounded-sm text-center hover:border-axim-purple/50 transition-colors">
                <div className="w-12 h-12 mx-auto bg-axim-purple border-2 border-axim-purple text-white flex items-center justify-center font-black rounded-full mb-6 text-lg shadow-[0_0_20px_rgba(125,0,255,0.4)]">2</div>
                <h3 className="text-lg font-bold text-white uppercase tracking-widest mb-3">Submit Leads</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">Input homeowner utility data into the cloud portal. Powur's engineering team handles the custom system design and proposals.</p>
             </div>

             <div className="relative z-10 bg-black p-8 border border-white/10 rounded-sm text-center hover:border-axim-purple/50 transition-colors">
                <div className="w-12 h-12 mx-auto bg-black border-2 border-axim-purple text-axim-purple flex items-center justify-center font-black rounded-full mb-6 text-lg">3</div>
                <h3 className="text-lg font-bold text-white uppercase tracking-widest mb-3">Scale & Earn</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">Powur manages the physical installation and permitting. You collect your aggressive rev-share commission upon project milestones.</p>
             </div>
          </div>
        </div>
      </section>


      {/* Enterprise Back-Office Value Prop */}
      <section className="py-24 bg-black border-b border-white/10 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="mb-16 md:flex justify-between items-end border-b border-white/10 pb-6">
            <div>
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white mb-2">The <span className="text-axim-purple">Enterprise</span> Back-Office</h2>
              <p className="text-sm text-zinc-400">You focus purely on acquisition. The platform handles the rest.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             <div className="p-6 bg-white/5 border border-white/10 rounded-sm hover:border-axim-purple/30 transition-colors">
               <SafeIcon icon={LuIcons.LuDraftingCompass} className="w-8 h-8 text-axim-purple mb-4" />
               <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-2">3D Engineering</h4>
               <p className="text-xs text-zinc-500 leading-relaxed">Powur's internal engineering team creates customized, interactive 3D solar system designs for every lead you submit.</p>
             </div>

             <div className="p-6 bg-white/5 border border-white/10 rounded-sm hover:border-axim-purple/30 transition-colors">
               <SafeIcon icon={LuIcons.LuBuilding2} className="w-8 h-8 text-axim-purple mb-4" />
               <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-2">Vetted Financiers</h4>
               <p className="text-xs text-zinc-500 leading-relaxed">Instantly access Tier-1 national financing partners like GoodLeap and Sunnova right inside your cloud portal.</p>
             </div>

             <div className="p-6 bg-white/5 border border-white/10 rounded-sm hover:border-axim-purple/30 transition-colors">
               <SafeIcon icon={LuIcons.LuHardHat} className="w-8 h-8 text-axim-purple mb-4" />
               <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-2">Installation Crews</h4>
               <p className="text-xs text-zinc-500 leading-relaxed">Powur manages a nationwide network of highly vetted local installation crews, completely removing operational liability from you.</p>
             </div>

             <div className="p-6 bg-white/5 border border-white/10 rounded-sm hover:border-axim-purple/30 transition-colors">
               <SafeIcon icon={LuIcons.LuFileCheck} className="w-8 h-8 text-axim-purple mb-4" />
               <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-2">Automated Permitting</h4>
               <p className="text-xs text-zinc-500 leading-relaxed">The platform's project managers handle all complex city permitting, HOA approvals, and utility interconnection paperwork.</p>
             </div>
          </div>
        </div>
      </section>

      {/* Advanced Compensation Calculator */}
      <section className="py-24 relative overflow-hidden bg-black border-b border-white/10">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-axim-purple/5 blur-[150px] pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
             <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white mb-4">Interactive <span className="text-axim-purple">Comp</span> Calculator</h2>
             <p className="text-sm text-zinc-400 max-w-2xl mx-auto">Adjust the parameters below to project your monthly run-rate as a Setter vs. a Consultant, and see the compounding power of Level 1 team building.</p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8">
            {/* Controls */}
            <div className="lg:col-span-5 bg-white/5 border border-white/10 p-8 rounded-sm">
              <h3 className="text-white font-black uppercase tracking-widest border-b border-white/10 pb-4 mb-8">Performance Inputs</h3>

              <div className="mb-8">
                <div className="flex justify-between items-end mb-4">
                  <label className="text-xs font-mono text-zinc-400 uppercase tracking-widest">Sits per Week</label>
                  <span className="text-2xl font-black text-white">{sitsPerWeek}</span>
                </div>
                <input type="range" min="1" max="15" step="1" value={sitsPerWeek} onChange={(e) => setSitsPerWeek(Number(e.target.value))} className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-axim-purple" />
              </div>

              <div className="mb-8">
                <div className="flex justify-between items-end mb-4">
                  <label className="text-xs font-mono text-zinc-400 uppercase tracking-widest">Close Rate (%)</label>
                  <span className="text-2xl font-black text-white">{closeRate}%</span>
                </div>
                <input type="range" min="10" max="50" step="5" value={closeRate} onChange={(e) => setCloseRate(Number(e.target.value))} className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-axim-purple" />
              </div>

              <div className="mb-4">
                <div className="flex justify-between items-end mb-4">
                  <label className="text-xs font-mono text-zinc-400 uppercase tracking-widest text-axim-gold">Level 1 Recruits</label>
                  <span className="text-2xl font-black text-axim-gold">{teamSize}</span>
                </div>
                <input type="range" min="0" max="20" step="1" value={teamSize} onChange={(e) => setTeamSize(Number(e.target.value))} className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-axim-gold" />
                <p className="text-[0.55rem] text-zinc-500 font-mono uppercase mt-2">*Assumes recruits average 2 sits/week at 25% close rate</p>
              </div>
            </div>

            {/* Outputs */}
            <div className="lg:col-span-7 grid sm:grid-cols-2 gap-6">

               <div className="bg-black border border-white/10 p-8 rounded-sm flex flex-col justify-center">
                  <div className="mb-6">
                    <p className="text-[0.65rem] font-mono text-zinc-500 uppercase tracking-widest mb-1">Phase 1 Target</p>
                    <h4 className="text-xl font-black text-white uppercase tracking-tight">Setter Income</h4>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-400 uppercase tracking-widest mb-1">Estimated Monthly</p>
                    <p className="text-4xl font-black text-white">${Math.round(monthlySetterIncome).toLocaleString()}</p>
                  </div>
                  <div className="mt-6 pt-6 border-t border-white/5">
                    <p className="text-xs text-zinc-400 uppercase tracking-widest mb-1">Annual Run Rate</p>
                    <p className="text-xl font-bold text-zinc-300">${Math.round(monthlySetterIncome * 12).toLocaleString()}</p>
                  </div>
               </div>

               <div className="bg-gradient-to-br from-axim-purple/20 to-black border border-axim-purple/50 p-8 rounded-sm flex flex-col justify-center shadow-[0_0_30px_rgba(125,0,255,0.15)] relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-3 bg-axim-purple text-white text-[0.6rem] font-black uppercase tracking-widest">Goal</div>
                  <div className="mb-6">
                    <p className="text-[0.65rem] font-mono text-zinc-400 uppercase tracking-widest mb-1">Phase 2 Target</p>
                    <h4 className="text-xl font-black text-white uppercase tracking-tight">Consultant Income</h4>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-300 uppercase tracking-widest mb-1">Estimated Monthly</p>
                    <p className="text-4xl font-black text-axim-purple">${Math.round(monthlyConsultantIncome).toLocaleString()}</p>
                  </div>
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <p className="text-xs text-zinc-300 uppercase tracking-widest mb-1">Annual Run Rate</p>
                    <p className="text-xl font-bold text-white">${Math.round(monthlyConsultantIncome * 12).toLocaleString()}</p>
                  </div>
               </div>

               {teamSize > 0 && (
                 <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="sm:col-span-2 bg-axim-gold/10 border border-axim-gold p-6 rounded-sm flex justify-between items-center">
                    <div>
                      <p className="text-[0.65rem] font-mono text-axim-gold uppercase tracking-widest mb-1">Level 1 Team Override (Passive)</p>
                      <p className="text-2xl font-black text-white">+ ${Math.round(monthlyTeamIncome).toLocaleString()} <span className="text-xs font-normal text-zinc-400">/mo</span></p>
                    </div>
                    <SafeIcon icon={LuIcons.LuUsers} className="w-8 h-8 text-axim-gold opacity-50" />
                 </motion.div>
               )}

            </div>
          </div>

          <div className="mt-16 text-center">
            <a href={affiliateLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-10 py-4 bg-axim-purple text-white font-black uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-colors">
              Access The Platform <SafeIcon icon={LuIcons.LuArrowRight} className="ml-3 w-4 h-4" />
            </a>
          </div>

        </div>
      </section>
    </div>
  );
}
