import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAximStore } from "../store/useAximStore";
import { supabase } from "../lib/supabase";

export default function TelemetryBar({ label, color, initialValue }) {
  const telemetryCollection = useAximStore((state) => state.telemetryCollection);
  const telemetryQueue = useAximStore((state) => state.telemetryQueue);
  const isTelemetryPolling = useAximStore((state) => state.isTelemetryPolling);
  const isWeb3Authenticated = useAximStore((state) => state.isWeb3Authenticated);

  const [value, setValue] = useState(initialValue);
  const [pulse, setPulse] = useState(false);
  const [latencyInfo, setLatencyInfo] = useState({ rtt: 50, type: '4G' });

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
      return () => {
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
    }
    return () => {
        if (typeof window !== 'undefined') {
            window.removeEventListener('axim-telemetry-update', handleLocalTelemetryUpdate);
            window.removeEventListener('axim-telemetry-fallback-sync', handleLocalTelemetryUpdate);
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
      ? "text-axim-purple bg-axim-purple shadow-[0_0_10px_#00E5FF]"
      : color === "axim-gold"
        ? "text-axim-gold bg-axim-gold shadow-[0_0_10px_#FFEA00]"
        : "text-axim-gold bg-axim-gold shadow-[0_0_10px_#00FF88]";

  const textColor =
    color === "axim-purple"
      ? "text-axim-purple"
      : color === "axim-gold"
        ? "text-axim-gold"
        : "text-axim-gold";

  return (
    <div className="bg-[#050505]/80 backdrop-blur-md p-3 rounded-lg border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
      <div className="flex justify-between text-[0.6rem] mb-2 uppercase items-center">
        <span className="flex flex-wrap items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] relative inline-block transition-transform duration-300 ${pulse ? 'scale-150 !bg-emerald-300 !shadow-[0_0_20px_rgba(16,185,129,1)]' : ''}`}
          />
          <span className="hidden sm:inline-flex text-[9px] font-mono text-zinc-300 uppercase tracking-widest bg-white/5 px-2 py-0.5 border border-white/5 rounded-sm select-none shadow-sm">
            [NET_LATENCY: {latencyInfo.rtt}MS // {latencyInfo.type}]
          </span>
          <span className="hidden md:inline-flex text-[9px] font-mono text-zinc-300 uppercase tracking-widest bg-white/5 px-2 py-0.5 border border-white/5 rounded-sm select-none shadow-sm">
            QUEUE: {telemetryQueue?.length || 0} EVENTS
          </span>
          <span className="hidden sm:inline-flex text-[9px] font-mono text-zinc-300 uppercase tracking-widest bg-white/5 px-2 py-0.5 border border-white/5 rounded-sm select-none shadow-sm">
            EDGE_UPLINK: {isTelemetryPolling ? 'ACTIVE' : 'STANDBY'}
          </span>

          {isWeb3Authenticated && (
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 font-mono text-[8px] text-emerald-400 uppercase tracking-widest rounded-sm select-none pointer-events-none shadow-sm">
              <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
              [TELEMETRY_NODE: ARBITRUM_EDGE_ACTIVE]
            </span>
          )}
          {isWeb3Authenticated && (
            <span className="font-mono text-[8px] text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 rounded-sm select-none inline-flex items-center gap-1 shadow-sm">
              <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
              [PERF_NODE: CLS_STABILIZED // 0.00]
            </span>
          )}

          <span className="font-bold text-zinc-200 tracking-wider ml-1">{label}</span>
        </span>
        <span className={`${textColor} font-bold drop-shadow-md`}>{value}%</span>
      </div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden shadow-inner">
        <motion.div
          initial={{ width: `${initialValue}%` }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.4, ease: "circOut" }}
          className={`h-full ${colorClass.split(" ")[1]} ${colorClass.split(" ")[2]}`}
        />
      </div>
    </div>
  );
}
