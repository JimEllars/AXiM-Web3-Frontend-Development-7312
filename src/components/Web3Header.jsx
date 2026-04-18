import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { client } from "../lib/thirdweb-client";
import { sepolia } from "thirdweb/chains";
import * as LuIcons from 'react-icons/lu';
import SafeIcon from '../common/SafeIcon';
import { usePassport } from '../hooks/usePassport';
import OnyxSearch from './OnyxSearch';

const { LuUser } = LuIcons;

export default function Web3Header() {
  const location = useLocation();
  const { userSession } = usePassport();
  const account = useActiveAccount();
  const isWeb3Enabled = import.meta.env.VITE_ENABLE_WEB3 === 'true';
  
  const navLinks = [
    { path: '/articles', label: 'Articles' },
    { path: '/tools', label: 'Tools' },
    { path: '/consultation', label: 'Consultation' },
  ];

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="fixed top-0 w-full p-4 px-6 md:px-12 bg-[#050505]/95 backdrop-blur-md border-b border-white/10 z-50">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link to="/" className="font-mono font-bold text-xl tracking-tighter flex items-center gap-2 group">
            <div className="w-2.5 h-2.5 bg-axim-gold rounded-full animate-pulse shadow-[0_0_10px_#FFEA00]"></div>
            AXiM<span className="text-white/40 group-hover:text-white transition-colors">.US.COM</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-zinc-500">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`hover:text-axim-gold transition-colors ${location.pathname === link.path ? 'text-axim-gold' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/early-access"
            className="hidden md:block px-4 py-2 bg-white/5 border border-white/10 text-white font-mono text-[0.6rem] uppercase tracking-widest hover:bg-white hover:text-black transition-all"
          >
            Waitlist
          </Link>

          <OnyxSearch />

          {isWeb3Enabled && account && (
            <div className="flex items-center gap-2">
              {userSession && (
                <div className="hidden md:flex items-center gap-1.5 px-2 py-1 bg-axim-green/10 border border-axim-green/20 rounded-sm">
                  <div className="w-1.5 h-1.5 bg-axim-green rounded-full animate-pulse"></div>
                  <span className="text-[0.55rem] font-mono text-axim-green uppercase tracking-widest">Passport Active</span>
                </div>
              )}
              <Link
                to="/profile"
                className={`p-2.5 rounded-sm border transition-all ${location.pathname === '/profile' ? 'bg-axim-gold border-axim-gold text-black' : 'bg-white/5 border-white/10 text-white hover:border-white/30'}`}
              >
                <SafeIcon icon={LuUser} className="w-4 h-4" />
              </Link>
            </div>
          )}

          {isWeb3Enabled && (
            <div className="scale-90 md:scale-100 origin-right">
              <ConnectButton
                client={client}
                accountAbstraction={{ chain: sepolia, sponsorGas: true }}
                theme="dark"
              />
            </div>
          )}

          <button
            className="lg:hidden p-2 text-white border border-white/10 bg-white/5 rounded-sm"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden mt-4 pt-4 border-t border-white/10 flex flex-col gap-4 font-mono text-[0.75rem] uppercase tracking-[0.2em] text-zinc-400">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path} 
              className={`block hover:text-axim-gold transition-colors ${location.pathname === link.path ? 'text-axim-gold' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link 
            to="/early-access"
            className="block w-fit px-4 py-2 mt-2 bg-white/5 border border-white/10 text-white font-mono text-[0.6rem] uppercase tracking-widest hover:bg-white hover:text-black transition-all"
            onClick={() => setIsMenuOpen(false)}
          >
            Waitlist
          </Link>
        </div>
      )}
    </header>
  );
}