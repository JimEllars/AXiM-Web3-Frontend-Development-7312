import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';

const makeImage = "https://wp.axim.us.com/wp-content/uploads/2026/05/Best-featuresat-Make-Dark.webp";
const solarImage = "https://wp.axim.us.com/wp-content/uploads/2026/05/AXiM-Solar-Powur-Image-Panels-tech.png";

export default function Partners() {
  const detailedPartners = [
    {
      title: "Powur Solar",
      desc: "Stop overpaying for grid power. Transition to clean, Tier-1 residential solar with zero-down financing and take ownership of your energy production. Lock in your energy rates and increase your home's value.",
      features: ["Zero-down financing options", "Tier-1 solar equipment", "25-year system warranty", "Utility offset optimization"],
      link: "/partners/powur-solar",
      icon: LuIcons.LuSun,
      color: "text-axim-gold",
      bgHover: "hover:border-axim-gold/30",
      btnClass: "bg-axim-gold text-black hover:bg-white hover:text-black",
      isExternal: false
    },
    {
      title: "Powur Agency",
      desc: "Join the fastest-growing cloud-based solar platform. Build a massive revenue stream with zero installation overhead. Tap into a billion-dollar industry with a revolutionary model.",
      features: ["Cloud-based sales platform", "Zero installation liability", "High-ticket commissions", "Enterprise training materials"],
      link: "/partners/powur-join",
      icon: LuIcons.LuTrendingUp,
      color: "text-axim-purple",
      bgHover: "hover:border-axim-purple/30",
      btnClass: "bg-axim-purple text-white hover:bg-white hover:text-black",
      isExternal: false
    },
    {
      title: "Make.com",
      desc: "Connect your apps and automate your workflows without writing a single line of code. Leverage the backend engine that powers AXiM and scale your systems.",
      features: ["Visual drag-and-drop builder", "Thousands of app integrations", "Complex logic and routing", "Enterprise-grade reliability"],
      link: "/partners/make",
      icon: LuIcons.LuNetwork,
      color: "text-[#DB2777]",
      bgHover: "hover:border-[#DB2777]/30",
      btnClass: "bg-gradient-to-r from-[#9333EA] to-[#DB2777] text-white hover:scale-105 transition-transform",
      isExternal: false
    },
    {
      title: "Chatbase AI Concierge",
      desc: "Stop losing leads to slow response times. Deploy a custom ChatGPT agent trained exclusively on your business data. Embed it natively into your site or sync it with Slack, WhatsApp, and Zendesk for omnichannel triage.",
      features: ["Custom data ingestion (PDF, URL, Notion)", "Omnichannel integration", "Autonomous lead capture", "Instant deployment"],
      link: "/partners/chatbase",
      icon: LuIcons.LuBot,
      color: "text-[#DB2777]",
      bgHover: "hover:border-[#DB2777]/30",
      btnClass: "bg-[#DB2777] text-white hover:bg-white hover:text-black",
      isExternal: false
    }
  ];

  return (
    <div className="w-full relative z-10 bg-bg-void min-h-screen pb-32">
      <SEO title="Partner Showcase | Smart Systems" description="Explore world-class platforms and physical infrastructure curated by AXiM." />

      {/* 1. Subtle Curator Hero */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:40px_40px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-4">
            <span className="text-zinc-500 font-mono text-xs uppercase tracking-widest flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-axim-purple rounded-full animate-pulse" />
              Curated by AXiM
            </span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white leading-tight">
            World-Class <span className="text-zinc-500">Solutions.</span>
          </motion.h1>
        </div>
      </section>

      {/* 2. The Showcase Collage */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Make.com - Full Width Feature */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="lg:col-span-12 relative rounded-xl overflow-hidden bg-black border border-white/10 group shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-[#9333EA]/20 to-[#DB2777]/20 opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            <div className="flex flex-col md:flex-row items-center">
              <div className="w-full md:w-1/2 p-10 md:p-16 relative z-10">
                <div className="flex items-center space-x-2 mb-6">
                  <span className="text-white text-4xl font-black tracking-tight uppercase">make</span>
                </div>
                <h2 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter mb-4 leading-tight">
                  Automate Everything. <br/> <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#9333EA] to-[#DB2777]">No Coding Required.</span>
                </h2>
                <p className="text-zinc-400 text-sm md:text-base leading-relaxed mb-10 max-w-md">
                  Visual automation that lets you design, build, and automate anything—from simple tasks to complex enterprise workflows.
                </p>
                <Link to="/partners/make" className="inline-flex items-center px-8 py-4 bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-[#DB2777] hover:text-white transition-colors shadow-lg shadow-black/50">
                  Explore Make <SafeIcon icon={LuIcons.LuArrowRight} className="ml-2 w-4 h-4" />
                </Link>
              </div>
              <div className="w-full md:w-1/2 h-[300px] md:h-full relative overflow-hidden hidden md:block">
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black z-10" />
                <img src={makeImage} alt="Make Automation Interface" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700" />
              </div>
            </div>
          </motion.div>

          {/* Powur Solar - Half Width Visual */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="lg:col-span-7 relative rounded-xl overflow-hidden bg-black border border-white/10 group shadow-2xl min-h-[400px] flex flex-col justify-end">
            <img src={solarImage} alt="Powur Solar Infrastructure" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-0" />

            <div className="relative z-10 p-10 md:p-12">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-axim-gold/10 border border-axim-gold/20 text-[0.65rem] font-bold uppercase tracking-widest text-axim-gold mb-6 rounded-sm">
                <SafeIcon icon={LuIcons.LuSun} className="w-3 h-3" />
                <span>Powur Solar</span>
              </div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4 leading-tight">
                Decentralize Your <br/>Home's Grid.
              </h2>
              <p className="text-zinc-400 text-sm leading-relaxed mb-8 max-w-sm">
                Stop wasting money on utility bills. Transition to a Tier-1, zero-down residential solar system and take ownership of your power.
              </p>
              <Link to="/partners/powur-solar" className="inline-flex items-center px-8 py-3 bg-axim-gold text-black font-black uppercase tracking-widest text-xs hover:bg-white transition-colors">
                Calculate Savings <SafeIcon icon={LuIcons.LuArrowRight} className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          {/* Powur Agency - Half Width Graphic Focus */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="lg:col-span-5 relative rounded-xl overflow-hidden bg-gradient-to-br from-[#0F172A] to-black border border-white/10 group shadow-2xl min-h-[400px] flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-[80%] h-[80%] bg-axim-purple/20 blur-[100px] pointer-events-none group-hover:bg-axim-purple/30 transition-colors duration-700" />

            <div className="p-10 md:p-12 relative z-10">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-axim-purple/10 border border-axim-purple/20 text-[0.65rem] font-bold uppercase tracking-widest text-axim-purple mb-6 rounded-sm">
                <SafeIcon icon={LuIcons.LuTrendingUp} className="w-3 h-3" />
                <span>Powur Agency</span>
              </div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4 leading-tight">
                Scale A Cloud <br/>Solar Business.
              </h2>
              <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">
                Join the fastest-growing cloud-based solar platform. Build a massive revenue stream with zero installation overhead.
              </p>
            </div>

            <div className="p-10 md:p-12 pt-0 relative z-10 mt-auto">
              <Link to="/partners/powur-join" className="inline-flex w-full justify-between items-center px-8 py-4 border border-axim-purple text-axim-purple font-black uppercase tracking-widest text-xs hover:bg-axim-purple hover:text-white transition-colors">
                Start Selling <SafeIcon icon={LuIcons.LuArrowRight} className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          {/* Chatbase Master Grid Card Tile */}
          <Link to="/partners/chatbase" className="group block bg-[#050505] border border-white/10 p-8 rounded-xl hover:border-[#DB2777]/50 transition-colors shadow-2xl relative overflow-hidden lg:col-span-12">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#DB2777]/5 blur-[40px] pointer-events-none group-hover:bg-[#DB2777]/10 transition-colors" />
            <div className="w-10 h-10 bg-gradient-to-br from-[#DB2777] to-pink-600 rounded flex items-center justify-center mb-6 shadow-lg group-hover:scale-105 transition-transform duration-500">
              <SafeIcon icon={LuIcons.LuBot} className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2 flex items-center justify-between group-hover:text-[#DB2777] transition-colors">
              Chatbase AI <SafeIcon icon={LuIcons.LuArrowUpRight} className="w-4 h-4 opacity-30 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Transform unstructured manuals and website endpoints into an intelligent chatbot interface built to automate lead capture and client support natively.
            </p>
          </Link>

        </div>
      </section>

      {/* Deep Dive Partner Breakdowns */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 pb-16">
        <div className="py-16 space-y-16">
          {detailedPartners.map((partner, index) => (
            <div key={index} className="flex flex-col md:flex-row items-center gap-12 group">
               <div className={`flex-1 w-full bg-[#0F172A] border border-white/5 p-12 rounded-xl shadow-2xl relative overflow-hidden transition-colors ${partner.bgHover} ${index % 2 === 0 ? 'md:order-1' : 'md:order-2'}`}>
                  <SafeIcon icon={partner.icon} className={`w-16 h-16 ${partner.color} mb-6`} />
                  <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">{partner.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed mb-8">{partner.desc}</p>

                  <ul className="space-y-3 mb-10">
                    {partner.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-zinc-500">
                        <SafeIcon icon={LuIcons.LuCheck} className={`w-4 h-4 ${partner.color}`} /> {feature}
                      </li>
                    ))}
                  </ul>

                  {partner.isExternal ? (
                    <a href={partner.link} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center px-8 py-4 font-black uppercase tracking-widest text-xs transition-colors rounded-sm shadow-lg ${partner.btnClass}`}>
                      Explore Partner <SafeIcon icon={LuIcons.LuArrowRight} className="ml-2 w-4 h-4" />
                    </a>
                  ) : (
                    <Link to={partner.link} className={`inline-flex items-center px-8 py-4 font-black uppercase tracking-widest text-xs transition-colors rounded-sm shadow-lg ${partner.btnClass}`}>
                      Explore Partner <SafeIcon icon={LuIcons.LuArrowRight} className="ml-2 w-4 h-4" />
                    </Link>
                  )}
               </div>

               <div className={`flex-1 hidden md:flex justify-center ${index % 2 === 0 ? 'md:order-2' : 'md:order-1'}`}>
                 <div className="w-64 h-64 border border-white/10 rounded-full flex items-center justify-center relative bg-black/50 backdrop-blur-sm">
                   <div className="absolute inset-4 border border-dashed border-white/20 rounded-full animate-[spin_60s_linear_infinite]" />
                   <SafeIcon icon={partner.icon} className={`w-20 h-20 opacity-50 ${partner.color}`} />
                 </div>
               </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
