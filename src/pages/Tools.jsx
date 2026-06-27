import { motion } from "framer-motion";
import React from 'react';
import { Link } from 'react-router-dom';
import { logTelemetry } from '../lib/telemetry';
import SEO from '../components/SEO';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';
import { useAximAuth } from '../hooks/useAximAuth';
import { useAximStore } from '../store/useAximStore';

export default function Tools() {
  const { session } = useAximAuth();
  const isWeb3Authenticated = useAximStore((state) => state.isWeb3Authenticated);
  const toolsList = [
    {
      title: "Demand Letter Engine",
      desc: "Generate legally formatted, aggressively structured demand letters instantly. Powered by a specialized AI framework designed to accelerate debt recovery and dispute resolution.",
      features: ["Custom dispute parameter ingestion", "Automated legal formatting", "Instant PDF extraction", "Zero-retainer cost structure"],
      link: "/tools",
      isExternal: false,
      icon: LuIcons.LuScale,
      color: "text-axim-gold",
      bgHover: "hover:border-axim-gold/30",
      btnClass: "bg-axim-gold text-black hover:bg-white"
    },
    {
      title: "Mutual NDA Generator",
      desc: "Protect your intellectual property and operational blueprints before entering B2B consultations. Generate a balanced, two-way non-disclosure agreement optimized for tech collaborations.",
      features: ["Symmetric protection clauses", "Instant print-ready extraction", "Software/IP specific", "Free to use"],
      link: "/tools/nda-generator",
      isExternal: false,
      icon: LuIcons.LuShieldCheck,
      color: "text-axim-purple",
      bgHover: "hover:border-axim-purple/30",
      btnClass: "bg-axim-purple text-white hover:bg-white hover:text-black"
    },
    {
      title: "Pay Stub System",
      desc: "Standardize your independent payroll documentation. Input earnings and deductions into our computational node to generate an instant, mathematically verified pay stub.",
      features: ["Automated deduction routing", "Standardized accounting layouts", "Instant PDF extraction", "Free to use"],
      link: "/tools/pay-stub",
      isExternal: false,
      icon: LuIcons.LuFileText,
      color: "text-[#DB2777]",
      bgHover: "hover:border-[#DB2777]/30",
      btnClass: "bg-[#DB2777] text-white hover:bg-white hover:text-black"
    }
  ];
  const toolsSchema = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Demand Letter Engine",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "provider": { "@type": "Organization", "name": "AXiM Systems" }
    },
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Mutual NDA Generator",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "provider": { "@type": "Organization", "name": "AXiM Systems" }
    }
  ];


  return (
    <div className="w-full min-h-screen bg-bg-void relative z-10 pb-32">
      <SEO
        title="Internal Product Suite | AXiM Hub"
        description="Access our exclusive enterprise app directory to discover and launch standalone utilities engineered for operational efficiency." customSchema={toolsSchema}
      />

      {/* Hero Header */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:40px_40px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-center">
          <div className="mb-12">
            <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-4">
              Internal <span className="text-axim-purple">AXiM Apps & Tools</span>
            </h1>
            <p className="text-zinc-400 max-w-2xl mx-auto text-sm leading-relaxed">
              These tool matrices are engineered natively to run statelessly on top of secure network nodes. Access our enterprise directory to discover and launch standalone operational utilities.
            </p>
          </div>
        </div>
      </section>

      {/* High-Contrast Grid Hub */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {toolsList.map((tool, idx) => (
             <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: idx * 0.1 }} viewport={{ once: true, margin: "-50px" }} className="h-full">
               {tool.isExternal ? (
                                  <a href={tool.link} target="_blank" rel="noopener noreferrer" className={`group block h-full bg-[#050505] border border-white/10 p-8 rounded-sm transition-colors shadow-2xl relative overflow-hidden ${tool.bgHover}`}>
                    <GridCardContent tool={tool} />


                    </a>
               ) : (
                 <Link to={tool.link} className={`group block h-full bg-[#050505] border border-white/10 p-8 rounded-sm transition-colors shadow-2xl relative overflow-hidden ${tool.bgHover}`}>
                    <GridCardContent tool={tool} />


                 </Link>
               )}
             </motion.div>
          ))}
        </div>
      </section>

      {/* Deep-Dive Alternating Layout Array */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 space-y-16">
        {toolsList.map((tool, index) => (
          <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} viewport={{ once: true, margin: "-50px" }} className={`flex flex-col md:flex-row gap-12 items-center ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
            <div className={`flex-1 w-full bg-[#0F172A] border border-white/5 p-12 rounded-xl shadow-2xl relative overflow-hidden transition-colors ${tool.bgHover}`}>
               <div className={`absolute top-0 ${index % 2 === 0 ? 'right-0' : 'left-0'} w-64 h-64 opacity-10 blur-[60px] pointer-events-none ${tool.color.replace('text-', 'bg-')}`} />
               <SafeIcon icon={tool.icon} className={`w-12 h-12 mb-6 relative z-10 ${tool.color}`} />
               <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4 relative z-10">{tool.title}</h2>
               <p className="text-zinc-400 text-sm leading-relaxed mb-8 relative z-10">{tool.desc}</p>

               <ul className="space-y-3 mb-10 relative z-10">
                 {tool.features.map((feature, fIndex) => (
                   <li key={fIndex} className="flex items-center text-xs font-mono text-zinc-300 uppercase tracking-widest">
                     <div className={`w-1.5 h-1.5 rounded-full mr-3 ${tool.color.replace('text-', 'bg-')}`} />
                     {feature}
                   </li>
                 ))}
               </ul>

               {tool.isExternal ? (
                                  <a href={tool.link} target="_blank" rel="noopener noreferrer" className={`relative z-10 inline-flex items-center px-6 py-3 font-black uppercase tracking-widest text-[0.65rem] transition-colors rounded-sm shadow-lg ${tool.btnClass}`}>
                   Launch Application <SafeIcon icon={LuIcons.LuArrowUpRight} className="ml-2 w-3 h-3" />
                 </a>
               ) : (
                 <Link to={tool.link} className={`relative z-10 inline-flex items-center px-6 py-3 font-black uppercase tracking-widest text-[0.65rem] transition-colors rounded-sm shadow-lg ${tool.btnClass}`}>
                   Launch Application <SafeIcon icon={LuIcons.LuArrowRight} className="ml-2 w-3 h-3" />
                 </Link>
               )}
            </div>

            {/* Visual Abstraction Container */}
            <div className="flex-1 hidden md:flex justify-center">
               <div className="w-full max-w-sm aspect-square bg-[#050505] border border-white/5 rounded-full flex items-center justify-center relative shadow-[inset_0_0_50px_rgba(0,0,0,0.8)]">
                  <div className={`absolute inset-4 rounded-full border border-dashed opacity-20 animate-spin-slow ${tool.color.replace('text-', 'border-')}`} />
                  <SafeIcon icon={tool.icon} className={`w-24 h-24 opacity-20 ${tool.color}`} />
               </div>
            </div>
          </motion.div>
        ))}
      </section>
    </div>
  );
}

// Helper component to keep the grid card JSX clean and DRY
function GridCardContent({ tool }) {
  return (
    <>
      <div className={`w-12 h-12 rounded flex items-center justify-center mb-6 shadow-lg group-hover:scale-105 transition-transform duration-500 ${tool.color === 'text-axim-gold' ? 'bg-gradient-to-br from-axim-gold to-yellow-600' : tool.color === 'text-axim-purple' ? 'bg-gradient-to-br from-axim-purple to-indigo-600' : 'bg-gradient-to-br from-[#DB2777] to-pink-600'}`}>
        <SafeIcon icon={tool.icon} className={`w-6 h-6 ${tool.color === 'text-axim-gold' ? 'text-black' : 'text-white'}`} />
      </div>
      <h3 className={`text-lg font-black text-white uppercase tracking-tight mb-2 flex items-center justify-between transition-colors ${tool.color.replace('text-', 'group-hover:text-')}`}>
        {tool.title.split(' ')[0]} {tool.title.split(' ')[1]}
        <SafeIcon icon={tool.isExternal ? LuIcons.LuArrowUpRight : LuIcons.LuArrowRight} className="w-4 h-4 opacity-30 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
      </h3>
      <p className="text-[0.65rem] font-mono text-zinc-500 uppercase tracking-widest leading-relaxed line-clamp-3">
        {tool.desc}
      </p>
    </>
  );
}
