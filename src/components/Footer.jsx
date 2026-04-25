import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="py-12 border-t border-white/10 text-center font-mono text-[0.7rem] text-zinc-500 uppercase tracking-[0.2em] relative z-10 bg-[#050505]">
      <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        <div className="text-left hidden md:flex flex-col gap-2">
          <div>REF: AXM_SYSTEMS_ROOT // V.1.0.9</div>
          <div className="flex gap-4 mt-2">
             <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
             <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
             <Link to="/security" className="hover:text-white transition-colors">Security Architecture</Link>
          </div>
        </div>
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-axim-green rounded-full shadow-[0_0_8px_#3aaa74] animate-pulse"></div>
            <span className="text-white">SYSTEM_STATUS: OPERATIONAL</span>
          </div>
          <div className="opacity-50 text-[0.6rem]">
            &copy;{new Date().getFullYear()} AXiM Systems. Protocol Controlled.
          </div>
        </div>
        <div className="text-right hidden md:flex justify-end gap-6 opacity-50">
          <a href="#" className="hover:text-white transition-colors">Documentation</a>
          <a href="#" className="hover:text-white transition-colors">Governance</a>
          <a href="#" className="hover:text-white transition-colors">API</a>
        </div>

        {/* Mobile links */}
        <div className="md:hidden flex flex-col gap-2 mt-4">
             <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
             <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
             <Link to="/security" className="hover:text-white transition-colors">Security Architecture</Link>
        </div>
      </div>
    </footer>
  );
}
