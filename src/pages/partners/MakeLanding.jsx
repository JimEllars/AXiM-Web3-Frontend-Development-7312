import React from 'react';
import SEO from '../../components/SEO';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';

export default function MakeLanding() {
  const affiliateLink = "https://www.make.com/en/register?pc=aximpartner";

  const makeSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Make.com Automation",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "description": "Free tier available via AXiM Systems integration."
    },
    "publisher": {
      "@type": "Organization",
      "name": "Make"
    },
    "review": {
      "@type": "Review",
      "author": {
        "@type": "Organization",
        "name": "AXiM Systems"
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      },
      "reviewBody": "The premier visual automation platform for scaling decentralized architecture and streamlining business operations without writing code."
    }
  };

  return (
    <div className="w-full min-h-screen bg-bg-void relative z-10 pb-32">
      <SEO
        title="Scale with Make.com | AXiM Partner Network"
        description="Automate your workflows and scale your architecture instantly with Make.com. Get started via the AXiM integration portal."
        customSchema={[makeSchema]}
      />

      {/* Hero Section */}
      <section className="pt-32 pb-16 relative overflow-hidden bg-black border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(147,51,234,0.1),transparent_50%)] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <div className="text-white text-4xl md:text-6xl font-black tracking-tight mb-6">make</div>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white leading-tight mb-6">
            Scale Operations <br/><span className="text-axim-purple">Without Code.</span>
          </h1>
          <p className="text-zinc-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed mb-10">
            AXiM Systems relies on Make.com's visual automation engine to route our complex backend architecture. Connect thousands of apps, design infinitely scalable workflows, and eliminate manual data entry.
          </p>
          <a href={affiliateLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-10 py-5 bg-gradient-to-r from-[#9333EA] to-[#DB2777] text-white font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform shadow-[0_0_30px_rgba(147,51,234,0.3)] rounded-sm">
            Initialize Free Account <SafeIcon icon={LuIcons.LuArrowRight} className="ml-3 w-4 h-4" />
          </a>
        </div>
      </section>

      {/* Value Matrix */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="flex items-center gap-3 mb-10 border-b border-white/10 pb-4">
          <SafeIcon icon={LuIcons.LuCpu} className="w-6 h-6 text-axim-purple" />
          <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Integration Capabilities</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-[#0F172A] border border-white/10 p-8 rounded-sm shadow-xl hover:border-axim-purple/50 transition-colors">
             <SafeIcon icon={LuIcons.LuWorkflow} className="w-8 h-8 text-[#DB2777] mb-4" />
             <h3 className="text-white font-black uppercase tracking-widest text-sm mb-2">Visual Logic Builder</h3>
             <p className="text-xs text-zinc-400 leading-relaxed">Drag and drop applications to create complex logical loops, webhooks, and data routers without managing server infrastructure.</p>
           </div>
           <div className="bg-[#0F172A] border border-white/10 p-8 rounded-sm shadow-xl hover:border-axim-purple/50 transition-colors">
             <SafeIcon icon={LuIcons.LuDatabase} className="w-8 h-8 text-[#9333EA] mb-4" />
             <h3 className="text-white font-black uppercase tracking-widest text-sm mb-2">1000+ Native Endpoints</h3>
             <p className="text-xs text-zinc-400 leading-relaxed">Instantly connect to CRM pipelines, SQL databases, Stripe payments, and OpenAI nodes with pre-built authentication.</p>
           </div>
        </div>
      </section>
    </div>
  );
}
