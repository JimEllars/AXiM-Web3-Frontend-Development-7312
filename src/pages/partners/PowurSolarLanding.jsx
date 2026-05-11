import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SEO from '../../components/SEO';
import SafeIcon from '../../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';

const solarSeoSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "AXiM x Powur | Enterprise-Grade Residential Solar",
  "description": "Stop overpaying for grid power. Decentralize your energy with zero-down residential solar through AXiM and Powur.",
  "offers": { "@type": "Offer", "url": "https://powur.com/axim/solar" }
};

export default function PowurSolarLanding() {
  const featuredImage = "https://wp.axim.us.com/wp-content/uploads/2026/05/AXiM-Solar-Powur-Image-Panels-tech.png";
  const affiliateLink = "https://powur.com/axim/solar";
  const [monthlyBill, setMonthlyBill] = useState(200);

  return (
    <div className="w-full relative z-10">
      <SEO title="AXiM x Powur | Residential Solar" description="Stop wasting money on utility bills. Decentralize your energy with zero-down residential solar through AXiM and Powur." image={featuredImage} customSchema={[solarSeoSchema]} />

      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-bg-void border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(240,255,0,0.05)_1px,transparent_1px)] [background-size:40px_40px] pointer-events-none" />
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[80%] h-[60%] bg-axim-gold/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column: Flyer Copy */}
            <div className="text-left">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: "circOut" }} className="inline-flex items-center space-x-3 px-4 py-1.5 rounded-sm bg-white/5 border border-white/10 text-sm font-medium mb-8 backdrop-blur-md">
                <span className="text-white font-black tracking-tight uppercase">Powur</span>
                <SafeIcon icon={LuIcons.LuX} className="w-3 h-3 text-zinc-500" />
                <span className="text-axim-gold font-bold tracking-tight uppercase">AXiM</span>
                <div className="w-1 h-1 rounded-full bg-zinc-600 mx-2"></div>
                <span className="text-zinc-400 font-mono text-[0.65rem] uppercase tracking-widest">Official Infrastructure Partner</span>
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1, ease: "circOut" }} className="text-5xl md:text-6xl font-black tracking-tighter mb-6 text-white uppercase leading-tight">
                Stop Wasting Money On <span className="text-axim-gold drop-shadow-[0_0_15px_rgba(240,255,0,0.3)]">Utility Bills.</span>
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2, ease: "circOut" }} className="text-lg text-zinc-400 mb-8 max-w-2xl leading-relaxed">
                Start generating your own power, reduce your total reliance on the public utility, and start saving money today. Own your energy and break free from skyrocketing energy costs from monopolized utility companies.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3, ease: "circOut" }}>
                <a href={affiliateLink} target="_blank" rel="noopener noreferrer" className="inline-flex justify-center items-center px-10 py-5 rounded-sm bg-axim-gold text-black font-black uppercase tracking-widest text-xs hover:bg-white hover:scale-105 transition-all shadow-[0_0_30px_rgba(240,255,0,0.2)]">
                  Request Free Solar Proposal
                  <SafeIcon icon={LuIcons.LuSun} className="ml-3 w-4 h-4" />
                </a>
              </motion.div>
            </div>

            {/* Right Column: High-Tech Solar Visual */}
            <div className="relative hidden lg:block w-full max-w-lg ml-auto">
              <div className="absolute inset-0 bg-axim-gold/20 rounded-full blur-[100px] opacity-70 pointer-events-none" />

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "circOut", delay: 0.2 }}
                className="relative rounded-md overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(240,255,0,0.1)] z-10 bg-black"
              >
                <img
                  src={featuredImage}
                  alt="Enterprise Grade Solar Panels"
                  className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition-opacity duration-500"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Official Trust Indicators */}
      <section className="py-8 bg-black border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500 items-center">
            <div className="text-zinc-400 font-black tracking-tighter flex items-center gap-2">
              <SafeIcon icon={LuIcons.LuAward} className="w-5 h-5 text-axim-gold" />
              INC. 5000 (4 YEARS)
            </div>
            <div className="text-zinc-400 font-black tracking-tighter flex items-center gap-2">
              <SafeIcon icon={LuIcons.LuShieldCheck} className="w-5 h-5 text-axim-gold" />
              BBB A+ RATING
            </div>
            <div className="text-zinc-400 font-black tracking-tighter flex items-center gap-2">
              <SafeIcon icon={LuIcons.LuLeaf} className="w-5 h-5 text-axim-green" />
              CERTIFIED B-CORP
            </div>
            <div className="text-zinc-400 font-black tracking-tighter flex items-center gap-2">
              <SafeIcon icon={LuIcons.LuStar} className="w-5 h-5 text-axim-gold" />
              YELP 5-STARS
            </div>
            <div className="text-zinc-400 font-black tracking-tighter flex items-center gap-2">
              <SafeIcon icon={LuIcons.LuGlobe} className="w-5 h-5 text-axim-green" />
              ECOLOGI PARTNER
            </div>
          </div>
        </div>
      </section>

      {/* 4-Step Transition Protocol */}
      <section className="py-24 bg-axim-deep/30 border-b border-white/10 relative">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 relative z-10">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white mb-16 text-center">The <span className="text-axim-gold">Transition</span> Plan</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
             <div className="hidden lg:block absolute top-6 left-10 right-10 h-0.5 bg-gradient-to-r from-axim-gold/10 via-axim-gold to-axim-gold/10 z-0"></div>

             <div className="relative z-10 bg-black p-8 border border-white/10 rounded-sm text-center hover:border-axim-gold/50 transition-colors group">
                <div className="w-12 h-12 mx-auto bg-black border-2 border-axim-gold text-axim-gold flex items-center justify-center font-black rounded-full mb-6 text-lg group-hover:bg-axim-gold group-hover:text-black group-hover:shadow-[0_0_20px_rgba(240,255,0,0.4)] transition-all duration-300">1</div>
                <h3 className="text-lg font-bold text-white uppercase tracking-widest mb-3">Free Energy Audit</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">Provide your current utility bill. We calculate your exact energy usage to design a system that offsets 100% of your power needs.</p>
             </div>

             <div className="relative z-10 bg-black p-8 border border-white/10 rounded-sm text-center hover:border-axim-gold/50 transition-colors group">
                <div className="w-12 h-12 mx-auto bg-black border-2 border-axim-gold text-axim-gold flex items-center justify-center font-black rounded-full mb-6 text-lg group-hover:bg-axim-gold group-hover:text-black group-hover:shadow-[0_0_20px_rgba(240,255,0,0.4)] transition-all duration-300">2</div>
                <h3 className="text-lg font-bold text-white uppercase tracking-widest mb-3">Custom Proposal</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">Review your custom 3D system design, Tier-1 hardware specs, and strict financing options with zero-down out of pocket.</p>
             </div>

             <div className="relative z-10 bg-black p-8 border border-white/10 rounded-sm text-center hover:border-axim-gold/50 transition-colors group">
                <div className="w-12 h-12 mx-auto bg-black border-2 border-axim-gold text-axim-gold flex items-center justify-center font-black rounded-full mb-6 text-lg group-hover:bg-axim-gold group-hover:text-black group-hover:shadow-[0_0_20px_rgba(240,255,0,0.4)] transition-all duration-300">3</div>
                <h3 className="text-lg font-bold text-white uppercase tracking-widest mb-3">Permits</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">We handle all the paperwork with your local government and utility. It's a waiting game, but your new solar payments won't start until after installation is complete.</p>
             </div>

             <div className="relative z-10 bg-black p-8 border border-white/10 rounded-sm text-center hover:border-axim-gold/50 transition-colors group">
                <div className="w-12 h-12 mx-auto bg-black border-2 border-axim-gold text-axim-gold flex items-center justify-center font-black rounded-full mb-6 text-lg group-hover:bg-axim-gold group-hover:text-black group-hover:shadow-[0_0_20px_rgba(240,255,0,0.4)] transition-all duration-300">4</div>
                <h3 className="text-lg font-bold text-white uppercase tracking-widest mb-3">Installation</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">Our enterprise crews handle the engineering. Once installed and approved by the utility, flip the switch to generate clean, decentralized power.</p>
             </div>
          </div>
        </div>
      </section>

      {/* Educational Block: How Solar Works */}
      <section className="py-24 bg-black relative border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 relative z-10">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white mb-4 text-center">The Mechanics of <span className="text-axim-gold">Independence</span></h2>
          <p className="text-sm text-zinc-400 text-center mb-16">Understanding how your home transforms from an energy consumer into an energy producer.</p>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="p-8 border border-white/10 bg-white/5 rounded-sm hover:border-axim-gold/30 transition-colors">
              <div className="w-12 h-12 bg-black border border-white/10 text-axim-gold rounded flex items-center justify-center mb-6">
                <SafeIcon icon={LuIcons.LuSun} className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white uppercase tracking-widest mb-3">1. Capture</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">The sun shines onto your Tier-1 panels, which instantly convert the solar radiation into Direct Current (DC) energy.</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="p-8 border border-white/10 bg-white/5 rounded-sm hover:border-axim-gold/30 transition-colors">
              <div className="w-12 h-12 bg-black border border-white/10 text-axim-gold rounded flex items-center justify-center mb-6">
                <SafeIcon icon={LuIcons.LuZap} className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white uppercase tracking-widest mb-3">2. Inversion</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">Your system's micro-inverters seamlessly convert the raw DC energy into Alternating Current (AC), safely powering your home's appliances.</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="p-8 border border-white/10 bg-white/5 rounded-sm hover:border-axim-gold/30 transition-colors">
              <div className="w-12 h-12 bg-black border border-white/10 text-axim-gold rounded flex items-center justify-center mb-6">
                <SafeIcon icon={LuIcons.LuArrowLeftRight} className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white uppercase tracking-widest mb-3">3. Net Metering</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">Any excess electricity you generate is sent back to the grid. The power company credits your account, radically lowering the cost of energy you use at night.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Interactive Savings Estimator */}
      <section className="py-24 relative overflow-hidden bg-white/5 border-y border-white/10">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white mb-6">Calculate Your <span className="text-axim-gold">Savings</span></h2>
          <p className="text-sm text-zinc-400 mb-12">Utility rates increase by an average of 5% every year. See how much you could save over 25 years by locking in your energy costs today.</p>

          <div className="bg-black/50 p-8 md:p-12 border border-white/10 rounded-sm shadow-2xl">
            <div className="mb-8">
              <label className="block text-xs font-mono text-zinc-500 uppercase tracking-widest mb-4">Average Monthly Electric Bill</label>
              <motion.div
                key={monthlyBill}
                initial={{ opacity: 0.5, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center gap-4 text-4xl font-black text-white mb-8"
              >
                <span className="text-axim-gold">$</span>{monthlyBill}
              </motion.div>
              <input
                type="range"
                min="100"
                max="800"
                step="10"
                value={monthlyBill}
                onChange={(e) => setMonthlyBill(Number(e.target.value))}
                className="w-full max-w-md h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-axim-gold"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 border-t border-white/10 pt-8">
               <div>
                 <p className="text-[0.65rem] font-mono text-zinc-500 uppercase tracking-widest mb-2">25-Year Utility Cost (No Solar)</p>
                 <p className="text-2xl font-bold text-red-400">${(monthlyBill * 12 * 25 * 1.5).toLocaleString()}</p>
                 <p className="text-[0.55rem] text-zinc-600 mt-1 uppercase tracking-widest">*Assumes 5% annual rate hike</p>
               </div>
               <div>
                 <p className="text-[0.65rem] font-mono text-zinc-500 uppercase tracking-widest mb-2">Estimated 25-Year Savings</p>
                 <p className="text-3xl font-black text-axim-gold">${(monthlyBill * 12 * 25 * 0.6).toLocaleString()}</p>
               </div>
            </div>

            <div className="mt-10">
              <a href={affiliateLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-8 py-3 bg-axim-gold text-black font-black uppercase tracking-widest text-xs hover:bg-white transition-colors">
                Lock In Your Rate <SafeIcon icon={LuIcons.LuArrowRight} className="ml-2 w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Environmental Impact & Secondary CTA */}
      <section className="py-24 bg-axim-gold text-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
        <div className="max-w-5xl mx-auto px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-black/10 border border-black/20 text-xs font-black uppercase tracking-widest text-black mb-6 rounded-sm">
            <SafeIcon icon={LuIcons.LuLeaf} className="w-3 h-3" />
            <span>100% Renewable</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6 leading-tight">
            Powur Your Life. <br /> Protect The Future.
          </h2>

          <p className="text-base md:text-lg font-medium text-black/80 max-w-2xl mx-auto mb-10">
            Solar energy is entirely renewable and clean, emitting zero greenhouse gasses. Enjoy the peace of mind that comes with knowing you are actively contributing to a cleaner energy future for the next generation.
          </p>

          <a href={affiliateLink} target="_blank" rel="noopener noreferrer" className="inline-flex justify-center items-center px-10 py-5 rounded-sm bg-black text-white font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform shadow-2xl">
            Get Your Free System Design
            <SafeIcon icon={LuIcons.LuArrowRight} className="ml-3 w-4 h-4 text-axim-gold" />
          </a>
        </div>
      </section>

      <section className="py-24 bg-axim-deep/30 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white/5 border border-white/10 p-8 rounded-sm hover:border-axim-gold/50 transition-colors group">
              <div className="w-12 h-12 rounded bg-axim-gold/20 flex items-center justify-center mb-6 group-hover:bg-axim-gold group-hover:text-black text-axim-gold transition-colors">
                <SafeIcon icon={LuIcons.LuBatteryCharging} className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black uppercase tracking-tighter text-white mb-3">Fast & Personalized</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">We source the highest quality hardware via an innovative platform model to ensure a fast, simple, and highly customized installation process.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="bg-white/5 border border-white/10 p-8 rounded-sm hover:border-axim-gold/50 transition-colors group">
              <div className="w-12 h-12 rounded bg-axim-gold/20 flex items-center justify-center mb-6 group-hover:bg-axim-gold group-hover:text-black text-axim-gold transition-colors">
                <SafeIcon icon={LuIcons.LuBadgeDollarSign} className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black uppercase tracking-tighter text-white mb-3">Zero-Down Options</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">Swap your unpredictable electric bill for a fixed, lower monthly payment. Our $0 down financing options allow you to save up to 50% on energy costs immediately.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="bg-white/5 border border-white/10 p-8 rounded-sm hover:border-axim-gold/50 transition-colors group">
              <div className="w-12 h-12 rounded bg-axim-gold/20 flex items-center justify-center mb-6 group-hover:bg-axim-gold group-hover:text-black text-axim-gold transition-colors">
                <SafeIcon icon={LuIcons.LuShieldCheck} className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black uppercase tracking-tighter text-white mb-3">Increase Home Value</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">Not only do you transition to clean, renewable energy, but a fully owned Powur solar system immediately increases the resale value of your property.</p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-black relative">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <h2 className="text-2xl font-black uppercase tracking-tighter text-white mb-10 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="p-6 border border-white/10 bg-white/5 rounded-sm">
              <h3 className="text-axim-gold font-bold mb-2">What does "Zero-Down" actually mean?</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">It means no out-of-pocket capital is required to install the hardware. You simply swap your current, fluctuating utility bill for a fixed, lower monthly solar payment.</p>
            </div>
            <div className="p-6 border border-white/10 bg-white/5 rounded-sm">
              <h3 className="text-axim-gold font-bold mb-2">Why partner through AXiM?</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">AXiM vets enterprise-grade infrastructure. Powur is the first 100% cloud-based solar platform, allowing us to pass massive efficiency savings directly to your system's design.</p>
            </div>
          </div>
          <div className="mt-12 text-center">
            <a href={affiliateLink} target="_blank" rel="noopener noreferrer" className="inline-flex justify-center items-center px-10 py-5 rounded-sm bg-axim-gold text-black font-black uppercase tracking-widest text-xs hover:bg-white hover:scale-105 transition-all shadow-[0_0_30px_rgba(240,255,0,0.2)]">
              Request Free Solar Proposal
              <SafeIcon icon={LuIcons.LuSun} className="ml-3 w-4 h-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
