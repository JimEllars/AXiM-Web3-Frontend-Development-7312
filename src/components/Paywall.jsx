import React, { useState } from 'react';
import { logTelemetry } from '../lib/telemetry';

export default function Paywall({ price, productId, web3Gate, children }) {
  const [isUnlocked, setIsUnlocked] = useState(false);

  const handleBypass = (method) => {
    logTelemetry('paywall_bypassed_test', { method, product: productId });
    setIsUnlocked(true);
  };

  React.useEffect(() => {
    if (!isUnlocked) {
      logTelemetry('paywall_viewed', { product: productId });
    }
  }, [isUnlocked, productId]);

  if (isUnlocked) {
    return <>{children}</>;
  }

  return (
    <div className="relative bg-[#050505] border border-axim-gold/30 p-8 flex flex-col items-center justify-center min-h-[300px] text-center overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-axim-gold/10 blur-[50px] pointer-events-none" />

      <div className="relative z-10 space-y-6 max-w-sm mx-auto">
        <div>
          <h3 className="text-xl font-bold text-white tracking-widest uppercase font-mono mb-2">Restricted Access</h3>
          <p className="text-sm text-zinc-400 font-mono">Unlock this module to continue.</p>
        </div>

        <div className="text-3xl font-black text-axim-gold font-mono tracking-wider">
          ${price}
        </div>

        <div className="space-y-3 w-full">
          <button
            onClick={() => handleBypass('stripe')}
            className="w-full py-3 bg-axim-gold text-black font-bold uppercase tracking-wider text-xs border border-axim-gold hover:bg-white hover:border-white transition-colors"
          >
            Pay with Stripe (Test)
          </button>

          {web3Gate && (
            <button
              onClick={() => handleBypass('web3')}
              className="w-full py-3 bg-transparent text-white font-bold uppercase tracking-wider text-xs border border-white/20 hover:border-axim-gold hover:text-axim-gold transition-colors"
            >
              Connect Wallet to Bypass
            </button>
          )}
        </div>
      </div>

      {/* Scanline effect */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-20" />
    </div>
  );
}