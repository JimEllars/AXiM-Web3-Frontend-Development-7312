import React from 'react';
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
import { useState } from 'react';
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
      <SEO title="Our Offerings | Smart Systems" description="Smart products and services built to make your life easier." customSchema={[toolsSchema]} />

      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:40px_40px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white leading-tight mb-4">
            Digital <span className="text-axim-purple">Byproducts.</span>
          </h1>
          <p className="text-zinc-400 max-w-2xl text-sm md:text-base leading-relaxed">
            Enterprise-grade generators and strategic courses designed to eliminate operational friction. Select an offering to vault it to your secure profile.
          </p>
        </div>
      </section>

      {/* Autonomous Tools Collage */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 mb-20">
        <div className="mb-8 border-b border-white/10 pb-4 flex items-center gap-3">
          <SafeIcon icon={LuIcons.LuCpu} className="w-5 h-5 text-axim-purple" />
          <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Autonomous Generators</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
           {/* Tool 1 (NDA) */}
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="lg:col-span-7 bg-black border border-white/10 rounded-sm p-8 md:p-12 hover:border-axim-purple/50 group relative overflow-hidden flex flex-col justify-between min-h-[300px]">
              <div className="absolute top-0 right-0 w-1/2 h-full bg-axim-purple/10 blur-[100px] group-hover:bg-axim-purple/20 transition-colors pointer-events-none" />
              <div className="relative z-10">
                <SafeIcon icon={LuIcons.LuSignature} className="w-8 h-8 text-axim-purple mb-6" />
                <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">Mutual NDA Generator</h3>
                <p className="text-sm text-zinc-400 leading-relaxed max-w-sm">Instantly deploy a rigorously structured, mutual Non-Disclosure Agreement before entering vendor negotiations.</p>
              </div>
              <div className="relative z-10 mt-8">
                <button onClick={(e) => { e.preventDefault(); handleLaunchTool({id: 'nda_generator', title: 'Mutual NDA Generator'}); }} className="inline-flex items-center px-6 py-3 bg-white/5 border border-white/10 text-white font-bold uppercase tracking-widest text-xs hover:bg-axim-purple hover:border-axim-purple transition-colors">
                  Vault Tool <SafeIcon icon={LuIcons.LuArrowRight} className="ml-2 w-4 h-4" />
                </button>
              </div>
           </motion.div>

           {/* Tool 2 (Paystub) */}
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="lg:col-span-5 bg-black border border-white/10 rounded-sm p-8 md:p-12 hover:border-axim-purple/50 group relative overflow-hidden flex flex-col justify-between min-h-[300px]">
              <div className="absolute top-0 right-0 w-full h-1/2 bg-axim-purple/10 blur-[80px] group-hover:bg-axim-purple/20 transition-colors pointer-events-none" />
              <div className="relative z-10">
                <SafeIcon icon={LuIcons.LuReceipt} className="w-8 h-8 text-axim-purple mb-6" />
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">Enterprise Pay Stub</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">Streamline compensation tracking and generate verifiable income records for your workforce instantly.</p>
              </div>
              <div className="relative z-10 mt-8">
                <button onClick={(e) => { e.preventDefault(); handleLaunchTool({id: 'paystub_generator', title: 'Pay Stub Generator'}); }} className="inline-flex items-center px-6 py-3 bg-white/5 border border-white/10 text-white font-bold uppercase tracking-widest text-xs hover:bg-axim-purple hover:border-axim-purple transition-colors">
                  Vault Tool <SafeIcon icon={LuIcons.LuArrowRight} className="ml-2 w-4 h-4" />
                </button>
              </div>
           </motion.div>
        </div>
      </section>

      {/* Enterprise Academy Collage */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="mb-8 border-b border-white/10 pb-4 flex items-center gap-3">
          <SafeIcon icon={LuIcons.LuGraduationCap} className="w-5 h-5 text-axim-gold" />
          <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Enterprise Academy</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
           <div className="lg:col-span-12 bg-axim-gold/5 border border-axim-gold/20 rounded-sm p-12 text-center relative overflow-hidden min-h-[250px] flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-2 border-axim-gold/30 rounded-full flex items-center justify-center mb-4">
                <div className="w-4 h-4 bg-axim-gold rounded-full animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-axim-gold uppercase tracking-widest mb-2">Curriculum Compiling</h3>
              <p className="text-zinc-400 text-sm max-w-md mx-auto">High-impact operational courses are currently undergoing structural review. Awaiting transmission.</p>
           </div>
        </div>
      </section>

      {queueToast && (
        <div className="fixed bottom-6 right-6 bg-axim-gold text-black px-6 py-4 rounded-sm shadow-[0_0_20px_rgba(240,255,0,0.3)] font-mono text-xs uppercase tracking-widest z-50 flex items-center gap-3">
          <div className="w-2 h-2 bg-black rounded-full animate-pulse" />
          {queueToast}
        </div>
      )}
    </div>
  );
}
