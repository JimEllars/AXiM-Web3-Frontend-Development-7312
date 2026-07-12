import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAximStore } from "../store/useAximStore";
import { supabase } from "../lib/supabase";

export default function TelemetryBar({ label, color, initialValue }) {
  const telemetryCollection = useAximStore((state) => state.telemetryCollection);

  const [value, setValue] = useState(initialValue);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const collectionLength = Array.isArray(telemetryCollection) ? telemetryCollection.length : 0;
    const calculatedValue = Math.min(100, collectionLength * 5);
    setValue(calculatedValue > 0 ? calculatedValue : initialValue);
  }, [telemetryCollection, initialValue]);

  const triggerPulseState = () => {
    setPulse(true);
    setTimeout(() => setPulse(false), 300);
    setValue((prev) => Math.min(100, prev + 2));
  };

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
          triggerPulseState();
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
