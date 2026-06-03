import React from 'react';
import SEO from '../../components/SEO';
import SafeIcon from '../../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';

export default function MakeLanding() {
  const affiliateLink = "https://www.make.com/en/register?pc=aximpartner";

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
    "description": "Visual automation backend engine. Connect application architectures and structure infinite logic loops without server overhead.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <div className="w-full min-h-screen bg-bg-void relative z-10 pb-32">
      <SEO
        title="Visual Automation Architecture | AXiM x Make"
        description="Design, build, and automate cross-platform microservices without resource strain. Harness the core visual logic engine used by AXiM."
        customSchema={[makeAppSchema]}
      />

      {/* Hero Canvas */}
      <section className="pt-32 pb-24 relative overflow-hidden bg-black border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(147,51,234,0.15),transparent_60%)] pointer-events-none" />
        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
          <div className="w-14 h-14 bg-gradient-to-br from-axim-purple to-indigo-600 rounded flex items-center justify-center mx-auto mb-6 shadow-[0_0_25px_rgba(147,51,234,0.4)]">
            <SafeIcon icon={LuIcons.LuCpu} className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white leading-none mb-6">
            Infinite Logic Loop <br/><span className="text-axim-purple">Orchestration Engine.</span>
          </h1>
          <p className="text-zinc-400 text-sm md:text-base max-w-3xl mx-auto leading-relaxed mb-12">
            Accelerate system development by bypassing legacy code constraints. Our prioritized integration with Make.com allows operators to link external tools, handle webhooks natively, and deploy recursive micro-service arrays through an intuitive, production-ready drag-and-drop canvas.
          </p>
          <a href={affiliateLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-10 py-5 bg-axim-purple text-white font-black uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-colors shadow-[0_0_30px_rgba(147,51,234,0.3)] rounded-sm">
            Deploy Automation Free <SafeIcon icon={LuIcons.LuArrowRight} className="ml-3 w-4 h-4" />
          </a>
        </div>
      </section>

      {/* Technical Matrix */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex items-center gap-3 mb-10 border-b border-white/10 pb-4">
          <SafeIcon icon={LuIcons.LuWorkflow} className="w-6 h-6 text-axim-purple" />
          <h2 className="text-2xl font-black uppercase tracking-tighter text-white">System Layout Vectors</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-[#050505] border border-white/5 p-8 rounded-sm shadow-xl hover:border-axim-purple/30 transition-colors">
             <div className="text-axim-purple text-xs font-mono uppercase tracking-widest mb-3 flex items-center gap-2">
               <SafeIcon icon={LuIcons.LuActivity} className="w-4 h-4" /> 01 // Real-Time Routing
             </div>
             <h3 className="text-white font-black text-lg uppercase tracking-tight mb-2">Asynchronous Webhooks</h3>
             <p className="text-xs text-zinc-400 leading-relaxed">Catch data envelopes instantly via native HTTP post triggers. Distribute structural data across custom internal tracking endpoints with sub-second latency constraints.</p>
           </div>
           <div className="bg-[#050505] border border-white/5 p-8 rounded-sm shadow-xl hover:border-axim-purple/30 transition-colors">
             <div className="text-axim-purple text-xs font-mono uppercase tracking-widest mb-3 flex items-center gap-2">
               <SafeIcon icon={LuIcons.LuBinary} className="w-4 h-4" /> 02 // Logic Branching
             </div>
             <h3 className="text-white font-black text-lg uppercase tracking-tight mb-2">Deterministic Routing</h3>
             <p className="text-xs text-zinc-400 leading-relaxed">Establish strict logic controls using inline variable assessment. Transform strings, calculate math structures, and execute alternate pathways flawlessly on the fly.</p>
           </div>
           <div className="bg-[#050505] border border-white/5 p-8 rounded-sm shadow-xl hover:border-axim-purple/30 transition-colors">
             <div className="text-axim-purple text-xs font-mono uppercase tracking-widest mb-3 flex items-center gap-2">
               <SafeIcon icon={LuIcons.LuShieldCheck} className="w-4 h-4" /> 03 // Fault Resistance
             </div>
             <h3 className="text-white font-black text-lg uppercase tracking-tight mb-2">Error Capture Nodes</h3>
             <p className="text-xs text-zinc-400 leading-relaxed">Prevent cascade failures using explicit fallback branches. If an external system or target database experiences an outage, your automation safely routes data to an isolated vault array.</p>
           </div>
        </div>
      </section>

      {/* Enterprise Use Cases */}
      <section className="bg-[#0F172A] border-y border-white/10 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black uppercase tracking-tighter text-white mb-4">Enterprise Use Cases</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-sm">Concrete deployment architectures utilized by the AXiM infrastructure team.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="flex gap-6">
               <SafeIcon icon={LuIcons.LuUsers} className="w-8 h-8 text-axim-purple shrink-0" />
               <div>
                 <h4 className="text-white font-black uppercase tracking-widest text-sm mb-2">Autonomous Lead Triage</h4>
                 <p className="text-zinc-400 text-xs leading-relaxed">Connect your frontend web forms directly to Make. Automatically parse the submission, format the variables, verify the email logic, and push the clean data directly into your HubSpot or Salesforce CRM instantly.</p>
               </div>
            </div>
            <div className="flex gap-6">
               <SafeIcon icon={LuIcons.LuBellRing} className="w-8 h-8 text-axim-purple shrink-0" />
               <div>
                 <h4 className="text-white font-black uppercase tracking-widest text-sm mb-2">Operational Alert Pipelines</h4>
                 <p className="text-zinc-400 text-xs leading-relaxed">Monitor payment gateways (like Stripe) in real-time. When a transaction succeeds or fails, Make can instantly route a formatted notification packet directly to your secure Slack or Discord engineering channels.</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Conversion Block */}
      <section className="py-24 relative overflow-hidden bg-black text-center">
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white mb-6">Stop Hardcoding. <br/>Start Scaling.</h2>
          <p className="text-zinc-400 text-sm mb-10">Join thousands of operators building robust, fault-tolerant internal systems without the overhead of traditional software engineering.</p>
          <a href={affiliateLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-12 py-5 bg-axim-purple text-white font-black uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-colors shadow-[0_0_30px_rgba(147,51,234,0.3)] rounded-sm">
            Create Your Free Account <SafeIcon icon={LuIcons.LuArrowUpRight} className="ml-3 w-4 h-4" />
          </a>
        </div>
      </section>
    </div>
  );
}
