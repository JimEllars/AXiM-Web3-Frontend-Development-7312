import { motion } from "framer-motion";
import React from 'react';
import SEO from '../components/SEO';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';
import { Link } from 'react-router-dom';

export default function Partners() {
  const detailedPartners = [
    {
      title: "Make.com Automation",
      desc: "Connect your entire application architecture without writing code. Leverage the backend visual routing engine that powers AXiM.",
      features: ["Asynchronous webhooks", "Deterministic routing", "Fault-resistant error handlers", "Thousands of app integrations"],
      link: "/partners/make",
      icon: LuIcons.LuCpu,
      color: "text-axim-purple",
      bgHover: "hover:border-axim-purple/30",
      btnClass: "bg-axim-purple text-white hover:bg-white hover:text-black"
    },
    {
      title: "Chatbase AI Concierge",
      desc: "Stop losing leads to slow response times. Deploy a custom ChatGPT agent trained exclusively on your business data. Embed it natively into your site or sync it with Slack, WhatsApp, and Zendesk.",
      features: ["Custom data ingestion (PDF, URL)", "Omnichannel integration", "Autonomous lead capture", "Instant deployment"],
      link: "/partners/chatbase",
      icon: LuIcons.LuBot,
      color: "text-[#DB2777]",
      bgHover: "hover:border-[#DB2777]/30",
      btnClass: "bg-[#DB2777] text-white hover:bg-white hover:text-black"
    },
    {
      title: "Powur Residential Solar",
      desc: "Stop leasing power from centralized utilities. Transition your home to clean, Tier-1 residential solar infrastructure with smart load-balancing and zero-down financing.",
      features: ["Tier-1 Monocrystalline Arrays", "Smart battery vaults", "Zero-down deployment", "30-year warranty"],
      link: "/partners/powur-solar",
      icon: LuIcons.LuSun,
      color: "text-axim-gold",
      bgHover: "hover:border-axim-gold/30",
      btnClass: "bg-axim-gold text-black hover:bg-white"
    },
    {
      title: "Powur Agency Partnership",
      desc: "Scale a national solar enterprise without the overhead. You secure the contracts; Powur's decentralized cloud network handles the engineering, permitting, and installation.",
      features: ["Cloud fulfillment infrastructure", "Dynamic proposal software", "Revenue share cascades", "Complete margin control"],
      link: "/partners/powur-join",
      icon: LuIcons.LuBriefcase,
      color: "text-axim-purple",
      bgHover: "hover:border-axim-purple/30",
      btnClass: "bg-axim-purple text-white hover:bg-white hover:text-black"
    }
  ];

  return (
    <div className="w-full min-h-screen bg-bg-void relative z-10 pb-32">
      <SEO
        title="Partner Network | AXiM Systems"
        description="Integrate with AXiM's vetted network of enterprise software providers, visual automation engines, and decentralized infrastructure partners."
      />

      {/* Hero Header */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:40px_40px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white leading-tight mb-4">
            The AXiM <span className="text-transparent bg-clip-text bg-gradient-to-r from-axim-purple to-[#DB2777]">Network.</span>
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed mb-10">
            A vetted ecosystem of enterprise software providers, visual automation engines, and decentralized infrastructure partners carefully selected to scale your operational capabilities.
          </p>
        </div>
      </section>

      {/* High-Contrast Grid Hub */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {detailedPartners.map((partner, idx) => (
             <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: idx * 0.1 }} viewport={{ once: true, margin: "-50px" }} className="h-full"><Link to={partner.link} className={`group block bg-[#050505] border border-white/10 p-8 rounded-sm transition-colors shadow-2xl relative overflow-hidden ${partner.bgHover}`}>
                <div className={`w-12 h-12 rounded flex items-center justify-center mb-6 shadow-lg group-hover:scale-105 transition-transform duration-500 ${partner.color === 'text-axim-purple' ? 'bg-gradient-to-br from-axim-purple to-indigo-600' : partner.color === 'text-[#DB2777]' ? 'bg-gradient-to-br from-[#DB2777] to-pink-600' : 'bg-gradient-to-br from-axim-gold to-yellow-600'}`}>
                  <SafeIcon icon={partner.icon} className={`w-6 h-6 ${partner.color === 'text-axim-gold' ? 'text-black' : 'text-white'}`} />
                </div>
                <h3 className={`text-lg font-black text-white uppercase tracking-tight mb-2 flex items-center justify-between transition-colors ${partner.color.replace('text-', 'group-hover:text-')}`}>
                  {partner.title.split(' ')[0]} <SafeIcon icon={LuIcons.LuArrowUpRight} className="w-4 h-4 opacity-30 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </h3>
                <p className="text-[0.65rem] font-mono text-zinc-500 uppercase tracking-widest leading-relaxed line-clamp-3">
                  {partner.desc}
                </p>
             </Link></motion.div>
          ))}
        </div>
      </section>

      {/* Deep-Dive Alternating Layout Array */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 space-y-16">
        {detailedPartners.map((partner, index) => (
          <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} viewport={{ once: true, margin: "-50px" }} className={`flex flex-col md:flex-row gap-12 items-center ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
            <div className={`flex-1 w-full bg-[#0F172A] border border-white/5 p-12 rounded-xl shadow-2xl relative overflow-hidden transition-colors ${partner.bgHover}`}>
               <div className={`absolute top-0 ${index % 2 === 0 ? 'right-0' : 'left-0'} w-64 h-64 opacity-10 blur-[60px] pointer-events-none ${partner.color.replace('text-', 'bg-')}`} />
               <SafeIcon icon={partner.icon} className={`w-12 h-12 mb-6 relative z-10 ${partner.color}`} />
               <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4 relative z-10">{partner.title}</h2>
               <p className="text-zinc-400 text-sm leading-relaxed mb-8 relative z-10">{partner.desc}</p>

               <ul className="space-y-3 mb-10 relative z-10">
                 {partner.features.map((feature, fIndex) => (
                   <li key={fIndex} className="flex items-center text-xs font-mono text-zinc-300 uppercase tracking-widest">
                     <div className={`w-1.5 h-1.5 rounded-full mr-3 ${partner.color.replace('text-', 'bg-')}`} />
                     {feature}
                   </li>
                 ))}
               </ul>

               <Link to={partner.link} className={`relative z-10 inline-flex items-center px-6 py-3 font-black uppercase tracking-widest text-[0.65rem] transition-colors rounded-sm shadow-lg ${partner.btnClass}`}>
                 Explore Integration <SafeIcon icon={LuIcons.LuArrowRight} className="ml-2 w-3 h-3" />
               </Link>
            </div>

            {/* Visual Abstraction Container */}
            <div className="flex-1 hidden md:flex justify-center">
               <div className="w-full max-w-sm aspect-square bg-[#050505] border border-white/5 rounded-full flex items-center justify-center relative shadow-[inset_0_0_50px_rgba(0,0,0,0.8)]">
                  <div className={`absolute inset-4 rounded-full border border-dashed opacity-20 animate-spin-slow ${partner.color.replace('text-', 'border-')}`} />
                  <SafeIcon icon={partner.icon} className={`w-24 h-24 opacity-20 ${partner.color}`} />
               </div>
            </div>
          </motion.div>
        ))}
      </section>
    </div>
  );
}
