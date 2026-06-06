import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';

export default function Support() {
  return (
    <div className="w-full min-h-screen bg-bg-void relative z-10 pb-32">
      <SEO title="Client Support | AXiM Systems" description="Access operational support, documentation, and strategic intelligence." />

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
            Access documentation, submit bug reports, or schedule direct operational assistance for your integrated AXiM systems.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

           {/* Direct Consultation Link */}
           <div className="bg-[#050505] border border-white/5 p-8 rounded-sm shadow-xl hover:border-axim-purple/30 transition-colors flex flex-col h-full">
             <div className="w-10 h-10 bg-axim-purple/10 flex items-center justify-center rounded-sm mb-6">
                <SafeIcon icon={LuIcons.LuPhoneCall} className="w-5 h-5 text-axim-purple" />
             </div>
             <h2 className="text-xl font-black text-white uppercase tracking-tight mb-3">Live Consultation</h2>
             <p className="text-xs text-zinc-400 leading-relaxed mb-8 flex-grow">
               Require immediate strategic guidance or custom software architecture adjustments? Schedule a secure call with our engineering team.
             </p>
             <Link to="/consultation" className="mt-auto py-4 bg-axim-purple text-white text-center text-[0.65rem] font-black uppercase tracking-widest transition-colors rounded-sm hover:bg-white hover:text-black shadow-[0_0_20px_rgba(147,51,234,0.2)]">
               Book Secure Link
             </Link>
           </div>

           {/* Email / Ticketing Link */}
           <div className="bg-[#050505] border border-white/5 p-8 rounded-sm shadow-xl hover:border-[#004040]/50 transition-colors flex flex-col h-full">
             <div className="w-10 h-10 bg-[#004040]/20 flex items-center justify-center rounded-sm mb-6">
                <SafeIcon icon={LuIcons.LuMail} className="w-5 h-5 text-[#004040]" />
             </div>
             <h2 className="text-xl font-black text-white uppercase tracking-tight mb-3">Submit Terminal Ticket</h2>
             <p className="text-xs text-zinc-400 leading-relaxed mb-8 flex-grow">
               Encountered a friction point in the Quick Demand Letter interface or one of our partner matrices? Submit a detailed log to our resolution queue.
             </p>
             <a href="mailto:support@axim.us.com" className="mt-auto py-4 bg-transparent border border-[#004040]/50 text-white text-center text-[0.65rem] font-black uppercase tracking-widest transition-colors rounded-sm hover:bg-[#004040] hover:border-[#004040]">
               Initialize Email
             </a>
           </div>

        </div>
      </section>
    </div>
  );
}
