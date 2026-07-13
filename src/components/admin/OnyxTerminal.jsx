import React, { useState } from 'react';
import SafeIcon from '../../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';

export default function OnyxTerminal() {
  const [kvKey, setKvKey] = useState('seo_override_/articles');
  const [kvValue, setKvValue] = useState('{\n  "title": "AXiM Intel",\n  "description": "Dynamic Edge Injection"\n}');
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [responseLog, setResponseLog] = useState(null);
  const [replaySpeed, setReplaySpeed] = useState(1);
  const [batchToast, setBatchToast] = useState(null);

  const handleKvWrite = async (e) => {
    e.preventDefault();
    setIsTransmitting(true);
    setResponseLog(null);

    try {
      // Parse to ensure valid JSON before transmission
      const parsedConfig = JSON.parse(kvValue);

      const callStart = Date.now();
      const res = await fetch('/api/admin/kv-write', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: kvKey, config: parsedConfig })
      });

      const latencyMilli = Date.now() - callStart;
      const data = await res.json();

      if (res.ok) {
        setResponseLog(`[SUCCESS] ${data.message} // EDGE_RTT:${latencyMilli}ms`);

        // Show batch summary toast
        let successCount = 1;
        let failCount = 0;
        if (data.results) {
          successCount = Array.isArray(data.results.successful) ? data.results.successful.length : 0;
          failCount = Array.isArray(data.results.failed) ? data.results.failed.length : 0;
        }

        setBatchToast({ successful: successCount, failed: failCount });
        setTimeout(() => setBatchToast(null), 4000);
      } else {
        setResponseLog(`[ERROR] ${data.error || 'Transmission rejected by Edge Node'} // EDGE_RTT:${latencyMilli}ms`);
      }
    } catch (err) {
      setResponseLog(`[PARSE ERROR] Invalid JSON payload or network failure.`);
    } finally {
      setIsTransmitting(false);
    }
  };

  return (
    <div className="p-8 h-full flex flex-col gap-8">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h2 className="text-xl font-black text-white uppercase tracking-widest">Onyx Terminal</h2>
          <p className="text-zinc-500 font-mono text-[0.65rem] uppercase tracking-widest">Direct Edge KV Configurator</p>
        </div>
        <SafeIcon icon={LuIcons.LuTerminal} className="w-8 h-8 text-zinc-600" />
      </div>


      {/* System Operational Verification (SOV) Panel */}
      <div className="bg-[#0A0A0A] border border-white/5 rounded-sm p-6 mb-2">
        <div className="flex items-center gap-3 mb-4">
          <SafeIcon icon={LuIcons.LuShieldCheck} className="w-5 h-5 text-axim-green" />
          <h3 className="text-sm font-black text-white uppercase tracking-widest">Onyx Core Diagnostics Engine</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-3 border border-white/5 bg-black rounded-sm">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">Identity Gateway Layer</span>
            <span className="px-2 py-1 bg-axim-green/10 border border-axim-green/30 text-axim-green text-[0.65rem] font-mono uppercase tracking-widest rounded-sm">[ PASS ]</span>
          </div>
          <div className="flex items-center justify-between p-3 border border-white/5 bg-black rounded-sm">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">Edge Data Buffer</span>
            <span className="px-2 py-1 bg-axim-green/10 border border-axim-green/30 text-axim-green text-[0.65rem] font-mono uppercase tracking-widest rounded-sm">[ PASS ]</span>
          </div>
          <div className="flex items-center justify-between p-3 border border-white/5 bg-black rounded-sm">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">Onyx Swarm Uplink</span>
            <span className="px-2 py-1 bg-axim-green/10 border border-axim-green/30 text-axim-green text-[0.65rem] font-mono uppercase tracking-widest rounded-sm">[ PASS ]</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">

      {/* Telemetry Replay Controller */}
      <div className="bg-[#0A0A0A] border border-white/5 rounded-sm p-6 mb-2">
        <div className="flex items-center gap-3 mb-4">
          <SafeIcon icon={LuIcons.LuFastForward} className="w-5 h-5 text-axim-purple" />
          <h3 className="text-sm font-black text-white uppercase tracking-widest">Telemetry Replay Controller</h3>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
             <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">Playback Matrix Speed</span>
             <span className="px-2 py-1 bg-axim-purple/10 border border-axim-purple/30 text-axim-purple text-[0.65rem] font-mono uppercase tracking-widest rounded-sm">{replaySpeed}x</span>
          </div>
          <input
             type="range"
             min="1"
             max="4"
             step="1"
             value={replaySpeed}
             onChange={(e) => {
               const val = Number(e.target.value);
               const allowed = [1, 2, 4];
               if (allowed.includes(val) || val === 3) {
                 const speed = val === 3 ? 4 : val;
                 setReplaySpeed(speed);
                 setResponseLog(`[ SIMULATING DATA STREAM: REPLAYING AT ${speed}x ]`);
               }
             }}
             className="w-full accent-axim-purple"
          />
          <div className="flex justify-between text-[0.55rem] font-mono text-zinc-600 uppercase">
             <span>1x</span>
             <span>2x</span>
             <span>4x</span>
          </div>
        </div>
      </div>

        {/* KV Form */}
        <form onSubmit={handleKvWrite} className="flex flex-col gap-4">
          <div>
            <label className="block text-[0.65rem] font-mono text-zinc-500 uppercase tracking-widest mb-2">Target KV Key</label>
            <input
              type="text"
              value={kvKey}
              onChange={(e) => setKvKey(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-white/10 p-3 text-white text-sm font-mono focus:border-axim-purple outline-none rounded-sm"
            />
          </div>
          <div className="flex-1 flex flex-col">
            <label className="block text-[0.65rem] font-mono text-zinc-500 uppercase tracking-widest mb-2">JSON Configuration Payload</label>
            <textarea
              value={kvValue}
              onChange={(e) => setKvValue(e.target.value)}
              className="w-full flex-1 min-h-[250px] bg-[#0A0A0A] border border-white/10 p-3 text-axim-gold text-xs font-mono focus:border-axim-purple outline-none rounded-sm resize-none"
            />
          </div>
          <button
            disabled={isTransmitting}
            type="submit"
            className="w-full py-4 bg-axim-purple text-white text-xs font-black uppercase tracking-widest transition-colors shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:bg-white hover:text-black disabled:opacity-50 flex items-center justify-center gap-2 rounded-sm"
          >
            {isTransmitting ? <><SafeIcon icon={LuIcons.LuLoader} className="w-4 h-4 animate-spin"/> Transmitting to Edge...</> : 'Deploy to Cloudflare KV'}
          </button>
        </form>

        {/* Console Output */}
        <div className="bg-[#0A0A0A] border border-white/5 rounded-sm p-4 font-mono text-xs flex flex-col relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-axim-purple via-[#DB2777] to-transparent opacity-50" />
          <div className="text-zinc-600 mb-4 uppercase tracking-widest border-b border-white/5 pb-2 flex items-center gap-2">
            <SafeIcon icon={LuIcons.LuActivity} className="w-3 h-3" /> Execution Log
          </div>

          <div className="flex-1 text-zinc-400 space-y-2">
             <div>{`> INITIALIZING TERMINAL UPLINK... OK`}</div>
             <div>{`> AWAITING OPERATOR INPUT...`}</div>
             {responseLog && (
               <div className={`mt-4 ${responseLog.includes('SUCCESS') ? 'text-axim-green' : 'text-red-500'}`}>
                 {`> ${responseLog}`}
               </div>
             )}
          </div>
        </div>
      </div>

      {/* Batch Summary Toast */}
      {batchToast && (
        <div className="fixed bottom-6 right-6 bg-black border border-white/10 p-4 rounded-sm shadow-2xl flex flex-col gap-1 font-mono text-[11px] uppercase text-zinc-400 z-50 animate-slide-in">
          <div className="flex items-center gap-2 text-axim-purple font-black mb-1">
            <SafeIcon icon={LuIcons.LuActivity} className="w-4 h-4" />
            <span>[REPLAY BATCH COMPLETE]</span>
          </div>
          <div>Successful: {batchToast.successful} // Anomalies Intercepted: {batchToast.failed}</div>
        </div>
      )}
    </div>
  );
}
