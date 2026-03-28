import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { client } from "../lib/thirdweb-client";
import { sepolia } from "thirdweb/chains";
import * as LuIcons from 'react-icons/lu';
import SafeIcon from '../common/SafeIcon';

const { LuUser } = LuIcons;

export default function Web3Header() {
  const location = useLocation();
  const account = useActiveAccount();
  
  const navLinks = [
    { path: '/dashboard', label: 'Command' },
    { path: '/assets', label: 'Assets' },
    { path: '/protocols', label: 'Protocols' },
    { path: '/generator', label: 'Legal' },
    { path: '/blog', label: 'Intel' },
  ];

  return (
    <header className="fixed top-0 w-full flex justify-between items-center p-4 px-6 md:px-12 bg-[#050505]/95 backdrop-blur-md border-b border-white/10 z-50">
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
        
        {account && (
          <Link 
            to="/profile" 
            className={`p-2.5 rounded-sm border transition-all ${location.pathname === '/profile' ? 'bg-axim-gold border-axim-gold text-black' : 'bg-white/5 border-white/10 text-white hover:border-white/30'}`}
          >
            <SafeIcon icon={LuUser} className="w-4 h-4" />
          </Link>
        )}

        <div className="scale-90 md:scale-100 origin-right">
          <ConnectButton 
            client={client} 
            accountAbstraction={{ chain: sepolia, sponsorGas: true }}
            theme="dark"
          />
        </div>
      </div>
    </header>
  );
}