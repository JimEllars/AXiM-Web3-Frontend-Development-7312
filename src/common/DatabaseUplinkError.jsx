import React, { useEffect } from 'react';
import { logTelemetry } from '../lib/telemetry';

export default function DatabaseUplinkError({ onRetry }) {
  useEffect(() => {
    logTelemetry('SYSTEM_FAULT', {
      component: 'DatabaseUplinkError',
      trace: 'Network Timeout or Uplink Failure'
    });
  }, []);

  return (
    <section className="py-16 relative z-10">
      <div className="max-w-[1200px] mx-auto px-6 text-center">
        <p className="text-zinc-500 font-mono mb-4">
          LOCAL_BUFFER_ACTIVE
        </p>
        <h2 className="text-xl font-bold text-white mb-2">Network Uplink Failed</h2>
        <p className="text-zinc-400 mb-6 text-sm max-w-md mx-auto">
          We are currently unable to establish a secure connection to the AXiM Core. Please check your connection and try again.
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-6 py-2 bg-white/5 border border-white/10 text-white font-mono uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-colors rounded-sm"
          >
            Retry Connection
          </button>
        )}
      </div>
    </section>
  );
}
