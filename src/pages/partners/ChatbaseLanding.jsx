import React from 'react';
import SEO from '../../components/SEO';
import SafeIcon from '../../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';

export default function ChatbaseLanding() {
  const affiliateLink = "https://link.chatbase.co/jrellars";

  const chatbaseSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Chatbase AI Customer Service Platform",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "provider": {
      "@type": "Organization",
      "name": "AXiM Partner Network"
    },
    "description": "Custom ChatGPT for your website. Train an autonomous AI concierge on your enterprise data to handle customer support and lead generation.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "description": "Free tier available via AXiM Systems partner portal."
    }
  };

  return (
    <div className="w-full min-h-screen bg-bg-void relative z-10 pb-32">
      <SEO
        title="Deploy AI Agents | AXiM x Chatbase"
        description="Build an autonomous AI customer support agent trained on your own data. Deploy to your website in minutes via our Chatbase partner network."
        customSchema={[chatbaseSchema]}
      />

      {/* Hero Section */}
      <section className="pt-32 pb-16 relative overflow-hidden bg-black border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(219,39,119,0.15),transparent_50%)] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <SafeIcon icon={LuIcons.LuBot} className="w-12 h-12 text-[#DB2777] mx-auto mb-6" />
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white leading-tight mb-6">
            Autonomous AI <br/><span className="text-[#DB2777]">Support Concierge.</span>
          </h1>
          <p className="text-zinc-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed mb-10">
            Stop losing leads and frustrating customers with slow response times. AXiM has partnered with Chatbase to help you deploy a custom ChatGPT agent trained exclusively on your business data, ready to automate support and triage in minutes.
          </p>
          <a href={affiliateLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-10 py-5 bg-[#DB2777] text-white font-black uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-colors shadow-[0_0_30px_rgba(219,39,119,0.3)] rounded-sm">
            Initialize Platform <SafeIcon icon={LuIcons.LuArrowRight} className="ml-3 w-4 h-4" />
          </a>
        </div>
      </section>

      {/* Value Matrix */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="flex items-center gap-3 mb-10 border-b border-white/10 pb-4">
          <SafeIcon icon={LuIcons.LuCpu} className="w-6 h-6 text-[#DB2777]" />
          <h2 className="text-2xl font-black uppercase tracking-tighter text-white">System Capabilities</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-[#0F172A] border border-white/10 p-8 rounded-sm shadow-xl hover:border-[#DB2777]/50 transition-colors">
             <SafeIcon icon={LuIcons.LuDatabase} className="w-8 h-8 text-axim-purple mb-4" />
             <h3 className="text-white font-black uppercase tracking-widest text-sm mb-2">Custom Knowledge Ingestion</h3>
             <p className="text-xs text-zinc-400 leading-relaxed">Securely upload PDFs, manuals, or simply input your website URL. The engine crawls your data to instantly build a specialized knowledge base for your AI.</p>
           </div>
           <div className="bg-[#0F172A] border border-white/10 p-8 rounded-sm shadow-xl hover:border-[#DB2777]/50 transition-colors">
             <SafeIcon icon={LuIcons.LuWorkflow} className="w-8 h-8 text-axim-gold mb-4" />
             <h3 className="text-white font-black uppercase tracking-widest text-sm mb-2">Omnichannel Integration</h3>
             <p className="text-xs text-zinc-400 leading-relaxed">Embed your agent directly into your frontend facade or sync it with Slack, WhatsApp, Make.com, and Zendesk for seamless global triage.</p>
           </div>
        </div>
      </section>
    </div>
  );
}
