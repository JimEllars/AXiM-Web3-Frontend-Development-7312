import React from 'react';
import { Link } from 'react-router-dom';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#050505] border-t border-white/10 pt-20 pb-10 relative z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(147,51,234,0.05),transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-6 group">
               <img
                 src="https://wp.axim.us.com/wp-content/uploads/2025/06/12.png"
                 alt="AXiM Systems"
                 className="h-8 w-auto object-contain opacity-80 group-hover:opacity-100 transition-opacity"
               />
            </Link>
            <p className="text-zinc-500 text-xs leading-relaxed mb-6 font-mono uppercase tracking-widest">
              Builders of a new era. Integrating decentralized energy, logical connectivity, and autonomous intelligence.
            </p>
            <div className="flex gap-4">
               <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-axim-purple transition-colors">
                 <SafeIcon icon={LuIcons.LuTwitter} className="w-4 h-4" />
               </a>
               <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-axim-purple transition-colors">
                 <SafeIcon icon={LuIcons.LuLinkedin} className="w-4 h-4" />
               </a>
            </div>
          </div>

          {/* Partner Funnels */}
          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
              <SafeIcon icon={LuIcons.LuNetwork} className="w-4 h-4 text-axim-purple" /> Partner Grid
            </h4>
            <ul className="space-y-4">
              <li><Link to="/partners/make" className="text-zinc-400 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors">Make.com Automation</Link></li>
              <li><Link to="/partners/chatbase" className="text-zinc-400 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors">Chatbase AI</Link></li>
              <li><Link to="/partners/powur-solar" className="text-zinc-400 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors">Powur Solar</Link></li>
              <li><Link to="/partners" className="text-axim-purple hover:text-white text-xs font-bold uppercase tracking-wider transition-colors">View All Partners →</Link></li>
            </ul>
          </div>

          {/* Proprietary Tools */}
          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
              <SafeIcon icon={LuIcons.LuWrench} className="w-4 h-4 text-[#DB2777]" /> Infrastructure
            </h4>
            <ul className="space-y-4">
              <li><a href="https://quickdemandletter.com/start" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1">Demand Letter Engine <SafeIcon icon={LuIcons.LuArrowUpRight} className="w-3 h-3"/></a></li>
              <li><Link to="/tools/nda" className="text-zinc-400 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors">Mutual NDA Generator</Link></li>
              <li><Link to="/tools/paystub" className="text-zinc-400 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors">Pay Stub System</Link></li>
              <li><Link to="/tools" className="text-[#DB2777] hover:text-white text-xs font-bold uppercase tracking-wider transition-colors">View All Tools →</Link></li>
            </ul>
          </div>

          {/* Intelligence Hub */}
          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
              <SafeIcon icon={LuIcons.LuDatabase} className="w-4 h-4 text-axim-gold" /> Intelligence
            </h4>
            <ul className="space-y-4">
              <li><Link to="/articles" className="text-zinc-400 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors">Latest Articles</Link></li>
              <li><Link to="/support" className="text-zinc-400 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors">System Support Wiki</Link></li>
              <li><Link to="/consultation" className="text-zinc-400 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors">Book Consultation</Link></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-600 font-mono text-[0.6rem] uppercase tracking-widest">
            &copy; {currentYear} AXiM Systems. All rights reserved.
          </p>
          <div className="flex gap-6">
             <Link to="/terms" className="text-zinc-600 hover:text-zinc-300 font-mono text-[0.6rem] uppercase tracking-widest transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
