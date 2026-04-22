import React, { useEffect, useState } from 'react';
import SEO from '../components/SEO';
import SafeIcon from '../common/SafeIcon';
import { useAximStore } from '../store/useAximStore';
import { useAximAuth } from '../hooks/useAximAuth';
import * as LuIcons from 'react-icons/lu';
import DashboardNodes from '../components/DashboardNodes';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

const { LuLayoutDashboard, LuLock, LuActivity, LuInfo } = LuIcons;

export default function Dashboard() {
  const userSession = useAximStore((state) => state.userSession);
  const nodeStatuses = useAximStore((state) => state.nodeStatuses);

  let isWeb3Enabled = false;
  try {
     isWeb3Enabled = import.meta.env.VITE_ENABLE_WEB3 === 'true';
  } catch(e) { /* empty */ }

  const { account, session } = useAximAuth();
  const [liveEvents, setLiveEvents] = useState([]);

  useEffect(() => {
    // Only subscribe if authenticated
    if (!session && !account && !userSession) return;

    const channel = supabase
      .channel('system_events')
      .on(
        'broadcast',
        { event: 'telemetry_update' },
        (payload) => {
          setLiveEvents((prev) => {
            const newEvents = [payload.payload, ...prev].slice(0, 5); // Keep last 5 events
            return newEvents;
          });
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'secure_artifacts' },
        (payload) => {
           setLiveEvents((prev) => {
              const newEvents = [{
                  id: payload.new.id,
                  message: `New artifact generated: ${payload.new.document_type || 'Document'}`,
                  timestamp: payload.new.created_at,
                  type: 'success'
              }, ...prev].slice(0, 5);
              return newEvents;
           });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session, account, userSession]);

  const hasAccess = userSession || session || account;

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-20 relative z-10">
      <SEO title="Dashboard" description="AXiM Ecosystem Dashboard." />

      <div className="mb-12">
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-2 flex items-center gap-3">
          <SafeIcon icon={LuLayoutDashboard} className="text-axim-teal" />
          Command Center
        </h1>
        <p className="text-zinc-500 text-sm">Centralized node management and ecosystem routing.</p>
      </div>

      {!hasAccess ? (
        <div className="p-12 border border-white/10 bg-[#0a0a0a] flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-axim-gold/10 flex items-center justify-center text-axim-gold border border-axim-gold/40 shadow-[0_0_15px_rgba(255,234,0,0.1)] mb-6">
            <SafeIcon icon={LuLock} className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-black uppercase mb-2">Access Restricted</h3>
          <p className="text-zinc-400 text-sm max-w-md mx-auto mb-8">
            {isWeb3Enabled
              ? "This dashboard requires an active AXiM Protocol Pass or active B2B Enterprise Session."
              : "This dashboard requires an active B2B Enterprise Session."}
          </p>
          {isWeb3Enabled && (
            <button className="px-8 py-3 bg-axim-gold text-black font-bold uppercase tracking-widest text-sm hover:bg-yellow-400 transition-colors">
              Connect Identity
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
             <DashboardNodes nodeStatuses={nodeStatuses} setSelectedNode={() => {}} />
          </div>

          {/* Live Events Sidebar */}
          <div className="lg:col-span-1 bg-white/5 backdrop-blur-xl saturate-150 border border-white/10 p-6 flex flex-col">
            <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
              <SafeIcon icon={LuActivity} className="text-axim-teal animate-pulse" />
              <h3 className="text-sm font-black uppercase text-white tracking-widest">Live Feed</h3>
            </div>

            <div className="flex-grow space-y-3 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
               <AnimatePresence>
                 {liveEvents.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-8 text-zinc-600 text-xs font-mono uppercase tracking-widest"
                    >
                      Awaiting telemetry...
                    </motion.div>
                 ) : (
                   liveEvents.map((ev, i) => (
                     <motion.div
                       key={ev.id || i}
                       initial={{ opacity: 0, x: 20 }}
                       animate={{ opacity: 1, x: 0 }}
                       exit={{ opacity: 0, scale: 0.95 }}
                       className={`p-3 text-xs font-mono border rounded-sm ${ev.type === 'error' ? 'border-red-500/30 bg-red-500/10 text-red-400' : ev.type === 'success' ? 'border-axim-green/30 bg-axim-green/10 text-axim-green' : 'border-axim-teal/30 bg-axim-teal/10 text-axim-teal'}`}
                     >
                       <div className="flex gap-2 items-start">
                         <SafeIcon icon={LuInfo} className="w-3 h-3 mt-0.5 shrink-0" />
                         <div>
                            <p>{ev.message}</p>
                            <span className="text-[0.6rem] opacity-50 mt-1 block">
                               {ev.timestamp ? new Date(ev.timestamp).toLocaleTimeString() : new Date().toLocaleTimeString()}
                            </span>
                         </div>
                       </div>
                     </motion.div>
                   ))
                 )}
               </AnimatePresence>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
