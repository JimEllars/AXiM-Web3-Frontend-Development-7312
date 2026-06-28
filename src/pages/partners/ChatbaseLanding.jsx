import React from 'react';
import { logTelemetry } from '../../lib/telemetry';
import SEO from '../../components/SEO';
import SafeIcon from '../../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';

export default function ChatbaseLanding() {
  const affiliateLink = "https://link.chatbase.co/jrellars?via=axim_hub";

  const handlePartnerRedirect = async (e, placement) => {
    e.preventDefault();

    // Promise-backed telemetry handler
    await new Promise(resolve => {
      logTelemetry('PARTNER_FUNNEL_REDIRECT', { destination: 'chatbase', origin: 'axim_hub', placement });
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "outbound_partner_click", {
          event_category: "conversion",
          event_label: "chatbase"
        });
      }
      setTimeout(resolve, 150);
    });

    window.open(affiliateLink, '_blank', 'noopener,noreferrer');
  };

  const chatbaseAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Chatbase AI Customer Service Platform",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "provider": {
      "@type": "Organization",
      "name": "AXiM Partner Grid"
    },
    "description": "Custom ChatGPT for your website. Train an autonomous AI concierge on your data to handle support and capture leads.",
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
        title="Custom AI Chatbot | AXiM x Chatbase"
        description="Deploy a custom ChatGPT agent trained exclusively on your business data. Automate customer support and capture leads 24/7."
        customSchema={[chatbaseAppSchema]}
      />

      {/* Hero Canvas */}
      <section className="pt-32 pb-24 relative overflow-hidden bg-black border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(219,39,119,0.15),transparent_60%)] pointer-events-none" />
        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
          <div className="w-14 h-14 bg-gradient-to-br from-[#DB2777] to-pink-600 rounded flex items-center justify-center mx-auto mb-6 shadow-[0_0_25px_rgba(219,39,119,0.4)]">
            <SafeIcon icon={LuIcons.LuBot} className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-white leading-none mb-6">
            Your Dedicated 24/7 <br/><span className="text-[#DB2777]">AI Support Agent.</span>
          </h1>
          <p className="text-zinc-400 text-sm md:text-base max-w-3xl mx-auto leading-relaxed mb-12">
            Stop losing leads and frustrating customers with slow email responses. AXiM's partnership with Chatbase empowers you to build a custom ChatGPT agent trained exclusively on your own business documents and website. Deploy it in minutes to answer questions and capture new clients around the clock.
          </p>
          <a href={affiliateLink} onClick={(e) => handlePartnerRedirect(e, 'conversion_button')} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-10 py-5 bg-[#DB2777] text-white font-black uppercase tracking-widest text-xs hover:bg-white hover:text-black hover:shadow-[0_0_40px_currentColor]  transition-colors shadow-[0_0_30px_rgba(219,39,119,0.3)] rounded-sm">
            Build Your Agent for Free <SafeIcon icon={LuIcons.LuArrowRight} className="ml-3 w-4 h-4" />
          </a>
        </div>
      </section>

      {/* Normalized Training Vectors Matrix */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex items-center gap-3 mb-10 border-b border-white/10 pb-4">
          <SafeIcon icon={LuIcons.LuBrainCircuit} className="w-6 h-6 text-[#DB2777]" />
          <h2 className="text-2xl font-black uppercase tracking-tighter text-white">How Your AI Learns</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-[#050505] border border-white/5 p-8 rounded-sm shadow-xl hover:border-[#DB2777]/30 transition-colors">
             <div className="text-[#DB2777] text-xs font-mono uppercase tracking-widest mb-3 flex items-center gap-2">
               <SafeIcon icon={LuIcons.LuFileSpreadsheet} className="w-4 h-4" /> 01 // Upload Documents
             </div>
             <h3 className="text-white font-black text-lg uppercase tracking-tight mb-2">Read Your Manuals</h3>
             <p className="text-xs text-zinc-400 leading-relaxed">Securely upload your PDFs, Word documents, policy guides, and pricing sheets. The AI reads them instantly so it knows exactly how to answer customer questions based on your specific rules.</p>
           </div>
           <div className="bg-[#050505] border border-white/5 p-8 rounded-sm shadow-xl hover:border-[#DB2777]/30 transition-colors">
             <div className="text-[#DB2777] text-xs font-mono uppercase tracking-widest mb-3 flex items-center gap-2">
               <SafeIcon icon={LuIcons.LuGlobe} className="w-4 h-4" /> 02 // Scan Your Site
             </div>
             <h3 className="text-white font-black text-lg uppercase tracking-tight mb-2">Automatic Website Sync</h3>
             <p className="text-xs text-zinc-400 leading-relaxed">Simply type in your website URL. Chatbase will automatically scan all of your public pages and FAQs. Best of all, it can auto-sync, meaning your AI gets smarter every time you update your website.</p>
           </div>
           <div className="bg-[#050505] border border-white/5 p-8 rounded-sm shadow-xl hover:border-[#DB2777]/30 transition-colors">
             <div className="text-[#DB2777] text-xs font-mono uppercase tracking-widest mb-3 flex items-center gap-2">
               <SafeIcon icon={LuIcons.LuSparkles} className="w-4 h-4" /> 03 // Collect Information
             </div>
             <h3 className="text-white font-black text-lg uppercase tracking-tight mb-2">Built-In Lead Capture</h3>
             <p className="text-xs text-zinc-400 leading-relaxed">Turn conversations into clients. Set up your bot to ask for a user's name, email, and phone number before or after answering their question, passing warm leads directly to your sales team.</p>
           </div>
        </div>
      </section>

      {/* Integration Workflow Steps */}
      <section className="bg-[#0F172A] border-y border-white/10 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black uppercase tracking-tighter text-white mb-4">Go Live In Minutes</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-sm">You don't need to be a programmer to launch your own AI assistant.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
               <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white font-black mx-auto mb-4 text-xl">1</div>
               <h4 className="text-white font-black uppercase tracking-widest text-sm mb-3">Provide Your Data</h4>
               <p className="text-zinc-400 text-xs leading-relaxed px-4">Upload your files or paste your website link. The system takes seconds to read and memorize your business information.</p>
            </div>
            <div>
               <div className="w-12 h-12 rounded-full bg-[#DB2777]/10 border border-[#DB2777]/30 flex items-center justify-center text-[#DB2777] font-black mx-auto mb-4 text-xl">2</div>
               <h4 className="text-white font-black uppercase tracking-widest text-sm mb-3">Set The Rules</h4>
               <p className="text-zinc-400 text-xs leading-relaxed px-4">Give your bot a name, pick its colors to match your brand, and give it instructions on how friendly or professional it should sound.</p>
            </div>
            <div>
               <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white font-black mx-auto mb-4 text-xl">3</div>
               <h4 className="text-white font-black uppercase tracking-widest text-sm mb-3">Embed On Your Site</h4>
               <p className="text-zinc-400 text-xs leading-relaxed px-4">Copy a tiny snippet of code and paste it into your website builder (like WordPress, Wix, or Shopify). Your agent will appear instantly in the bottom corner!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise FAQ Matrix */}
      <section className="max-w-4xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black uppercase tracking-tighter text-white mb-4">Frequently Asked Questions</h2>
          <div className="w-12 h-1 bg-[#DB2777] mx-auto rounded-full" />
        </div>
        <div className="space-y-6">
          <div className="bg-[#050505] border border-white/5 p-6 md:p-8 rounded-sm">
            <h3 className="text-white font-black text-lg uppercase tracking-tight mb-3 flex items-center gap-3">
              <SafeIcon icon={LuIcons.LuMessageSquareOff} className="w-5 h-5 text-[#DB2777]" /> Will the AI make up wrong answers?
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">No. Chatbase allows you to enforce strict "Base Prompts" and boundary guardrails. You can configure the agent to politely decline any queries that fall outside of your uploaded documentation, preventing hallucinations.</p>
          </div>
          <div className="bg-[#050505] border border-white/5 p-6 md:p-8 rounded-sm">
            <h3 className="text-white font-black text-lg uppercase tracking-tight mb-3 flex items-center gap-3">
              <SafeIcon icon={LuIcons.LuRefreshCw} className="w-5 h-5 text-[#DB2777]" /> How do I update its knowledge?
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">If you sync your agent to your website URL, it can be set to automatically re-crawl your domain periodically. If you use PDF manuals, simply upload the new version to the Chatbase dashboard and the AI's brain is instantly retrained.</p>
          </div>
        </div>
      </section>

      {/* Final Conversion Block */}
      <section className="py-24 relative overflow-hidden bg-black text-center">
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white mb-6">Automate Your Support. <br/>Capture Every Lead.</h2>
          <p className="text-zinc-400 text-sm mb-10">Give your customers the instant, accurate answers they demand while freeing up your team to focus on growing the business.</p>
          <a href={affiliateLink} onClick={(e) => handlePartnerRedirect(e, 'conversion_button')} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-12 py-5 bg-[#DB2777] text-white font-black uppercase tracking-widest text-xs hover:bg-white hover:text-black hover:shadow-[0_0_40px_currentColor]  transition-colors shadow-[0_0_30px_rgba(219,39,119,0.3)] rounded-sm">
            Build Your Agent Free <SafeIcon icon={LuIcons.LuArrowUpRight} className="ml-3 w-4 h-4" />
          </a>
        </div>
      </section>
    </div>
  );
}
