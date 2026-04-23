import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { client } from "../lib/thirdweb-client";
import { sepolia } from "thirdweb/chains";
import * as LuIcons from 'react-icons/lu';
import SafeIcon from '../common/SafeIcon';
import { useAximStore } from '../store/useAximStore';
import { useShallow } from 'zustand/react/shallow';
import OnyxSearch from './OnyxSearch';
import { useAximAuth } from '../hooks/useAximAuth';
import { supabase } from '../lib/supabase.js';

const { LuUser, LuBell, LuCheck, LuX } = LuIcons;

export default function Web3Header() {
  const location = useLocation();
  const userSession = useAximStore(useShallow((state) => state.userSession));
  const account = useActiveAccount();
  const isWeb3Enabled = import.meta.env.VITE_ENABLE_WEB3 === 'true';
  const { profile, session } = useAximAuth();
  
  const navLinks = [
    { path: '/articles', label: 'Articles' },
    { path: '/tools', label: 'Tools' },
    { path: '/consultation', label: 'Consultation' },
  ];

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isHitlOpen, setIsHitlOpen] = useState(false);
  const [hitlNotifications, setHitlNotifications] = useState([]);

  useEffect(() => {
      if (!session) return;

      const fetchExisting = async () => {
          try {
              const { data, error } = await supabase
                .from('hitl_audit_logs')
                .select('*')
                .eq('status', 'pending_approval')
                .order('created_at', { ascending: false });

              if (!error && data) {
                  setHitlNotifications(data);
              }
          } catch (e) {
              // ignore table not found if it doesn't exist
          }
      };

      fetchExisting();

      const subscription = supabase
          .channel('hitl_audit_logs_changes')
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'hitl_audit_logs', filter: "status=eq.pending_approval" }, payload => {
              setHitlNotifications(prev => [payload.new, ...prev]);
          })
          .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'hitl_audit_logs' }, payload => {
              if (payload.new.status !== 'pending_approval') {
                  setHitlNotifications(prev => prev.filter(n => n.id !== payload.new.id));
              }
          })
          .subscribe();

      return () => {
          supabase.removeChannel(subscription);
      };
  }, [session]);

  const handleHitlAction = async (id, action) => {
      try {
          const { error } = await supabase
            .from('hitl_audit_logs')
            .update({ status: action === 'approve' ? 'approved' : 'rejected', resolved_at: new Date().toISOString() })
            .eq('id', id);

          if (!error) {
              setHitlNotifications(prev => prev.filter(n => n.id !== id));
          }
      } catch (e) {
          console.error("Failed to action HITL notification", e);
      }
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

        <div className="flex items-center gap-4 relative">
          <Link
            to="/early-access"
            className="hidden md:block px-4 py-2 bg-white/5 border border-white/10 text-white font-mono text-[0.6rem] uppercase tracking-widest hover:bg-white hover:text-black transition-all"
          >
            Waitlist
          </Link>

          <OnyxSearch />

          {/* HITL Notification Bell */}
          {(session || account) && (
              <div className="relative">
                  <button
                    onClick={() => setIsHitlOpen(!isHitlOpen)}
                    className={`p-2.5 rounded-sm border transition-all relative ${isHitlOpen ? 'bg-axim-teal/20 border-axim-teal text-axim-teal' : 'bg-white/5 border-white/10 text-white hover:border-white/30'}`}
                  >
                      <SafeIcon icon={LuBell} className={`w-4 h-4 ${hitlNotifications.length > 0 ? 'animate-pulse text-axim-gold' : ''}`} />
                      {hitlNotifications.length > 0 && (
                          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-black text-[8px] flex items-center justify-center font-bold text-white">
                              {hitlNotifications.length}
                          </span>
                      )}
                  </button>

                  {isHitlOpen && (
                      <div className="absolute top-full right-0 mt-2 w-80 bg-black border border-white/10 rounded-sm shadow-xl z-50 font-mono text-xs overflow-hidden">
                          <div className="p-3 border-b border-white/10 bg-white/5 font-bold uppercase tracking-widest text-axim-teal flex justify-between items-center">
                              HITL Approvals
                              <span className="text-zinc-500 text-[10px]">{hitlNotifications.length} Pending</span>
                          </div>
                          <div className="max-h-96 overflow-y-auto scrollbar-hide">
                              {hitlNotifications.length === 0 ? (
                                  <div className="p-6 text-center text-zinc-500 uppercase tracking-widest text-[10px]">
                                      No pending approvals.
                                  </div>
                              ) : (
                                  hitlNotifications.map(notification => (
                                      <div key={notification.id} className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors">
                                          <div className="font-bold text-white mb-1 uppercase text-[10px] tracking-wider truncate">
                                              {notification.task_name || 'System Playbook'}
                                          </div>
                                          <div className="text-zinc-400 text-[10px] mb-3 leading-relaxed">
                                              {notification.details || 'Onyx has paused execution and requests human verification.'}
                                          </div>
                                          <div className="flex gap-2">
                                              <button
                                                onClick={() => handleHitlAction(notification.id, 'approve')}
                                                className="flex-1 py-1.5 bg-axim-green/10 border border-axim-green/30 text-axim-green hover:bg-axim-green hover:text-black transition-colors flex justify-center items-center gap-1 uppercase tracking-widest text-[9px]"
                                              >
                                                  <SafeIcon icon={LuCheck} className="w-3 h-3" /> Approve
                                              </button>
                                              <button
                                                onClick={() => handleHitlAction(notification.id, 'reject')}
                                                className="flex-1 py-1.5 bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white transition-colors flex justify-center items-center gap-1 uppercase tracking-widest text-[9px]"
                                              >
                                                  <SafeIcon icon={LuX} className="w-3 h-3" /> Reject
                                              </button>
                                          </div>
                                      </div>
                                  ))
                              )}
                          </div>
                      </div>
                  )}
              </div>
          )}

          {!isWeb3Enabled ? (
            <div className="flex items-center gap-2">
                {session ? (
                    <Link
                        to="/profile"
                        className={`p-2.5 rounded-sm border transition-all ${location.pathname === '/profile' ? 'bg-axim-gold border-axim-gold text-black' : 'bg-white/5 border-white/10 text-white hover:border-white/30'}`}
                    >
                        <SafeIcon icon={LuUser} className="w-4 h-4" />
                    </Link>
                ) : (
                    <Link
                    to="/dashboard"
                    className="px-4 py-2 bg-axim-gold/10 border border-axim-gold/30 text-axim-gold font-mono text-[0.6rem] uppercase tracking-widest hover:bg-axim-gold hover:text-black transition-all"
                    >
                    Login
                    </Link>
                )}
            </div>
          ) : (
            <>
              {(account || session) && (
                <div className="flex items-center gap-2">
                  {(userSession || session) && (
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
              <div className="scale-90 md:scale-100 origin-right">
                <ConnectButton
                  client={client}
                  accountAbstraction={{ chain: sepolia, sponsorGas: true }}
                  theme="dark"
                />
              </div>
            </>
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
