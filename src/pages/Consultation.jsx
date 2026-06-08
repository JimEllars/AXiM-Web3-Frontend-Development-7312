import React from 'react';
import SEO from '../components/SEO';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';

export default function Consultation() {
  return (
    <div className="w-full min-h-screen bg-bg-void relative z-10 pb-32">
      <SEO
        title="Book A Consultation | AXiM Systems"
        description="Schedule a technical strategy session with an AXiM systems architect to scale your decentralized infrastructure."
      />

      {/* Hero */}
      <section className="pt-32 pb-16 relative overflow-hidden bg-black border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-tr from-axim-purple/20 via-transparent to-axim-purple/10 mix-blend-overlay z-0" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white leading-tight mb-4">
            System <span className="text-axim-purple">Strategy Call.</span>
          </h1>
          <p className="text-zinc-400 max-w-2xl text-sm md:text-base leading-relaxed">
            Schedule a dedicated session with an AXiM architect. We will audit your current workflows, identify latency bottlenecks, and map out a decentralized automation strategy.
          </p>
        </div>
      </section>

      {/* Split Form Layout */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <div className="flex flex-col lg:flex-row gap-16">

          {/* Value Proposition Sidebar */}
          <div className="lg:w-1/3 space-y-12">
             <div>
               <SafeIcon icon={LuIcons.LuNetwork} className="w-6 h-6 text-axim-purple mb-4" />
               <h3 className="text-white font-black uppercase tracking-widest text-sm mb-2">Workflow Audits</h3>
               <p className="text-xs text-zinc-400 leading-relaxed">We break down your existing SaaS subscriptions and API limitations to find areas where Make.com logic loops can save manual labor.</p>
             </div>
             <div>
               <SafeIcon icon={LuIcons.LuBot} className="w-6 h-6 text-[#DB2777] mb-4" />
               <h3 className="text-white font-black uppercase tracking-widest text-sm mb-2">AI Implementation</h3>
               <p className="text-xs text-zinc-400 leading-relaxed">Discover how proprietary, firewalled LLM models can be trained on your company data to triage leads and automate support vectors.</p>
             </div>
             <div>
               <SafeIcon icon={LuIcons.LuShieldCheck} className="w-6 h-6 text-axim-gold mb-4" />
               <h3 className="text-white font-black uppercase tracking-widest text-sm mb-2">Security Briefing</h3>
               <p className="text-xs text-zinc-400 leading-relaxed">Ensure your data architecture remains completely insulated when connecting third-party decentralized applications.</p>
             </div>
          </div>

          {/* Booking Widget Container */}
          <div className="lg:w-2/3">
             <div className="bg-[#050505] border border-white/10 p-8 md:p-12 rounded-sm shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-axim-purple/5 blur-[50px] pointer-events-none" />

                <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-6 relative z-10 flex items-center gap-3">
                  <SafeIcon icon={LuIcons.LuCalendar} className="w-5 h-5 text-axim-purple" /> Select A Time
                </h2>

                <div className="w-full h-[600px] border border-white/5 bg-[#0A0A0A] rounded-sm flex flex-col items-center justify-center text-center relative z-10 p-6">
                   {/* Placeholder for future Calendly/HubSpot booking iframe */}
                   <SafeIcon icon={LuIcons.LuHourglass} className="w-8 h-8 text-zinc-500 mb-4 animate-pulse" />
                   <p className="text-zinc-400 font-mono text-xs uppercase tracking-widest mb-4">Awaiting Calendar Integration Module</p>
                   <p className="text-zinc-500 text-[0.65rem] max-w-xs leading-relaxed">
                     System architect calendar syncing is currently offline. Please utilize the Chatbase Concierge on the Support page for immediate triage.
                   </p>
                </div>
             </div>
          </div>

        </div>
      </section>
    </div>
  );
}
