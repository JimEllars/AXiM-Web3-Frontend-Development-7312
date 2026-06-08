import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';

export default function NotFound() {
  return (
    <div className="w-full min-h-screen bg-bg-void relative z-10 flex items-center justify-center p-6">
      <SEO title="Signal Lost | AXiM Systems" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(147,51,234,0.05),transparent_50%)] pointer-events-none" />

      <div className="w-full max-w-2xl bg-[#050505] border border-white/10 p-12 text-center rounded-sm shadow-2xl relative z-10 overflow-hidden">
         <div className="absolute top-0 right-0 w-32 h-32 bg-axim-purple/10 blur-[40px]" />
         <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#DB2777]/10 blur-[40px]" />

         <SafeIcon icon={LuIcons.LuUnplug} className="w-16 h-16 text-zinc-500 mx-auto mb-6" />

         <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white mb-2">Signal <span className="text-axim-purple">Lost.</span></h1>
         <p className="text-zinc-400 font-mono text-xs uppercase tracking-widest mb-10">Error 404 // The requested trajectory does not exist.</p>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <Link to="/" className="group bg-[#0F172A] border border-white/5 p-4 rounded-sm hover:border-axim-purple/50 transition-colors flex items-center gap-4">
              <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-axim-purple transition-colors">
                <SafeIcon icon={LuIcons.LuHome} className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-white text-xs font-bold uppercase tracking-widest mb-0.5">Return Home</div>
                <div className="text-zinc-500 text-[0.6rem] font-mono uppercase">Master Console</div>
              </div>
            </Link>
            <Link to="/partners/make" className="group bg-[#0F172A] border border-white/5 p-4 rounded-sm hover:border-axim-purple/50 transition-colors flex items-center gap-4">
              <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-axim-purple transition-colors">
                <SafeIcon icon={LuIcons.LuWorkflow} className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-white text-xs font-bold uppercase tracking-widest mb-0.5">Automate</div>
                <div className="text-zinc-500 text-[0.6rem] font-mono uppercase">Make.com Portal</div>
              </div>
            </Link>
            <Link to="/partners/chatbase" className="group bg-[#0F172A] border border-white/5 p-4 rounded-sm hover:border-[#DB2777]/50 transition-colors flex items-center gap-4">
              <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-[#DB2777] transition-colors">
                <SafeIcon icon={LuIcons.LuBot} className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-white text-xs font-bold uppercase tracking-widest mb-0.5">Deploy AI</div>
                <div className="text-zinc-500 text-[0.6rem] font-mono uppercase">Chatbase Portal</div>
              </div>
            </Link>
            <Link to="/articles" className="group bg-[#0F172A] border border-white/5 p-4 rounded-sm hover:border-axim-gold/50 transition-colors flex items-center gap-4">
              <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-axim-gold transition-colors">
                <SafeIcon icon={LuIcons.LuDatabase} className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-white text-xs font-bold uppercase tracking-widest mb-0.5">Intelligence</div>
                <div className="text-zinc-500 text-[0.6rem] font-mono uppercase">Latest Articles</div>
              </div>
            </Link>
         </div>
      </div>
    </div>
  );
}
