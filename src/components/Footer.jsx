import React from 'react';
import { Link } from 'react-router-dom';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-black border-t border-white/10 pt-20 pb-10 relative z-20 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
              <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-black tracking-tighter text-xl group-hover:bg-axim-purple group-hover:text-white transition-colors shadow-[0_0_15px_rgba(125,0,255,0.3)]">
                A
              </div>
              <span className="text-xl font-black text-white tracking-tighter">AXiM</span>
            </Link>
            <p className="text-zinc-500 text-xs leading-relaxed max-w-xs mb-6 font-mono tracking-widest uppercase">
              Smarter Systems.<br/>Decentralized infrastructure & high-fidelity digital products.
            </p>
            <Link to="/status" className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-sm text-xs font-mono uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">
              <div className="w-2 h-2 bg-axim-green rounded-full animate-pulse shadow-[0_0_10px_rgba(0,255,0,0.5)]" />
              System: Optimal
            </Link>
          </div>

          {/* Infrastructure Column */}
          <div>
            <h4 className="text-white font-black uppercase tracking-widest mb-6 text-sm flex items-center gap-2">
              <SafeIcon icon={LuIcons.LuCpu} className="text-axim-purple w-4 h-4"/> Offerings
            </h4>
            <ul className="space-y-4">
              <li><Link to="/tools" className="text-zinc-400 hover:text-axim-purple text-sm transition-colors">Digital Software Suite</Link></li>
              <li><a href="https://quickdemandletter.com/start" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-axim-gold text-sm transition-colors flex items-center gap-2">Demand Letter Engine <SafeIcon icon={LuIcons.LuExternalLink} className="w-3 h-3"/></a></li>
              <li><Link to="/tools" className="text-zinc-400 hover:text-axim-purple text-sm transition-colors">Enterprise Academy</Link></li>
              <li><Link to="/articles" className="text-zinc-400 hover:text-axim-purple text-sm transition-colors">Intelligence Briefings</Link></li>
            </ul>
          </div>

          {/* Partner Network Column */}
          <div>
            <h4 className="text-white font-black uppercase tracking-widest mb-6 text-sm flex items-center gap-2">
              <SafeIcon icon={LuIcons.LuNetwork} className="text-axim-purple w-4 h-4"/> Partner Network
            </h4>
            <ul className="space-y-4">
              <li><Link to="/partners/make" className="text-zinc-400 hover:text-[#DB2777] text-sm transition-colors">Make.com Automation</Link></li>
              <li><Link to="/partners/powur-solar" className="text-zinc-400 hover:text-axim-gold text-sm transition-colors">Powur Solar (Homeowners)</Link></li>
              <li><Link to="/partners/powur-join" className="text-zinc-400 hover:text-axim-purple text-sm transition-colors">Powur Agency (B2B)</Link></li>
              <li><Link to="/consultation" className="text-zinc-400 hover:text-white text-sm transition-colors">Propose Integration</Link></li>
            </ul>
          </div>

          {/* Secure Access Column */}
          <div>
            <h4 className="text-white font-black uppercase tracking-widest mb-6 text-sm flex items-center gap-2">
              <SafeIcon icon={LuIcons.LuShieldCheck} className="text-axim-purple w-4 h-4"/> Access
            </h4>
            <ul className="space-y-4">
              <li><Link to="/profile" className="text-zinc-400 hover:text-white text-sm transition-colors">Operator Dashboard</Link></li>
              <li><Link to="/support" className="text-zinc-400 hover:text-white text-sm transition-colors">Support Center</Link></li>
              <li><Link to="/early-access" className="text-zinc-400 hover:text-white text-sm transition-colors">Newsletter & Updates</Link></li>
              <li><a href="mailto:support@axim.us.com" className="text-zinc-400 hover:text-white text-sm transition-colors">support@axim.us.com</a></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-600 text-xs font-mono uppercase tracking-widest text-center md:text-left">
            &copy; {currentYear} AXiM Systems. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/terms" className="text-zinc-600 hover:text-white text-xs font-mono uppercase tracking-widest transition-colors">Terms of Service</Link>
            <Link to="/terms" className="text-zinc-600 hover:text-white text-xs font-mono uppercase tracking-widest transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
