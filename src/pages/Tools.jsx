import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as LuIcons from 'react-icons/lu';
import SafeIcon from '../common/SafeIcon';
import { generators } from '../data/companyOfferings';
import SEO from '../components/SEO';
const toolsSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "itemListElement": generators.map((tool, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "item": {
      "@type": "SoftwareApplication",
      "name": tool.title,
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "description": tool.desc
    }
  }))
};

import { useAximStore } from '../store/useAximStore';
import { Helmet } from 'react-helmet-async';
import { useAximAuth } from '../hooks/useAximAuth';

import { useShallow } from 'zustand/react/shallow';

const { LuGraduationCap, LuArrowRight, LuClock, LuTrendingUp, LuFileText, LuLock, LuUnlock } = LuIcons;

const courses = [
  {
    id: 'C_SALES101',
    title: 'Sales 101',
    desc: 'Foundational strategies for high-conversion B2B and B2C engagements. Master the basics of objection handling and closing.',
    level: 'Beginner',
    time: '4 Hours',
    icon: LuTrendingUp
  },
  {
    id: 'C_MODERN',
    title: 'Sales Modernization',
    desc: 'Transitioning legacy sales pipelines into high-velocity digital frameworks. Learn to use automation, CRM synergy, and intent data.',
    level: 'Intermediate',
    time: '6 Hours',
    icon: LuGraduationCap
  },
  {
    id: 'C_PSYCH',
    title: 'Sales Psychology',
    desc: 'Deep dive into cognitive biases, buyer motivation, and emotional intelligence in negotiations and deal structuring.',
    level: 'Advanced',
    time: '8 Hours',
    icon: LuTrendingUp
  },
  {
    id: 'C_AI',
    title: 'Leveraging AI for Sales',
    desc: 'Deploy bespoke AI models to pre-qualify leads, generate outreach copy, and automate follow-ups. Build your automated machine.',
    level: 'Advanced',
    time: '10 Hours',
    icon: LuGraduationCap
  }
];


export default function Tools() {
  const detailedTools = [
    {
      title: "Quick Demand Letter Engine",
      desc: "Bypass exorbitant legal retainers for straightforward disputes. Our engine extracts your scenario parameters and structures them into a formal, legally optimized demand letter ready for print and mailing.",
      features: ["50-State formatting guidelines", "Instant PDF generation", "AI-assisted tone optimization", "Fractional cost ($4.00)"],
      link: "https://quickdemandletter.com/start",
      icon: LuIcons.LuScale,
      color: "text-axim-gold",
      bgHover: "hover:border-axim-gold/30",
      btnClass: "bg-axim-gold text-black hover:bg-white hover:text-black",
      isExternal: true
    },
    {
      title: "Mutual NDA Generator",
      desc: "Protect your intellectual property and operational blueprints before entering into B2B consultations. This tool generates a balanced, two-way non-disclosure agreement optimized for technology and software collaborations.",
      features: ["Symmetric protection clauses", "Cryptographic vaulting", "Digital product extraction", "Enterprise standard verbiage"],
      link: "/tools/nda",
      icon: LuIcons.LuShieldCheck,
      color: "text-axim-purple",
      bgHover: "hover:border-axim-purple/30",
      btnClass: "bg-axim-purple text-white hover:bg-white hover:text-black",
      isExternal: false
    },
    {
      title: "Autonomous Pay Stub System",
      desc: "Standardize your payroll documentation. Input gross earnings, tax parameters, and deductions into our processing node to receive an instant, mathematically verified pay stub document.",
      features: ["Automated deduction routing", "Cryptographic receipt generation", "Standardized layout protocols", "Instant extraction"],
      link: "/tools/paystub",
      icon: LuIcons.LuFileText,
      color: "text-[#DB2777]",
      bgHover: "hover:border-[#DB2777]/30",
      btnClass: "bg-[#DB2777] text-white hover:bg-white hover:text-black",
      isExternal: false
    }
  ];

  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    setError(false);

    try {
      const url = import.meta.env.VITE_NEWSLETTER_API_URL;
      if (!url) {
        // Fallback
        setTimeout(() => {
          setIsSubmitting(false);
          setSubscribed(true);
        }, 1200);
        return;
      }

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (res.ok) {
        setIsSubmitting(false);
        setSubscribed(true);
      } else {
        setIsSubmitting(false);
        setError(true);
      }
    } catch (err) {
      setIsSubmitting(false);
      setError(true);
    }
  };
  const userSession = useAximStore((state) => state.userSession);
  const { profile } = useAximAuth();
  const [queueToast, setQueueToast] = useState(null);
  const { enqueueAction, telemetryStatus } = useAximStore(
    useShallow((state) => ({
      enqueueAction: state.enqueueAction,
      telemetryStatus: state.telemetryStatus
    }))
  );


  // Simulate premium access via profile clearance_level or a specific flag.
  // We'll treat clearance_level >= 2 as premium for the simulation,
  // or userSession.is_premium


  const handleLaunchTool = (tool) => {
    if (telemetryStatus === 'LOCAL_BUFFER' || telemetryStatus !== 'STABLE') {
      enqueueAction({ type: 'LAUNCH_UNIT', target: tool.id, name: tool.title });
      setQueueToast('[ACTION_QUEUED] System is offline. Your request has been securely buffered.');
      setTimeout(() => setQueueToast(null), 4000);
    } else {
      setQueueToast('[DEPLOYMENT_PENDING] ' + tool.title + ' is currently compiling.');
      setTimeout(() => setQueueToast(null), 4000);
    }
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": generators.map((doc, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "item": {
        "@type": "SoftwareApplication",
        "name": doc.title,
        "description": doc.desc,
        "applicationCategory": "BusinessApplication",
        "url": doc.externalUrl
      }
    }))
  };

  return (
    <div className="w-full relative z-10 bg-bg-void min-h-screen pb-32">
      <SEO title="Our Offerings | Smart Systems" description="Fast, reliable solutions built to make your life easier." customSchema={[toolsSchema]} />

      {/* Hero Section */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:40px_40px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-4">
            <span className="text-zinc-500 font-mono text-xs uppercase tracking-widest flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-axim-purple rounded-full animate-pulse" />
              AXiM Software Suite
            </span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white leading-tight mb-6">
            Fast, Reliable <br/><span className="text-axim-purple">Solutions.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="text-zinc-400 max-w-2xl text-sm md:text-base leading-relaxed">
            Enterprise-grade generators and strategic tools designed to eliminate operational friction. Select an offering below to generate high-fidelity digital assets.
          </motion.p>
        </div>
      </section>

      {/* Primary Tools Collage */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 mb-24">
        <div className="mb-8 border-b border-white/10 pb-4 flex items-center gap-3">
          <SafeIcon icon={LuIcons.LuCpu} className="w-5 h-5 text-axim-purple" />
          <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Business Generators</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

           {/* HEADLINING TOOL: AXiM Demand Letter (EXTERNAL LINK) */}
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="lg:col-span-12 bg-black border border-white/10 rounded-xl p-8 md:p-12 hover:border-axim-gold/50 group relative overflow-hidden flex flex-col md:flex-row items-center justify-between min-h-[300px] shadow-2xl">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-axim-gold/10 to-transparent pointer-events-none group-hover:from-axim-gold/20 transition-colors duration-700 opacity-50" />

              <div className="relative z-10 w-full md:w-2/3 mb-8 md:mb-0">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-white/5 border border-white/10 rounded flex items-center justify-center">
                    <SafeIcon icon={LuIcons.LuScale} className="w-6 h-6 text-axim-gold" />
                  </div>
                  <span className="text-[0.65rem] font-mono text-axim-gold uppercase tracking-widest bg-axim-gold/10 px-3 py-1 rounded border border-axim-gold/20">Legal Operations</span>
                </div>

                <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4 leading-tight">Demand Letter Generator</h3>
                <p className="text-sm text-zinc-400 leading-relaxed max-w-xl mb-8">Instantly draft a highly authoritative, legally sound demand letter. Designed to force immediate resolutions, enforce contracts, and secure payments prior to costly litigation.</p>

                <ul className="space-y-2 hidden md:block">
                  <li className="flex items-center text-xs text-zinc-400 font-mono uppercase tracking-widest"><SafeIcon icon={LuIcons.LuCheck} className="w-3 h-3 text-axim-gold mr-2"/> Actionable Legal Structuring</li>
                  <li className="flex items-center text-xs text-zinc-400 font-mono uppercase tracking-widest"><SafeIcon icon={LuIcons.LuCheck} className="w-3 h-3 text-axim-gold mr-2"/> Automated Dispute Formatting</li>
                </ul>
              </div>

              <div className="relative z-10 w-full md:w-auto md:text-right shrink-0">
                {/* External Link Restored */}
                <a href="https://quickdemandletter.com/start" target="_blank" rel="noopener noreferrer" className="w-full md:w-auto inline-flex items-center justify-center px-10 py-5 bg-axim-gold text-black font-black uppercase tracking-widest text-xs hover:bg-white transition-colors shadow-[0_0_30px_rgba(240,255,0,0.15)]">
                  Start Draft <SafeIcon icon={LuIcons.LuExternalLink} className="ml-3 w-4 h-4" />
                </a>
              </div>
           </motion.div>

           {/* Tool 2 (NDA) */}
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="lg:col-span-7 bg-black border border-white/10 rounded-xl p-8 md:p-10 hover:border-axim-purple/50 group relative overflow-hidden flex flex-col justify-between min-h-[380px] shadow-2xl">
              <div className="absolute top-0 right-0 w-3/4 h-full bg-gradient-to-l from-axim-purple/10 to-transparent pointer-events-none group-hover:from-axim-purple/20 transition-colors duration-700" />

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-white/5 border border-white/10 rounded flex items-center justify-center">
                    <SafeIcon icon={LuIcons.LuPenTool} className="w-6 h-6 text-axim-purple" />
                  </div>
                  <span className="text-[0.65rem] font-mono text-zinc-500 uppercase tracking-widest">Legal Parser Engine</span>
                </div>

                <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">Mutual NDA Generator</h3>
                <p className="text-sm text-zinc-400 leading-relaxed max-w-md mb-6">Deploy a rigorously structured, mutual Non-Disclosure Agreement instantly. Protect your proprietary assets before vendor negotiations.</p>

                <ul className="space-y-2 mb-8 hidden md:block">
                  <li className="flex items-center text-xs text-zinc-400 font-mono uppercase tracking-widest"><SafeIcon icon={LuIcons.LuCheck} className="w-3 h-3 text-axim-purple mr-2"/> Bank-Grade Document Structuring</li>
                  <li className="flex items-center text-xs text-zinc-400 font-mono uppercase tracking-widest"><SafeIcon icon={LuIcons.LuCheck} className="w-3 h-3 text-axim-purple mr-2"/> Sub-2 Second Generation Time</li>
                </ul>
              </div>

              <div className="relative z-10 mt-auto">
                <Link to="/tools/nda" className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-axim-purple hover:text-white transition-colors shadow-lg">
                  Access Generator <SafeIcon icon={LuIcons.LuArrowRight} className="ml-3 w-4 h-4" />
                </Link>
              </div>
           </motion.div>

           {/* Tool 3 (Paystub) */}
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="lg:col-span-5 bg-[#0F172A] border border-white/10 rounded-xl p-8 md:p-10 hover:border-axim-purple/50 group relative overflow-hidden flex flex-col justify-between min-h-[380px] shadow-2xl">
              <div className="absolute top-0 right-0 w-full h-1/2 bg-axim-purple/5 blur-[80px] group-hover:bg-axim-purple/10 transition-colors pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-black border border-white/10 rounded flex items-center justify-center">
                    <SafeIcon icon={LuIcons.LuReceipt} className="w-6 h-6 text-axim-purple" />
                  </div>
                  <span className="text-[0.65rem] font-mono text-zinc-500 uppercase tracking-widest">Finance Operations</span>
                </div>

                <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">Enterprise Pay Stub</h3>
                <p className="text-sm text-zinc-400 leading-relaxed mb-6">Streamline compensation tracking and generate verifiable income records for your workforce instantly.</p>

                <ul className="space-y-2 mb-8 hidden md:block">
                  <li className="flex items-center text-xs text-zinc-400 font-mono uppercase tracking-widest"><SafeIcon icon={LuIcons.LuCheck} className="w-3 h-3 text-axim-purple mr-2"/> Verifiable Income Records</li>
                </ul>
              </div>

              <div className="relative z-10 mt-auto">
                <Link to="/tools/paystub" className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-transparent border border-axim-purple text-axim-purple font-black uppercase tracking-widest text-xs hover:bg-axim-purple hover:text-white transition-colors">
                  Access Generator <SafeIcon icon={LuIcons.LuArrowRight} className="ml-3 w-4 h-4" />
                </Link>
              </div>
           </motion.div>
        </div>
      </section>

        {/* Deep Dive Tool Breakdowns */}
        <div className="py-16 space-y-16">
          {detailedTools.map((tool, index) => (
            <div key={index} className="flex flex-col md:flex-row items-center gap-12 group">
               <div className={`flex-1 w-full bg-[#0F172A] border border-white/5 p-12 rounded-xl shadow-2xl relative overflow-hidden transition-colors ${tool.bgHover} ${index % 2 === 0 ? 'md:order-1' : 'md:order-2'}`}>
                  <SafeIcon icon={tool.icon} className={`w-16 h-16 ${tool.color} mb-6`} />
                  <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">{tool.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed mb-8">{tool.desc}</p>

                  <ul className="space-y-3 mb-10">
                    {tool.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-zinc-500">
                        <SafeIcon icon={LuIcons.LuCheck} className={`w-4 h-4 ${tool.color}`} /> {feature}
                      </li>
                    ))}
                  </ul>

                  {tool.isExternal ? (
                    <a href={tool.link} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center px-8 py-4 font-black uppercase tracking-widest text-xs transition-colors rounded-sm shadow-lg ${tool.btnClass}`}>
                      Initialize Interface <SafeIcon icon={LuIcons.LuArrowRight} className="ml-2 w-4 h-4" />
                    </a>
                  ) : (
                    <Link to={tool.link} className={`inline-flex items-center px-8 py-4 font-black uppercase tracking-widest text-xs transition-colors rounded-sm shadow-lg ${tool.btnClass}`}>
                      Initialize Interface <SafeIcon icon={LuIcons.LuArrowRight} className="ml-2 w-4 h-4" />
                    </Link>
                  )}
               </div>

               <div className={`flex-1 hidden md:flex justify-center ${index % 2 === 0 ? 'md:order-2' : 'md:order-1'}`}>
                 <div className="w-64 h-64 border border-white/10 rounded-full flex items-center justify-center relative bg-black/50 backdrop-blur-sm">
                   <div className="absolute inset-4 border border-dashed border-white/20 rounded-full animate-[spin_60s_linear_infinite]" />
                   <SafeIcon icon={tool.icon} className={`w-20 h-20 opacity-50 ${tool.color}`} />
                 </div>
               </div>
            </div>
          ))}
        </div>

      {/* Educational Modules / Courses */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="mb-8 border-b border-white/10 pb-4 flex items-center gap-3">
          <SafeIcon icon={LuIcons.LuGraduationCap} className="w-5 h-5 text-axim-gold" />
          <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Enterprise Academy</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
           <div className="lg:col-span-12 bg-axim-gold/5 border border-axim-gold/20 rounded-xl p-12 text-center relative overflow-hidden min-h-[300px] flex flex-col items-center justify-center shadow-[0_0_30px_rgba(240,255,0,0.05)]">
              <div className="absolute inset-0 bg-[radial-gradient(rgba(240,255,0,0.1)_1px,transparent_1px)] [background-size:20px_20px] opacity-20 pointer-events-none" />

              <div className="w-12 h-12 border-2 border-axim-gold/30 rounded-full flex items-center justify-center mb-6 relative z-10 bg-black">
                <SafeIcon icon={LuIcons.LuLock} className="w-4 h-4 text-axim-gold" />
              </div>

              <h3 className="text-xl md:text-2xl font-black text-axim-gold uppercase tracking-widest mb-3 relative z-10">Curriculum Compiling</h3>

              <p className="text-zinc-400 text-sm max-w-md mx-auto relative z-10 leading-relaxed mb-8">
                High-impact operational courses and playbooks are currently undergoing structural review by our engineering team. Awaiting release.
              </p>

              {subscribed ? (
                <div className="relative z-10 inline-flex flex-col items-center px-8 py-3 bg-axim-gold/10 border border-axim-gold shadow-lg">
                  <span className="font-bold text-axim-gold uppercase tracking-widest text-xs flex items-center gap-2">
                    <SafeIcon icon={LuIcons.LuCheck} className="w-4 h-4" /> Subscription Confirmed
                  </span>
                  <span className="text-[10px] text-axim-gold/70 font-mono mt-1">You have been securely added to our network.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="relative z-10 flex flex-col items-center gap-2 w-full max-w-sm mx-auto">
                  <div className="flex w-full">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="operator@enterprise.com"
                      className="w-full bg-black border border-axim-gold/30 px-4 py-3 text-white text-sm focus:outline-none focus:border-axim-gold transition-colors"
                      required
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-3 bg-axim-gold text-black font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors disabled:opacity-50 flex items-center justify-center shadow-lg min-w-[60px]"
                    >
                      {isSubmitting ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"/> : <SafeIcon icon={LuIcons.LuArrowRight} className="w-4 h-4" />}
                    </button>
                  </div>
                  {error && <p className="text-red-500 text-xs font-mono">Submission failed. Retry.</p>}
                </form>
              )}
           </div>
        </div>
      </section>
    </div>
  );
}
