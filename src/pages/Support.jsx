import React from 'react';
import SEO from '../components/SEO';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';

export default function Support() {
  return (
    <div className="w-full min-h-screen bg-bg-void relative z-10 pb-32">
      <SEO title="Client Support | AXiM Systems" description="Access operational support, documentation, and submit system tickets." />

      {/* Header */}
      <section className="pt-32 pb-16 relative overflow-hidden bg-black border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,64,64,0.15),transparent_50%)] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <div className="w-14 h-14 bg-[#004040]/20 border border-[#004040] rounded flex items-center justify-center mx-auto mb-6 shadow-[0_0_25px_rgba(0,64,64,0.3)]">
            <SafeIcon icon={LuIcons.LuLifeBuoy} className="w-6 h-6 text-[#004040]" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white leading-tight mb-4">
            System <span className="text-[#004040]">Support.</span>
          </h1>
          <p className="text-zinc-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Access immediate documentation or submit a terminal ticket to our resolution queue.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-24">

        {/* Ticket Submission Block (Full Width) */}
        <div className="bg-[#050505] border border-white/5 p-8 md:p-12 rounded-sm shadow-2xl mb-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#004040]/10 blur-[50px] pointer-events-none" />
          <div className="w-12 h-12 bg-[#004040]/20 flex items-center justify-center rounded-sm mb-6 relative z-10">
             <SafeIcon icon={LuIcons.LuSquareTerminal} className="w-6 h-6 text-[#004040]" />
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-4 relative z-10">Submit Terminal Ticket</h2>
          <p className="text-sm text-zinc-400 leading-relaxed mb-8 max-w-2xl relative z-10">
            Encountered a friction point in the Quick Demand Letter interface or one of our partner matrices? Submit a detailed log to our resolution queue. Standard response time is 24-48 hours.
          </p>
          <a href="mailto:support@axim.us.com" className="relative z-10 inline-flex px-8 py-4 bg-[#004040] text-white text-[0.75rem] font-black uppercase tracking-widest transition-colors rounded-sm hover:bg-white hover:text-black shadow-lg">
            Initialize Ticket Queue <SafeIcon icon={LuIcons.LuMail} className="ml-3 w-4 h-4" />
          </a>
        </div>

        {/* Self-Serve FAQ Matrix */}
        <div className="space-y-6">
          <h3 className="text-white font-black uppercase tracking-widest text-lg border-b border-white/10 pb-4 mb-6">Frequently Asked Questions</h3>

          <div className="bg-[#050505] border border-white/5 p-6 rounded-sm">
            <h4 className="text-white font-bold text-sm uppercase tracking-tight mb-2">How do I access my generated Demand Letter?</h4>
            <p className="text-sm text-zinc-400 leading-relaxed">Once the generation process is complete on QuickDemandLetter.com, you will receive an immediate PDF download link, and a backup copy will be sent to your registered email address.</p>
          </div>

          <div className="bg-[#050505] border border-white/5 p-6 rounded-sm">
            <h4 className="text-white font-bold text-sm uppercase tracking-tight mb-2">How do I integrate a Partner System?</h4>
            <p className="text-sm text-zinc-400 leading-relaxed">Navigate to the specific partner page (e.g., Make.com or Chatbase) via the top navigation menu. Each partner hub contains a direct initiation link that automatically applies our enterprise parameters.</p>
          </div>
        </div>

      </section>
    </div>
  );
}
