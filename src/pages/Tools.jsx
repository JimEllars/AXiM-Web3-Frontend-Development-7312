import { motion } from "framer-motion";
import React from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { logTelemetry } from '../lib/telemetry';
import SEO from '../components/SEO';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';
import { useAximAuth } from '../hooks/useAximAuth';
import { useAximStore } from '../store/useAximStore';

export default function Tools({ embedMode = false }) {
  const { session } = useAximAuth();
  const isWeb3Authenticated = useAximStore((state) => state.isWeb3Authenticated);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    teamSize: '',
    phone: ''
  });

  const bizDevTools = [
    {
      title: "Nexus CRM",
      desc: "Enterprise B2B/B2C pipeline management, automated lead routing, and comprehensive sales rep revenue tracking engineered for scaling organizations.",
      features: ["Pipeline management", "Automated routing", "Revenue tracking"],
      link: "#",
      badge: "[INVITE ONLY]",
      isInvite: true,
      appId: "nexus_crm",
      icon: LuIcons.LuChartBar,
      color: "text-axim-gold",
      bgHover: "hover:border-axim-gold/30",
      btnClass: "bg-axim-gold text-black hover:bg-white"
    },
    {
      title: "Ground Game",
      desc: "Tactical door-to-door field operations platform providing dynamic territory mapping, live performance tracking, and granular rep optimization.",
      features: ["Territory mapping", "Live tracking", "Rep optimization"],
      link: "#",
      badge: "[INVITE ONLY]",
      isInvite: true,
      appId: "ground_game",
      icon: LuIcons.LuMap,
      color: "text-emerald-400",
      bgHover: "hover:border-emerald-400/30",
      btnClass: "bg-emerald-400 text-black hover:bg-white"
    },
    {
      title: "Onboard1",
      desc: "Automated sales rep sourcing, candidate vetting, and onboarding engine.",
      features: ["Sales rep sourcing", "Candidate vetting", "Automated onboarding"],
      link: "#",
      badge: "[IN DEVELOPMENT]",
      isInternal: true,
      icon: LuIcons.LuUserPlus,
      color: "text-zinc-400",
      bgHover: "hover:border-zinc-400/30",
      btnClass: "bg-zinc-800 text-zinc-400 cursor-not-allowed",
      isDisabled: true
    },
    {
      title: "RecruitFlow",
      desc: "Automated candidate sourcing, structured video interviewing, and accelerated hiring and onboarding workflows designed for high-turnover sales forces.",
      features: ["Candidate sourcing", "Video interviews", "Automated onboarding"],
      link: "#",
      badge: "[INTERNAL / BIZDEV CORE]",
      isInternal: true,
      icon: LuIcons.LuUsers,
      color: "text-axim-purple",
      bgHover: "hover:border-axim-purple/30",
      btnClass: "bg-zinc-800 text-zinc-400 cursor-not-allowed"
    }
  ];

  const utilityTools = [
    {
      title: "Mutual NDA Generator",
      desc: "Protect your intellectual property and operational blueprints before entering B2B consultations. Generate a balanced, two-way non-disclosure agreement optimized for tech collaborations.",
      features: ["Symmetric protection clauses", "Instant print-ready extraction", "Software/IP specific", "Free to use"],
      link: "/tools/nda-generator",
      badge: "[ACTIVE TOOL]",
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
      badge: "[ACTIVE TOOL]",
      isExternal: false,
      icon: LuIcons.LuFileText,
      color: "text-[#DB2777]",
      bgHover: "hover:border-[#DB2777]/30",
      btnClass: "bg-[#DB2777] text-white hover:bg-white hover:text-black"
    },
    {
      title: "Demand Letter Engine",
      desc: "Generate legally formatted, aggressively structured demand letters instantly. Powered by a specialized AI framework designed to accelerate debt recovery and dispute resolution.",
      features: ["Custom dispute parameter ingestion", "Automated legal formatting", "Instant PDF extraction", "Zero-retainer cost structure"],
      link: "https://quickdemandletter.com/start?via=axim_hub",
      badge: "[EXTERNAL UTILITY]",
      isExternal: true,
      icon: LuIcons.LuScale,
      color: "text-axim-gold",
      bgHover: "hover:border-axim-gold/30",
      btnClass: "bg-axim-gold text-black hover:bg-white"
    }
  ];

  const toolsSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "item": {
          "@type": "SoftwareApplication",
          "name": "Nexus CRM",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web",
          "provider": { "@type": "Organization", "name": "AXiM Systems" }
        }
      },
      {
        "@type": "ListItem",
        "position": 2,
        "item": {
          "@type": "SoftwareApplication",
          "name": "Ground Game",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web",
          "provider": { "@type": "Organization", "name": "AXiM Systems" }
        }
      },
      {
        "@type": "ListItem",
        "position": 3,
        "item": {
          "@type": "SoftwareApplication",
          "name": "RecruitFlow",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web",
          "provider": { "@type": "Organization", "name": "AXiM Systems" }
        }
      },
      {
        "@type": "ListItem",
        "position": 4,
        "item": {
          "@type": "SoftwareApplication",
          "name": "Mutual NDA Generator",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web",
          "provider": { "@type": "Organization", "name": "AXiM Systems" }
        }
      }
    ]
  };

  return (
    <div className="w-full min-h-screen bg-bg-void relative z-10 pb-32">
      <SEO
        title="AXiM Tools & Infrastructure | Work Smarter"
        description="Access our suite of enterprise Web3 tools, NDA generators, and operational infrastructure."
        customSchema={toolsSchema}
      />

      {/* Hero Header */}
      <motion.section
        className="pt-32 pb-16 relative overflow-hidden bg-black border-b border-white/10"
        onViewportEnter={() => {
          logTelemetry('apps_hub_viewed', { isWeb3Authenticated });
        }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:40px_40px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-center">
          <div className="mb-12">
            <div className="flex items-center justify-center gap-2 font-mono text-[10px] text-axim-purple uppercase tracking-widest mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-axim-purple animate-pulse" />
              // SYSTEM_APPS: ONLINE
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-4">
              AXiM Business Development <span className="text-axim-gold">App Ecosystem</span>
            </h1>
            <p className="text-zinc-400 max-w-2xl mx-auto text-sm leading-relaxed">
              These tool matrices are engineered natively to run statelessly on top of secure network nodes. Access our enterprise directory to discover our proprietary sales, canvassing, and recruiting platforms, and launch standalone operational utilities.
            </p>
            {isWeb3Authenticated && (
              <div className="mt-4 inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 font-mono text-[8px] text-emerald-400 uppercase tracking-widest rounded-sm select-none pointer-events-none">
                <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                [BIZDEV_APP_NODE: NEXUS_ECOSYSTEM_ACTIVE]
              </div>
            )}
          </div>
        </div>
      </motion.section>



      {/* Sales & Business Development Suite */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 space-y-16 mt-24 mb-32 overflow-x-hidden md:overflow-visible">
          <div className="border-b border-white/10 pb-4 mb-12">
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">Sales & Business Development Suite</h2>
          </div>
        {bizDevTools.map((tool, index) => (
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

               {tool.isDisabled ? (
                 <span className={`relative z-10 inline-flex items-center px-6 py-3 font-black uppercase tracking-widest text-[0.65rem] transition-colors rounded-sm shadow-lg ${tool.btnClass}`}>
                   Awaiting Deployment <SafeIcon icon={LuIcons.LuLock} className="ml-2 w-3 h-3" />
                 </span>
               ) : tool.isExternal ? (
                                  <a href={tool.link} target="_blank" rel="noopener noreferrer" onClick={() => logTelemetry('tool_launch_intent', { toolTitle: tool.title, isExternal: tool.isExternal, target: tool.link })} className={`relative z-10 inline-flex items-center px-6 py-3 font-black uppercase tracking-widest text-[0.65rem] transition-colors rounded-sm shadow-lg ${tool.btnClass}`}>
                   Launch Application <SafeIcon icon={LuIcons.LuArrowUpRight} className="ml-2 w-3 h-3" />
                 </a>
               ) : (
                 <Link to={tool.link} onClick={() => logTelemetry('tool_launch_intent', { toolTitle: tool.title, isExternal: tool.isExternal, target: tool.link })} className={`relative z-10 inline-flex items-center px-6 py-3 font-black uppercase tracking-widest text-[0.65rem] transition-colors rounded-sm shadow-lg ${tool.btnClass}`}>
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
      {/* Legal & Operations Utility Tools */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 space-y-16 mb-24 overflow-x-hidden md:overflow-visible">
          <div className="border-b border-white/10 pb-4 mb-12">
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">Legal & Operations Utilities</h2>
          </div>
        {utilityTools.map((tool, index) => (
          <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} viewport={{ once: true, margin: "-50px" }} className={`flex flex-col md:flex-row gap-12 items-center ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
            <div className={`flex-1 w-full bg-[#0F172A] border border-white/5 p-12 rounded-xl shadow-2xl relative overflow-hidden transition-colors ${tool.bgHover}`}>
               <div className={`absolute top-0 ${index % 2 === 0 ? 'right-0' : 'left-0'} w-64 h-64 opacity-10 blur-[60px] pointer-events-none ${tool.color.replace('text-', 'bg-')}`} />
               <div className="flex items-center gap-4 mb-6 relative z-10">
                 <SafeIcon icon={tool.icon} className={`w-12 h-12 ${tool.color}`} />
                 <span className="px-2 py-1 bg-white/5 border border-white/10 text-xs font-mono text-zinc-400 uppercase tracking-wider rounded">{tool.badge}</span>
               </div>

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

               {tool.isInvite ? (
                  <button onClick={(e) => {
                      e.preventDefault();
                      setSelectedApp(tool.appId);
                      setIsModalOpen(true);
                      setIsSubmitted(false);
                      logTelemetry('app_card_clicked', { appName: tool.appId, accessType: 'invite_only' });
                  }} className={`relative z-10 inline-flex items-center px-6 py-3 font-black uppercase tracking-widest text-[0.65rem] transition-colors rounded-sm shadow-lg ${tool.btnClass}`}>
                    Request Access <SafeIcon icon={LuIcons.LuLock} className="ml-2 w-3 h-3" />
                  </button>
               ) : tool.isInternal ? (
                   <span className={`relative z-10 inline-flex items-center px-6 py-3 font-black uppercase tracking-widest text-[0.65rem] transition-colors rounded-sm shadow-lg ${tool.btnClass}`}>
                     AXiM Internal Operations <SafeIcon icon={LuIcons.LuLock} className="ml-2 w-3 h-3" />
                   </span>
               ) : tool.isExternal ? (
                  <a href={tool.link} target="_blank" rel="noopener noreferrer" onClick={() => logTelemetry('tool_launch_intent', { toolTitle: tool.title, isExternal: tool.isExternal, target: tool.link })} className={`relative z-10 inline-flex items-center px-6 py-3 font-black uppercase tracking-widest text-[0.65rem] transition-colors rounded-sm shadow-lg ${tool.btnClass}`}>
                   Launch Application <SafeIcon icon={LuIcons.LuArrowUpRight} className="ml-2 w-3 h-3" />
                  </a>
               ) : (
                 <Link to={tool.link} onClick={() => logTelemetry('tool_launch_intent', { toolTitle: tool.title, isExternal: tool.isExternal, target: tool.link })} className={`relative z-10 inline-flex items-center px-6 py-3 font-black uppercase tracking-widest text-[0.65rem] transition-colors rounded-sm shadow-lg ${tool.btnClass}`}>
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

      {/* Access Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0A0A0A] border border-white/10 rounded-xl p-8 max-w-md w-full relative shadow-2xl"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
              >
                <SafeIcon icon={LuIcons.LuX} className="w-5 h-5" />
              </button>

              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <SafeIcon icon={LuIcons.LuCheck} className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">Invite Request Submitted</h3>
                  <p className="text-sm text-zinc-400">Our business development team will review your request and contact you shortly.</p>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">Request Partner Access: {selectedApp === 'nexus_crm' ? 'Nexus CRM' : 'Ground Game'}</h3>
                  <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
                    Nexus CRM and Ground Game are enterprise sales development platforms managed by AXiM Business Development. External organizational access is available by invitation only.
                  </p>

                  {selectedApp === 'nexus_crm' && (
                      <div className="mb-6 p-4 bg-onyx-800/50 border border-axim-gold/20 rounded-md">
                        <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-2 border-b border-white/10 pb-2">Quantitative Performance Metrics</h4>
                        <ul className="text-zinc-400 text-sm space-y-2">
                          <li className="flex items-start gap-2"><span className="text-axim-gold">►</span> 2.4x Speedup in Sales Rep Onboarding</li>
                          <li className="flex items-start gap-2"><span className="text-axim-gold">►</span> 42% Increase in Lead Conversion Rate</li>
                          <li className="flex items-start gap-2"><span className="text-axim-gold">►</span> Real-time granular pipeline analytics</li>
                        </ul>
                      </div>
                  )}
                  {selectedApp === 'ground_game' && (
                      <div className="mb-6 p-4 bg-onyx-800/50 border border-emerald-500/20 rounded-md">
                        <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-2 border-b border-white/10 pb-2">Quantitative Performance Metrics</h4>
                        <ul className="text-zinc-400 text-sm space-y-2">
                          <li className="flex items-start gap-2"><span className="text-emerald-500">►</span> 2.4x Speedup in Sales Rep Onboarding</li>
                          <li className="flex items-start gap-2"><span className="text-emerald-500">►</span> 42% Increase in Lead Conversion Rate</li>
                          <li className="flex items-start gap-2"><span className="text-emerald-500">►</span> 100% precise territory optimization mapping</li>
                        </ul>
                      </div>
                  )}

                  <form onSubmit={(e) => {
                      e.preventDefault();
                      logTelemetry('invite_access_requested', {
                        appName: selectedApp,
                        teamSize: formData.teamSize,
                        timestamp: Date.now()
                      });
                      setIsSubmitted(true);
                      setTimeout(() => {
                          setIsModalOpen(false);
                      }, 2500);
                  }} className="space-y-4">
                    <div>
                      <input
                        type="text"
                        required
                        placeholder="Full Name"
                        className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-axim-gold/50 transition-colors"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        required
                        placeholder="Company Email"
                        className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-axim-gold/50 transition-colors"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        required
                        placeholder="Organization Name"
                        className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-axim-gold/50 transition-colors"
                        value={formData.company}
                        onChange={(e) => setFormData({...formData, company: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                        <input
                            type="number"
                            required
                            placeholder="Sales Team Size"
                            className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-axim-gold/50 transition-colors"
                            value={formData.teamSize}
                            onChange={(e) => setFormData({...formData, teamSize: e.target.value})}
                        />
                        </div>
                        <div>
                        <input
                            type="tel"
                            required
                            placeholder="Phone Number"
                            className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-axim-gold/50 transition-colors"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                        </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-axim-gold text-black font-black uppercase tracking-widest text-[0.65rem] py-3 rounded-md hover:bg-white transition-colors mt-4"
                    >
                      Submit Request
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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
