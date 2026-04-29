import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import * as LuIcons from 'react-icons/lu';
import SafeIcon from '../common/SafeIcon';
import { useAximStore } from '../store/useAximStore';
import { useShallow } from 'zustand/react/shallow';
import GlobalSearch from "./GlobalSearch";
import { useAximAuth } from '../hooks/useAximAuth';
import { supabase } from '../lib/supabase.js';

const { LuUser, LuLogOut } = LuIcons;

export default function Header() {
  const location = useLocation();
  const userSession = useAximStore(useShallow((state) => state.userSession));
  const { session } = useAximAuth();
  
  const navLinks = [
    { path: '/articles', label: 'Articles' },
    { path: '/tools', label: 'Tools' },
    { path: '/partners', label: 'Partners' },
    { path: '/consultation', label: 'Consultation' },
  ];

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="fixed top-0 w-full p-4 px-6 md:px-12 bg-[#050505]/95 backdrop-blur-md border-b border-white/10 z-50">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link to="/" className="font-mono font-bold text-xl tracking-tighter flex items-center gap-2 group">
            <div className="w-2.5 h-2.5 bg-axim-gold rounded-full animate-pulse shadow-[0_0_10px_#FFEA00]"></div>
            AXiM<span className="text-white/40 group-hover:text-white transition-colors">.US.COM</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-zinc-500">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              const isGlowTarget = link.path === '/tools' || link.path === '/dashboard';
              const activeClass = isActive
                ? (isGlowTarget ? 'text-axim-teal drop-shadow-[0_0_8px_#2dd4bf]' : 'text-axim-gold')
                : '';

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`transition-colors ${activeClass} ${!isActive ? 'hover:text-axim-gold' : ''}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4 relative">
          <GlobalSearch />

          <div className="flex items-center gap-2">
            {session ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/profile"
                  className={`p-2.5 rounded-sm border transition-all ${location.pathname === '/profile' ? 'bg-axim-teal border-axim-teal shadow-[0_0_10px_#2dd4bf] text-black' : 'bg-white/5 border-white/10 text-white hover:border-white/30'}`}
                >
                  <SafeIcon icon={LuUser} className="w-4 h-4" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2.5 rounded-sm border bg-white/5 border-white/10 text-white hover:border-red-500/50 hover:text-red-500 transition-all"
                >
                  <SafeIcon icon={LuLogOut} className="w-4 h-4" />
                </button>
              </div>
            ) : null}
          </div>

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

      {isMenuOpen && (
        <div className="lg:hidden mt-4 pt-4 border-t border-white/10 flex flex-col gap-4 font-mono text-[0.75rem] uppercase tracking-[0.2em] text-zinc-400">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            const isGlowTarget = link.path === '/tools' || link.path === '/dashboard';
              const activeClass = isActive
                ? (isGlowTarget ? 'text-axim-teal drop-shadow-[0_0_8px_#2dd4bf]' : 'text-axim-gold')
                : '';

            return (
              <Link
                key={link.path}
                to={link.path}
                className={`block transition-colors ${activeClass} ${!isActive ? 'hover:text-axim-gold' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
