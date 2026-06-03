import React from 'react';
import SEO from '../../components/SEO';
import SafeIcon from '../../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';

export default function ChatbaseLanding() {
  const affiliateLink = "https://link.chatbase.co/jrellars";

  const chatbaseAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Chatbase AI Architecture Integration via AXiM Systems",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "provider": {
      "@type": "Organization",
      "name": "AXiM Partner Grid"
    },
    "description": "Custom ChatGPT concierge layer. Process unstructured data and train custom LLM interfaces to manage frontline lead collection.",
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
        title="Custom AI Concierge Framework | AXiM x Chatbase"
        description="Convert unstructured documents into intelligent frontline support agents. Integrate an isolated AI triage module trained on your brand guidelines."
        customSchema={[chatbaseAppSchema]}
      />

      {/* Saturated Neon Magenta Hero Canvas */}
      <section className="pt-32 pb-24 relative overflow-hidden bg-black border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(219,39,119,0.15),transparent_60%)] pointer-events-none" />
        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
          <div className="w-14 h-14 bg-gradient-to-br from-[#DB2777] to-pink-600 rounded flex items-center justify-center mx-auto mb-6 shadow-[0_0_25px_rgba(219,39,119,0.4)]">
            <SafeIcon icon={LuIcons.LuBot} className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white leading-none mb-6">
            Decoupled Custom AI <br/><span className="text-[#DB2777]">Knowledge Ingestion Hub.</span>
          </h1>
          <p className="text-zinc-400 text-sm md:text-base max-w-3xl mx-auto leading-relaxed mb-12">
            Eliminate traditional client-support backlogs completely. Our deployment roadmap with Chatbase empowers enterprise operators to compile unstructured assets (PDF documentation, raw text parameters, nested site maps) and output a firewalled, custom-branded AI chatbot ready to safely capture user data vectors 24/7.
          </p>
          <a href={affiliateLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-10 py-5 bg-[#DB2777] text-white font-black uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-colors shadow-[0_0_30px_rgba(219,39,119,0.3)] rounded-sm">
            Initialize AI Concierge <SafeIcon icon={LuIcons.LuArrowRight} className="ml-3 w-4 h-4" />
          </a>
        </div>
      </section>

      {/* High-Fidelity Training Vectors Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 space-y-24">
        <div>
          <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-4">
            <SafeIcon icon={LuIcons.LuBrainCircuit} className="w-6 h-6 text-[#DB2777]" />
            <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Ingestion Matrix Modalities</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="bg-[#050505] border border-white/5 p-8 rounded-sm shadow-xl hover:border-[#DB2777]/30 transition-colors">
               <div className="text-[#DB2777] text-xs font-mono uppercase tracking-widest mb-3 flex items-center gap-2">
                 <SafeIcon icon={LuIcons.LuFileSpreadsheet} className="w-4 h-4" /> 01 // Unstructured Data
               </div>
               <h3 className="text-white font-black text-lg uppercase tracking-tight mb-2">Document Processing</h3>
               <p className="text-xs text-zinc-400 leading-relaxed">Directly ingest raw internal text data. Upload operational guidelines, policy logs, and pricing data loops to construct explicit behavioral models without code parameters.</p>
             </div>
             <div className="bg-[#050505] border border-white/5 p-8 rounded-sm shadow-xl hover:border-[#DB2777]/30 transition-colors">
               <div className="text-[#DB2777] text-xs font-mono uppercase tracking-widest mb-3 flex items-center gap-2">
                 <SafeIcon icon={LuIcons.LuGlobe} className="w-4 h-4" /> 02 // Automated Scraping
               </div>
               <h3 className="text-white font-black text-lg uppercase tracking-tight mb-2">Recursive URL Crawling</h3>
               <p className="text-xs text-zinc-400 leading-relaxed">Input your target domain path and let the system parse every public endpoint automatically. The chat architecture dynamically updates its reference map whenever your front-end content evolves.</p>
             </div>
             <div className="bg-[#050505] border border-white/5 p-8 rounded-sm shadow-xl hover:border-[#DB2777]/30 transition-colors">
               <div className="text-[#DB2777] text-xs font-mono uppercase tracking-widest mb-3 flex items-center gap-2">
                 <SafeIcon icon={LuIcons.LuSparkles} className="w-4 h-4" /> 03 // Conversion Framing
               </div>
               <h3 className="text-white font-black text-lg uppercase tracking-tight mb-2">Lead Acquisition Forms</h3>
               <p className="text-xs text-zinc-400 leading-relaxed">Configure distinct text capture fields directly within the chatbot conversation block. Collect names, communication channels, and scenario variables seamlessly before executing analytics webhooks.</p>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}
