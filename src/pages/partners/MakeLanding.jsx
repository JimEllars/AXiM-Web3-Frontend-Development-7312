import { logTelemetry } from '../../lib/telemetry';
import React from 'react';
import SEO from '../../components/SEO';
import SafeIcon from '../../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';

export default function MakeLanding() {
  const affiliateLink = "https://www.make.com/en/register?pc=aximpartner";

  const handleOutboundClick = (placement) => {
    // 1. Log to AXiM internal telemetry
    logTelemetry('PARTNER_FUNNEL_CLICK', { partner: 'make', placement });

    // 2. Log to external Google Analytics
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "outbound_partner_click", {
        event_category: "conversion",
        event_label: "Make.com"
      });
    }
  };

  const makeAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Make.com Automation Architecture via AXiM Systems",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "provider": {
      "@type": "Organization",
      "name": "AXiM Partner Grid"
    },
    "description": "Visual automation platform. Connect your favorite apps and automate repetitive workflows without writing code.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <div className="w-full min-h-screen bg-bg-void relative z-10 pb-32">
      <SEO
        title="Visual Automation Platform | AXiM x Make"
        description="Connect your favorite apps and automate repetitive workflows without writing code. Reclaim thousands of hours of manual labor."
        customSchema={[makeAppSchema]}
      />

      {/* Saturated Neon Purple Hero Canvas */}
      <section className="pt-32 pb-24 relative overflow-hidden bg-black border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(147,51,234,0.15),transparent_60%)] pointer-events-none" />
        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
          <div className="w-14 h-14 bg-gradient-to-br from-axim-purple to-indigo-600 rounded flex items-center justify-center mx-auto mb-6 shadow-[0_0_25px_rgba(147,51,234,0.4)]">
            <SafeIcon icon={LuIcons.LuCpu} className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-white leading-none mb-6">
            The Visual AI Automation<br/><span className="text-axim-purple">Platform.</span>
          </h1>
          <p className="text-zinc-400 text-sm md:text-base max-w-3xl mx-auto leading-relaxed mb-12">
            Stop wasting your team's time on repetitive, manual data entry. AXiM's preferred integration with Make.com allows anyone to visually connect data sources, AI models, and thousands of popular apps to build agentic workflows 24/7.
          </p>
          <a href={affiliateLink} onClick={() => handleOutboundClick('hero_button')} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-10 py-5 bg-axim-purple text-white font-black uppercase tracking-widest text-xs hover:bg-white hover:text-black hover:shadow-[0_0_40px_currentColor]  transition-colors shadow-[0_0_30px_rgba(147,51,234,0.3)] rounded-sm">
            Start Automating for Free <SafeIcon icon={LuIcons.LuArrowRight} className="ml-3 w-4 h-4" />
          </a>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-8 bg-[#050505] border-b border-white/5">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest mb-4">Trusted by innovators at</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 text-zinc-600 font-black text-sm md:text-base uppercase tracking-wider grayscale opacity-70">
            <span>BambooHR</span>
            <span>BNY</span>
            <span>Bolt</span>
            <span>& More</span>
          </div>
        </div>
      </section>

      {/* Normalized Technical Matrix */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex items-center gap-3 mb-10 border-b border-white/10 pb-4">
          <SafeIcon icon={LuIcons.LuWorkflow} className="w-6 h-6 text-axim-purple" />
          <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Why Make Outperforms The Competition</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-[#050505] border border-white/5 p-8 rounded-sm shadow-xl hover:border-axim-purple/30 transition-colors">
             <div className="text-axim-purple text-xs font-mono uppercase tracking-widest mb-3 flex items-center gap-2">
               <SafeIcon icon={LuIcons.LuActivity} className="w-4 h-4" /> 01 // Seamless Connections
             </div>
             <h3 className="text-white font-black text-lg uppercase tracking-tight mb-2">Connect Any App</h3>
             <p className="text-xs text-zinc-400 leading-relaxed">Choose from thousands of pre-built integrations like Gmail, Slack, HubSpot, and Google Sheets, or connect to any custom API instantly. If it exists on the web, Make can talk to it.</p>
           </div>
           <div className="bg-[#050505] border border-white/5 p-8 rounded-sm shadow-xl hover:border-axim-purple/30 transition-colors">
             <div className="text-axim-purple text-xs font-mono uppercase tracking-widest mb-3 flex items-center gap-2">
               <SafeIcon icon={LuIcons.LuBinary} className="w-4 h-4" /> 02 // Smart Decisions
             </div>
             <h3 className="text-white font-black text-lg uppercase tracking-tight mb-2">Visual Logic Pathways</h3>
             <p className="text-xs text-zinc-400 leading-relaxed">Don't just move data—filter it. Build workflows that make decisions on the fly. Automatically route high-value leads to your sales team while sending low-value inquiries to an email drip campaign.</p>
           </div>
           <div className="bg-[#050505] border border-white/5 p-8 rounded-sm shadow-xl hover:border-axim-purple/30 transition-colors">
             <div className="text-axim-purple text-xs font-mono uppercase tracking-widest mb-3 flex items-center gap-2">
               <SafeIcon icon={LuIcons.LuShieldCheck} className="w-4 h-4" /> 03 // Peace of Mind
             </div>
             <h3 className="text-white font-black text-lg uppercase tracking-tight mb-2">Built-In Error Handling</h3>
             <p className="text-xs text-zinc-400 leading-relaxed">Never lose a lead to a broken connection again. If an app goes down, Make allows you to build backup pathways to pause the workflow or notify your team instantly on Slack.</p>
           </div>
        </div>
      </section>

      {/* Enterprise Use Cases */}
      <section className="bg-[#0F172A] border-y border-white/10 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black uppercase tracking-tighter text-white mb-4">Real-World Use Cases</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-sm">How modern businesses are using visual automation to scale efficiently.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="flex gap-6">
               <SafeIcon icon={LuIcons.LuUsers} className="w-8 h-8 text-axim-purple shrink-0" />
               <div>
                 <h4 className="text-white font-black uppercase tracking-widest text-sm mb-2">Instant Lead Follow-Up</h4>
                 <p className="text-zinc-400 text-xs leading-relaxed">When a new customer fills out a form on your website, Make instantly adds their info to your CRM, signs them up for your newsletter, and sends a welcome email—before your sales team even wakes up.</p>
               </div>
            </div>
            <div className="flex gap-6">
               <SafeIcon icon={LuIcons.LuBellRing} className="w-8 h-8 text-axim-purple shrink-0" />
               <div>
                 <h4 className="text-white font-black uppercase tracking-widest text-sm mb-2">Automated Payment Alerts</h4>
                 <p className="text-zinc-400 text-xs leading-relaxed">Connect Stripe to your company Slack. Whenever a customer makes a purchase or a subscription payment fails, your team gets an instant, formatted notification so they can take immediate action.</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise FAQ Matrix */}
      <section className="max-w-4xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black uppercase tracking-tighter text-white mb-4">Frequently Asked Questions</h2>
          <div className="w-12 h-1 bg-axim-purple mx-auto rounded-full" />
        </div>
        <div className="space-y-6">
          <div className="bg-[#050505] border border-white/5 p-6 md:p-8 rounded-sm">
            <h3 className="text-white font-black text-lg uppercase tracking-tight mb-3 flex items-center gap-3">
              <SafeIcon icon={LuIcons.LuCode} className="w-5 h-5 text-axim-purple" /> Do I need coding experience?
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">No. Make utilizes a visual drag-and-drop interface. While understanding basic logic (like IF/THEN statements) is helpful, you can build complex, enterprise-grade architectures without writing a single line of code.</p>
          </div>
          <div className="bg-[#050505] border border-white/5 p-6 md:p-8 rounded-sm">
            <h3 className="text-white font-black text-lg uppercase tracking-tight mb-3 flex items-center gap-3">
              <SafeIcon icon={LuIcons.LuLock} className="w-5 h-5 text-axim-purple" /> How secure is my transferred data?
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">Make operates under strict enterprise security protocols, including GDPR, SOC 3, and SOC 2 Type II compliance. Data in transit is secured using modern TLS encryption, ensuring your operational payloads remain isolated and protected.</p>
          </div>
        </div>
      </section>

      {/* Final Conversion Block */}
      <section className="py-24 relative overflow-hidden bg-black text-center">
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white mb-6">Reclaim Your Time. <br/>Scale Your Impact.</h2>
          <p className="text-zinc-400 text-sm mb-10">Join thousands of operators building robust, automated businesses without the massive overhead of hiring a development team.</p>
          <a href={affiliateLink} onClick={() => handleOutboundClick('footer_button')} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-12 py-5 bg-axim-purple text-white font-black uppercase tracking-widest text-xs hover:bg-white hover:text-black hover:shadow-[0_0_40px_currentColor]  transition-colors shadow-[0_0_30px_rgba(147,51,234,0.3)] rounded-sm">
            Create Your Free Account <SafeIcon icon={LuIcons.LuArrowUpRight} className="ml-3 w-4 h-4" />
          </a>
        </div>
      </section>
      {/* Sticky Mobile CTA */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-[#050505] border-t border-white/10 p-4 z-50 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-white font-black text-xs uppercase tracking-widest">Make.com</span>
          <span className="text-axim-purple text-[0.65rem] font-mono uppercase tracking-widest">Free Account</span>
        </div>
        <a
          href={affiliateLink}
          onClick={() => handleOutboundClick('sticky_mobile')}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 bg-axim-purple text-white font-black uppercase tracking-widest text-[0.65rem] hover:bg-white hover:text-black hover:shadow-[0_0_40px_currentColor]  transition-colors rounded-sm shadow-[0_0_15px_rgba(147,51,234,0.3)]"
        >
          Start Free
        </a>
      </div>
    </div>
  );
}
