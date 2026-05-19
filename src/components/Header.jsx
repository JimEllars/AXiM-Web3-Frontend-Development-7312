import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import * as LuIcons from 'react-icons/lu';
import SafeIcon from '../common/SafeIcon';
import { useAximStore } from '../store/useAximStore';
import { useShallow } from 'zustand/react/shallow';
import GlobalSearch from "./GlobalSearch";
import { useAximAuth } from '../hooks/useAximAuth';
import { supabase } from '../lib/supabase.js';
import { motion, AnimatePresence } from 'framer-motion';

const { LuUser, LuLogOut } = LuIcons;

export default function Header() {
  const location = useLocation();
  const userSession = useAximStore(useShallow((state) => state.userSession));
  const telemetryStatus = useAximStore((state) => state.telemetryStatus);
  const { session } = useAximAuth();
  
  const navLinks = [
    { path: '/articles', label: 'Articles' },
    { path: '/tools', label: 'Tools' },
    { path: '/partners', label: 'Partners' },
    { path: '/support', label: 'Support' },
  ];

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="fixed top-0 w-full p-4 px-6 md:px-12 bg-[#050505]/95 backdrop-blur-md border-b border-white/10 z-[100]">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link to="/" className="font-mono font-bold text-xl tracking-tighter flex items-center gap-2 group">
            <img src="https://wp.axim.us.com/wp-content/uploads/2025/06/12.png" alt="AXiM Systems" className="h-8 w-auto object-contain" />
          </Link>

          {telemetryStatus === 'LOCAL_BUFFER' && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-axim-gold/10 border border-axim-gold/50 text-axim-gold text-[0.65rem] font-mono font-bold uppercase tracking-widest rounded-sm shadow-[0_0_10px_rgba(240,255,0,0.3)] animate-pulse">
              [LOCAL_BUFFER_ACTIVE] // AUTONOMOUS_MODE
            </div>
          )}

          <nav className="hidden lg:flex items-center gap-6 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-zinc-500">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              const isGlowTarget = link.path === '/tools' || link.path === '/dashboard';
              const activeClass = isActive
                ? (isGlowTarget ? 'text-axim-purple drop-shadow-[0_0_8px_#7D00FF]' : 'text-axim-gold')
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
                  className={`p-2.5 rounded-sm border transition-all ${location.pathname === '/profile' ? 'bg-axim-purple border-axim-purple shadow-[0_0_10px_#7D00FF] text-black' : 'bg-white/5 border-white/10 text-white hover:border-white/30'}`}
                >
                  <SafeIcon icon={LuUser} className="w-4 h-4" />
                </Link>
                <button
                  aria-label="Secure Logout"
                  onClick={handleLogout}
                  className="p-2.5 rounded-sm border bg-white/5 border-white/10 text-white hover:border-red-500/50 hover:text-red-500 transition-all"
                >
                  <SafeIcon icon={LuLogOut} className="w-4 h-4" />
                </button>
              </div>
            ) : null}
          </div>

          <button
            aria-label="Toggle mobile menu"
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

      {/* Full-Screen Mobile Navigation Takeover */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed inset-0 z-[90] bg-[#050505]/95 backdrop-blur-2xl border-b border-axim-purple/20 flex flex-col pt-24 px-8 pb-8 h-screen"
          >
            {/* Close Button Absolute Top Right */}
            <button onClick={() => setIsMenuOpen(false)} className="absolute top-6 right-6 p-2 text-zinc-400 hover:text-white border border-white/10 bg-white/5 rounded-sm">
              <SafeIcon icon={LuIcons.LuX} className="w-6 h-6" />
            </button>

            <div className="flex-1 flex flex-col justify-center space-y-8">
              <div className="text-xs font-mono text-axim-purple uppercase tracking-widest mb-4 border-b border-white/10 pb-4">System Nodes</div>
              {[
                { path: '/tools', label: 'Offerings', icon: LuIcons.LuCpu },
                { path: '/articles', label: 'Intelligence', icon: LuIcons.LuDatabase },
                { path: '/partners', label: 'Partners', icon: LuIcons.LuNetwork },
                { path: '/support', label: 'Support', icon: LuIcons.LuLifeBuoy }
              ].map((item) => {
                const isActive = location.pathname.startsWith(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`text-2xl font-black uppercase tracking-tighter transition-colors flex items-center gap-4 ${isActive ? 'text-white' : 'text-zinc-500 hover:text-white'}`}
                  >
                    <SafeIcon icon={item.icon} className={`w-6 h-6 ${isActive ? 'text-axim-purple' : 'opacity-50'}`} />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="mt-auto pt-8 border-t border-white/10">
              <Link
                to="/support"
                onClick={() => setIsMenuOpen(false)}
                className="w-full flex justify-center items-center px-6 py-4 bg-axim-purple text-white font-black uppercase tracking-widest text-xs"
              >
                Initialize Support <SafeIcon icon={LuIcons.LuArrowRight} className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}