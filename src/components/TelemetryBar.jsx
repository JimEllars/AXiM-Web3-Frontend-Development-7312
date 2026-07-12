import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAximStore } from "../store/useAximStore";
import { supabase } from "../lib/supabase";

export default function TelemetryBar({ label, color, initialValue }) {
  const telemetryCollection = useAximStore((state) => state.telemetryCollection);

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

            // Map the parsed real metric to a reasonable layout scaled range.
            // e.g. mapping an arbitrary payload load pattern to a 0-100 gauge.
            if (actualValue > 0) {
              setValue((prev) => {
                 // scale fluidly: track real operational load rather than simply incrementing
                 // Assuming payload values are absolute state or need to be smoothed.
                 // Let's use the actualValue directly if it represents a bounded metric,
                 // otherwise use it to adjust the bar in a non-crutch way.
                 // We will set the value directly based on actualValue mapping to 1-100 to show load
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
    <div>
      <div className="flex justify-between text-[0.6rem] mb-2 uppercase items-center">
        <span className="flex items-center">
          <span
            className={`w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] mr-2 relative inline-block animate-pulse ${pulse ? 'scale-125 !bg-emerald-300 !shadow-[0_0_20px_rgba(16,185,129,1)]' : ''}`}
          />
          <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest bg-white/5 px-2 py-0.5 border border-white/5 rounded-sm select-none mr-2">
            [NET_LATENCY: {latencyInfo.rtt}MS // {latencyInfo.type}]
          </span>
          {label}
        </span>
        <span className={textColor}>{value}%</span>
      </div>
      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
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
