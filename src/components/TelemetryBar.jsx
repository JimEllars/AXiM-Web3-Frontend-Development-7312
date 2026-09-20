import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAximStore } from "../store/useAximStore";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { theme } from "../config/theme";

import { LuChevronDown, LuChevronUp } from "react-icons/lu";
export default function TelemetryBar({ label, color, initialValue }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const telemetryCollection = useAximStore((state) => state.telemetryCollection);
  const telemetryQueue = useAximStore((state) => state.telemetryQueue);
  const isTelemetryPolling = useAximStore((state) => state.isTelemetryPolling);
  const isWeb3Authenticated = useAximStore((state) => state.isWeb3Authenticated);

  const [value, setValue] = useState(initialValue);
  const [pulse, setPulse] = useState(false);
  const [latencyInfo, setLatencyInfo] = useState({ rtt: 50, type: '4G' });
  const [edgeRegion, setEdgeRegion] = useState('UNKNOWN_RAY');

  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.connection) {
      setLatencyInfo({
        rtt: navigator.connection.rtt || 50,
        type: navigator.connection.effectiveType || '4G'
      });

      const updateConnection = () => {
        setLatencyInfo({
          rtt: navigator.connection.rtt || 50,
          type: navigator.connection.effectiveType || '4G'
        });
      };

      navigator.connection.addEventListener('change', updateConnection);

      const pingHealth = () => {
        const start = Date.now();
        fetch('/api/telemetry/health', { signal: AbortSignal.timeout(3000) })
          .then(res => {
            if (!res.ok) throw new Error('Worker not 200');
            const ray = res.headers.get('cf-ray');
            if (ray) setEdgeRegion(ray.split('-')[1] || ray);
            setLatencyInfo(prev => ({ ...prev, rtt: Date.now() - start }));
          })
          .catch(() => {
            fetch('/', { method: 'HEAD', signal: AbortSignal.timeout(3000) })
              .then(res => {
                if (!res.ok) {
                  setEdgeRegion('OFFLINE');
                  setLatencyInfo({ rtt: 0, type: 'LOCAL' });
                  return;
                }
                const ray = res.headers.get('cf-ray');
                if (ray) setEdgeRegion(ray.split('-')[1] || ray);
              })
              .catch(() => {
                setEdgeRegion('OFFLINE');
                setLatencyInfo({ rtt: 0, type: 'LOCAL' });
              });
          });
      };
      pingHealth();
      const interval = setInterval(pingHealth, 15000);
      return () => {
        clearInterval(interval);
        navigator.connection.removeEventListener('change', updateConnection);
      };
    }
  }, []);

  useEffect(() => {
    const handleLocalTelemetryUpdate = (event) => {
        setPulse(true);
        setTimeout(() => setPulse(false), 300);
    };
    if (typeof window !== 'undefined') {
        window.addEventListener('axim-telemetry-update', handleLocalTelemetryUpdate);
        window.addEventListener('axim-telemetry-fallback-sync', handleLocalTelemetryUpdate);
        window.addEventListener('axim-telemetry-queue-update', handleLocalTelemetryUpdate);
    }
    return () => {
        if (typeof window !== 'undefined') {
            window.removeEventListener('axim-telemetry-update', handleLocalTelemetryUpdate);
            window.removeEventListener('axim-telemetry-fallback-sync', handleLocalTelemetryUpdate);
            window.removeEventListener('axim-telemetry-queue-update', handleLocalTelemetryUpdate);
        }
    }
  }, []);

  useEffect(() => {
    const collectionLength = Array.isArray(telemetryCollection) ? telemetryCollection.length : 0;
    const calculatedValue = Math.min(100, collectionLength * 5);
    setValue(calculatedValue > 0 ? calculatedValue : initialValue);
  }, [telemetryCollection, initialValue]);

  useEffect(() => {
    let liveTelemetryChannel;
    try {
      liveTelemetryChannel = supabase
        .channel('public:api_usage_logs')
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'telemetry_ingress'
        }, (payload) => {
          setPulse(true);
          setTimeout(() => setPulse(false), 300);

          if (payload.new) {
            let actualValue = 0;
            if (payload.new.load !== undefined) {
              actualValue = typeof payload.new.load === 'number' ? payload.new.load : 0;
            } else if (payload.new.metrics && typeof payload.new.metrics.value === 'number') {
              actualValue = payload.new.metrics.value;
            } else if (typeof payload.new.value === 'number') {
              actualValue = payload.new.value;
            }

            if (actualValue > 0) {
              setValue((prev) => {
                 const mappedValue = Math.min(100, Math.max(0, actualValue));
                 return mappedValue;
              });
            }
          }
        })
        .subscribe();
    } catch (e) {
      console.warn("Telemetry WebSocket fallback:", e);
    }

    return () => {
      if (liveTelemetryChannel) {
        supabase.removeChannel(liveTelemetryChannel);
      }
    };
  }, []);

  const colorClass =
    color === "axim-purple"
      ? "bg-axim-purple"
      : color === "axim-gold"
        ? "bg-axim-gold"
        : "bg-axim-gold";

  const textColor =
    color === "axim-purple"
      ? "text-axim-purple"
      : color === "axim-gold"
        ? "text-axim-gold"
        : "text-axim-gold";

  const isOffline = edgeRegion === 'OFFLINE';
  const isBuffering = telemetryQueue?.length > 0;

  const statusDotClass = isOffline
    ? "bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.6)]"
    : (isBuffering ? "bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.6)]" : "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.6)]");

  const statusDotPulse = isOffline
    ? "!bg-rose-300 !shadow-[0_0_24px_rgba(244,63,94,1)]"
    : (isBuffering ? "!bg-amber-300 !shadow-[0_0_24px_rgba(245,158,11,1)]" : "!bg-emerald-300 !shadow-[0_0_24px_rgba(16,185,129,1)]");

  return (
    <div aria-live="polite" className={`bg-[${theme.colors.background}]/90 backdrop-blur-xl p-2 md:p-4 rounded-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-300 hover:border-white/20`}>
      {/* Mobile view */}
      <div className="md:hidden flex flex-col gap-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between gap-2 w-full focus:outline-none focus:ring-1 focus:ring-axim-purple rounded"
          aria-expanded={isExpanded}
          aria-label="Toggle Telemetry Details"
        >
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${statusDotClass} relative inline-block transition-all duration-300 ease-in-out ${pulse ? `scale-150 brightness-150 ${statusDotPulse}` : ''}`} />
            <span className="text-[10px] font-mono text-zinc-300 uppercase tracking-widest">{label}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`${textColor} font-bold text-xs drop-shadow-md`}>{value}%</span>
            {isExpanded ? <LuChevronUp className="w-4 h-4 text-zinc-400" /> : <LuChevronDown className="w-4 h-4 text-zinc-400" />}
          </div>
        </button>
        <motion.div
          initial="collapsed"
          animate={isExpanded ? "expanded" : "collapsed"}
          variants={{
            expanded: { opacity: 1, height: "auto", marginTop: 8 },
            collapsed: { opacity: 0, height: 0, marginTop: 0 }
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden flex flex-col gap-1.5"
        >
          <span className="inline-flex text-[9px] font-mono text-zinc-300 uppercase tracking-widest bg-white/5 px-2.5 py-1 border border-white/10 rounded-md select-none shadow-sm backdrop-blur-sm">
            [NET_LATENCY: {latencyInfo.rtt}MS // {latencyInfo.type}] // [EDGE_RAY: {edgeRegion}]
          </span>
          <span className="inline-flex text-[9px] font-mono text-zinc-300 uppercase tracking-widest bg-white/5 px-2.5 py-1 border border-white/10 rounded-md select-none shadow-sm backdrop-blur-sm">
            QUEUE: {telemetryQueue?.length || 0} EVENTS
          </span>
          <span className="inline-flex text-[9px] font-mono text-zinc-300 uppercase tracking-widest bg-white/5 px-2.5 py-1 border border-white/10 rounded-md select-none shadow-sm backdrop-blur-sm">
            EDGE_UPLINK: {edgeRegion === 'OFFLINE' ? <span className="text-rose-400">UNREACHABLE</span> : (telemetryQueue?.length > 0 ? <span className="text-amber-400">BUFFERING OFFLINE</span> : <span className="text-emerald-400">CONNECTED</span>)}
          </span>
          <span className="inline-flex text-[9px] font-mono text-zinc-300 uppercase tracking-widest bg-white/5 px-2.5 py-1 border border-white/10 rounded-md select-none shadow-sm backdrop-blur-sm">
            {isSupabaseConfigured ? '[Live Core Connected]' : '[Sessions: EDGE-CACHED]'}
          </span>
          {isWeb3Authenticated && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 font-mono text-[8px] text-emerald-400 uppercase tracking-widest rounded-md select-none pointer-events-none shadow-sm backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              [TELEMETRY_NODE: ARBITRUM_EDGE_ACTIVE]
            </span>
          )}
        </motion.div>
      </div>

      {/* Desktop/Tablet view */}
      <div className="hidden md:flex justify-between text-[0.6rem] mb-2 uppercase items-center min-h-[20px]">
        <span className="flex flex-wrap items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full ${statusDotClass} relative inline-block transition-all duration-300 ease-in-out ${pulse ? `scale-150 ${statusDotPulse}` : ''}`}
          />
          <span className="hidden sm:inline-flex text-[9px] font-mono text-zinc-300 uppercase tracking-widest bg-white/5 px-2.5 py-1 border border-white/10 rounded-md select-none shadow-sm backdrop-blur-sm">
            [NET_LATENCY: {latencyInfo.rtt}MS // {latencyInfo.type}] // [EDGE_RAY: {edgeRegion}]
          </span>
          <span className="hidden md:inline-flex text-[9px] font-mono text-zinc-300 uppercase tracking-widest bg-white/5 px-2.5 py-1 border border-white/10 rounded-md select-none shadow-sm backdrop-blur-sm">
            QUEUE: {telemetryQueue?.length || 0} EVENTS
          </span>
          <span className="hidden sm:inline-flex text-[9px] font-mono text-zinc-300 uppercase tracking-widest bg-white/5 px-2.5 py-1 border border-white/10 rounded-md select-none shadow-sm backdrop-blur-sm">
            EDGE_UPLINK: {edgeRegion === 'OFFLINE' ? <span className="text-rose-400">UNREACHABLE</span> : (telemetryQueue?.length > 0 ? <span className="text-amber-400">BUFFERING OFFLINE</span> : <span className="text-emerald-400">CONNECTED</span>)}
          </span>
          <span className="hidden sm:inline-flex text-[9px] font-mono text-zinc-300 uppercase tracking-widest bg-white/5 px-2.5 py-1 border border-white/10 rounded-md select-none shadow-sm backdrop-blur-sm">
            {isSupabaseConfigured ? '[Live Core Connected]' : '[Sessions: EDGE-CACHED]'}
          </span>

          {isWeb3Authenticated && (
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 font-mono text-[8px] text-emerald-400 uppercase tracking-widest rounded-md select-none pointer-events-none shadow-sm backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              [TELEMETRY_NODE: ARBITRUM_EDGE_ACTIVE]
            </span>
          )}
          {isWeb3Authenticated && (
            <span className="font-mono text-[8px] text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 rounded-md select-none inline-flex items-center gap-1.5 shadow-sm backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              [PERF_NODE: CLS_STABILIZED // 0.00]
            </span>
          )}

          <span className="font-bold text-zinc-200 tracking-wider ml-1">{label}</span>
        </span>
        <span className={`${textColor} font-bold drop-shadow-md`}>{value}%</span>
      </div>
      <div className="h-1 bg-white/10 rounded-full overflow-hidden shadow-inner mt-2 md:mt-0 md:h-1.5">
        <motion.div
          initial={{ width: `${initialValue}%` }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.4, ease: "circOut" }}
          className={`h-full ${colorClass} shadow-[0_0_10px_currentColor]`}
        />
      </div>
    </div>
  );
}
