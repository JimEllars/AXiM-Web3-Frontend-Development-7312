import React, { useEffect, useState } from 'react';
import SEO from '../components/SEO';
import SafeIcon from '../common/SafeIcon';
import { useAximStore } from '../store/useAximStore';
import { useAximAuth } from '../hooks/useAximAuth';
import * as LuIcons from 'react-icons/lu';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import DashboardNodes from '../components/DashboardNodes';
import OnyxTerminal from '../components/admin/OnyxTerminal';
import DashboardAccessDenied from '../components/DashboardAccessDenied';
import ContentAnalytics from '../components/admin/ContentAnalytics';
import LeadManager from '../components/admin/LeadManager';

const { LuLayoutDashboard, LuLock, LuActivity, LuInfo, LuDollarSign, LuServer, LuCpu, LuMail } = LuIcons;





const activePlaybooks = [
  { id: 'PB-001', name: 'SEO Audit', status: 'Running', progress: 75 },
  { id: 'PB-002', name: 'Lead Enrichment', status: 'Pending', progress: 0 },
  { id: 'PB-003', name: 'Traffic Analysis', status: 'Running', progress: 40 },
];

export default function Dashboard() {
  const userSession = useAximStore((state) => state.userSession);
  const nodeStatuses = useAximStore((state) => state.nodeStatuses);
  const historicalRevenue = useAximStore((state) => state.historicalRevenue);
  const historicalHealth = useAximStore((state) => state.historicalHealth);
  const partnerLeads = useAximStore((state) => state.partnerLeads);
  const fetchDashboardHistoricalData = useAximStore((state) => state.fetchDashboardHistoricalData);

  useEffect(() => {
    fetchDashboardHistoricalData();
  }, [fetchDashboardHistoricalData]);

  const [selectedNode, setSelectedNode] = useState(null);



  const { session } = useAximAuth();
  const [liveEvents, setLiveEvents] = useState([]);
  const [metrics, setMetrics] = useState({ conversions: 0, funnel_starts: 0, error_count: 0, reconciled_revenue: 0, affiliate_conversions: 0 });
  const [criticalAlert, setCriticalAlert] = useState(null);

  useEffect(() => {
    // Only subscribe if authenticated
    if (!userSession) return;

    const fetchMetrics = async () => {
      try {
        const { data, error } = await supabase.rpc('get_executive_metrics');
        if (!error && data) {
          setMetrics({
            conversions: data.conversions || 0,
            funnel_starts: data.funnel_starts || 0,
            error_count: data.error_count || 0,
            reconciled_revenue: data.reconciled_revenue || 0,
            affiliate_conversions: data.affiliate_conversions || 0
          });
        }
      } catch (e) {

      }
    };

    fetchMetrics();

    const interval = setInterval(fetchMetrics, 30000); // Poll every 30s as backup

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
        { event: 'INSERT', schema: 'public', table: 'telemetry_logs' },
        (payload) => {
           if (payload.new && payload.new.severity === 'CRITICAL') {
              setCriticalAlert(payload.new.trace_id || 'UNKNOWN_TRACE');
           }
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
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [session, userSession]);

  const hasAccess = userSession || session;

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-20 relative z-10">

      <AnimatePresence>
        {criticalAlert && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-0 left-0 right-0 z-50 bg-red-600/90 text-white p-4 flex justify-between items-center shadow-lg border-b border-red-500 backdrop-blur-md"
          >
            <div className="font-bold uppercase tracking-wider text-sm flex items-center gap-2">
              ⚠️ AUTOMATED QA ALERT: PDF Generation formatting failed for Trace ID [{criticalAlert}].
            </div>
            <button
              onClick={() => setCriticalAlert(null)}
              className="text-white hover:text-red-200 transition-colors uppercase text-xs font-mono border border-white/20 px-3 py-1 rounded"
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <SEO title="Executive Dashboard" description="AXiM Internal Command Center."  url="https://axim.us.com/dashboard"/>

      <div className="mb-12 border-b border-white/10 pb-6 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-2 flex items-center gap-3 text-white">
            <SafeIcon icon={LuLayoutDashboard} className="text-axim-purple" />
            Executive Hub
          </h1>
          <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Internal Access Only // Authorized Personnel</p>
        </div>
        <div className="px-4 py-2 bg-axim-purple/10 border border-axim-purple/30 text-axim-purple font-mono text-xs uppercase tracking-widest flex items-center gap-2 rounded-sm shadow-[0_0_15px_rgba(125,0,255,0.1)]">
          <div className="w-2 h-2 bg-axim-purple rounded-full animate-pulse"></div>
          Secure Connection Established
        </div>
      </div>

      {!hasAccess ? (
        <DashboardAccessDenied />
      ) : (
        <div className="space-y-8">
          {/* Top Row: Revenue & Health */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Revenue Chart Widget */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-sm"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-axim-gold/10 border border-axim-gold/30 flex items-center justify-center rounded-sm text-axim-gold">
                  <SafeIcon icon={LuDollarSign} className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-black uppercase text-white tracking-widest">Micro-App Revenue</h3>
              </div>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={historicalRevenue} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F0FF00" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#F0FF00" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 10, fontFamily: 'monospace'}} axisLine={false} tickLine={false} />
                    <YAxis stroke="rgba(255,255,255,0.3)" tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 10, fontFamily: 'monospace'}} axisLine={false} tickLine={false} tickFormatter={(val) => `$${val}`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0a0a0a', borderColor: 'rgba(240,255,0,0.3)', color: '#fff', fontFamily: 'monospace', fontSize: '12px' }}
                      itemStyle={{ color: '#F0FF00' }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#F0FF00" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Infrastructure Health Widget */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "circOut",
                  delay: 0.1  ,
                }}
              className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-sm flex flex-col"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-axim-gold/10 border border-axim-gold/30 flex items-center justify-center rounded-sm text-axim-gold">
                  <SafeIcon icon={LuServer} className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-black uppercase text-white tracking-widest">Infrastructure Health</h3>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <div className="p-4 bg-black/40 border border-white/10 rounded-sm">
                  <div className="text-[0.6rem] font-mono text-zinc-500 uppercase mb-1">System Errors</div>
                  <div className="font-bold text-xl text-axim-gold font-mono">{metrics.error_count}</div>
                </div>
                <div className="p-4 bg-black/40 border border-white/10 rounded-sm">
                  <div className="text-[0.6rem] font-mono text-zinc-500 uppercase mb-1">Funnel Starts</div>
                  <div className="font-bold text-xl text-white font-mono">{metrics.funnel_starts}</div>
                </div>
                <div className="p-4 bg-black/40 border border-white/10 rounded-sm">
                  <div className="text-[0.6rem] font-mono text-zinc-500 uppercase mb-1">Conversions</div>
                  <div className="font-bold text-xl text-white font-mono">{metrics.conversions}</div>
                </div>
                <div className="p-4 bg-black/40 border border-white/10 rounded-sm">
                  <div className="text-[0.6rem] font-mono text-zinc-500 uppercase mb-1">Tabby Reconciled</div>
                  <div className="font-bold text-xl text-axim-gold font-mono">{metrics.reconciled_revenue === 0 ? "VERIFYING..." : `$${metrics.reconciled_revenue.toLocaleString()}`}</div>
                </div>
                <div className="p-4 bg-black/40 border border-white/10 rounded-sm">
                  <div className="text-[0.6rem] font-mono text-zinc-500 uppercase mb-1">WP Affiliates</div>
                  <div className="font-bold text-xl text-axim-purple font-mono">{metrics.affiliate_conversions === 0 ? "Awaiting Sync" : metrics.affiliate_conversions}</div>
                </div>
              </div>
              <div className="flex-grow h-[120px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historicalHealth} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="time" stroke="rgba(255,255,255,0.3)" tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 10, fontFamily: 'monospace'}} axisLine={false} tickLine={false} />
                    <YAxis stroke="rgba(255,255,255,0.3)" tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 10, fontFamily: 'monospace'}} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0a0a0a', borderColor: 'rgba(125,0,255,0.3)', color: '#fff', fontFamily: 'monospace', fontSize: '12px' }}
                      itemStyle={{ color: '#7D00FF' }}
                    />
                    <Line type="monotone" dataKey="latency" stroke="#7D00FF" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Fleet Health Widget */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "circOut",
                  delay: 0.15  ,
                }}
              className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-sm flex flex-col"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-axim-purple/10 border border-axim-purple/30 flex items-center justify-center rounded-sm text-axim-purple">
                  <SafeIcon icon={LuServer} className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-black uppercase text-white tracking-widest">Fleet Health</h3>
              </div>
              <div className="flex-grow">
                <DashboardNodes nodeStatuses={nodeStatuses} selectedNode={selectedNode} setSelectedNode={setSelectedNode} />
              </div>
            </motion.div>

          </div>


          {/* Content Analytics Row */}
          <div className="grid grid-cols-1 mb-8">
            <ContentAnalytics />
          </div>

          {/* Bottom Row: Active Playbooks & Live Events */}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Active Playbooks */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "circOut",
                  delay: 0.2  ,
                }}
              className="lg:col-span-2 p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-sm"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-axim-purple/10 border border-axim-purple/30 flex items-center justify-center rounded-sm text-axim-purple">
                  <SafeIcon icon={LuCpu} className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-black uppercase text-white tracking-widest">Active Onyx Playbooks</h3>
              </div>

              <div className="space-y-4">
                {activePlaybooks.map(pb => (
                  <div key={pb.id} className="p-4 bg-black/40 border border-white/10 rounded-sm">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-zinc-500 uppercase">{pb.id}</span>
                        <span className="font-bold text-white uppercase tracking-wider">{pb.name}</span>
                      </div>
                      <span className={`text-xs font-mono uppercase px-2 py-1 border rounded-sm ${pb.status === 'Running' ? 'text-axim-gold border-axim-gold/30 bg-axim-gold/10' : 'text-zinc-400 border-zinc-600 bg-zinc-800'}`}>
                        {pb.status}
                      </span>
                    </div>
                    <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pb.progress}%` }}
                        transition={{ duration: 0.4, ease: "circOut",
                }}
                        className={`h-full ${pb.status === 'Running' ? 'bg-axim-purple' : 'bg-zinc-500'}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Live Events Sidebar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "circOut",
                  delay: 0.3  ,
                }}
              className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-sm flex flex-col"
            >
              <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
                <SafeIcon icon={LuActivity} className="text-axim-purple animate-pulse" />
                <h3 className="text-sm font-black uppercase text-white tracking-widest">Live Event Feed</h3>
              </div>

              <div className="flex-grow space-y-3 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
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
                         className={`p-3 text-xs font-mono border rounded-sm ${ev.type === 'error' ? 'border-red-500/30 bg-red-500/10 text-red-400' : ev.type === 'success' ? 'border-axim-gold/30 bg-axim-gold/10 text-axim-gold' : 'border-axim-purple/30 bg-axim-purple/10 text-axim-purple'}`}
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
            </motion.div>

            <LeadManager />
          </div>
        </div>

      )}

      {hasAccess && <OnyxTerminal />}
    </div>
  );
}
