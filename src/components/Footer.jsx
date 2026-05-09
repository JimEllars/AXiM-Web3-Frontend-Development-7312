import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="py-12 border-t border-axim-purple/30 text-center font-mono text-[0.7rem] text-zinc-500 uppercase tracking-[0.2em] relative z-10 bg-axim-deep">
      <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Legal & Security Column */}
        <nav aria-label="Legal Desktop" className="text-left hidden md:flex flex-col gap-2">
          <h3 className="text-white font-bold mb-2">Legal & Security</h3>
          <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          <Link to="/security" className="hover:text-white transition-colors">Security Architecture</Link>
        </nav>

        {/* Fleet Status Column */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-axim-gold rounded-full shadow-[0_0_8px_#F0FF00] animate-pulse"></div>
            <span className="text-white">SYSTEM_STATUS: OPERATIONAL</span>
          </div>
          <p className="opacity-50 text-[0.6rem]">
            &copy;{new Date().getFullYear()} AXiM Systems. Protocol Controlled.
            <br />
            REF: AXM_SYSTEMS_ROOT // V.1.0.9
          </p>
        </div>

        {/* Platform Column */}
        <nav aria-label="Platform Desktop" className="text-right hidden md:flex flex-col gap-2 items-end">
          <h3 className="text-white font-bold mb-2">Platform</h3>
          <a href="#" className="hover:text-white transition-colors">Documentation</a>
          <a href="#" className="hover:text-white transition-colors">API</a>
          <Link to="/partners" className="hover:text-white transition-colors">Partner Infrastructure</Link>
        </nav>

        {/* Mobile links */}
        <div className="md:hidden flex flex-col gap-6 mt-8">
          <nav aria-label="Legal Mobile" className="flex flex-col gap-2">
            <h3 className="text-white font-bold mb-1">Legal & Security</h3>
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/security" className="hover:text-white transition-colors">Security Architecture</Link>
          </nav>
          <nav aria-label="Platform Mobile" className="flex flex-col gap-2">
            <h3 className="text-white font-bold mb-1">Platform</h3>
            <a href="#" className="hover:text-white transition-colors">Documentation</a>
            <a href="#" className="hover:text-white transition-colors">API</a>
            <Link to="/partners" className="hover:text-white transition-colors">Partner Infrastructure</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
