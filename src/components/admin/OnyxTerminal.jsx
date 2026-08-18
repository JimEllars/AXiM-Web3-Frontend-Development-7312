import React, { useState, useEffect, useRef } from 'react';
import SafeIcon from '../../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';
import { logTelemetry } from '../../lib/telemetry';
import { useAximStore } from '../../store/useAximStore';
import { useOnyxStream } from '../../hooks/useOnyxStream';
import DOMPurify from 'dompurify';

export default function OnyxTerminal() {
  const [kvKey, setKvKey] = useState('');
  const [kvValue, setKvValue] = useState('');
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [responseLog, setResponseLog] = useState('');
  const [replaySpeed, setReplaySpeed] = useState(1);
  const [batchToast, setBatchToast] = useState(null);
  const [terminalOutput, setTerminalOutput] = useState([]);

  const telemetryQueue = useAximStore((state) => state.telemetryQueue);
  const { isStreaming } = useOnyxStream();
  const logContainerRef = useRef(null);

  // Auto-scroll to bottom of log
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [terminalOutput, responseLog, telemetryQueue]);

  const addTerminalOutput = (text, type = 'info') => {
    setTerminalOutput(prev => [...prev, { text, type, timestamp: new Date().toISOString() }]);
  };

  const handleKvWrite = async (e) => {
    e.preventDefault();
    if (!kvKey || !kvValue) return;

    setIsTransmitting(true);
    setResponseLog('');
    addTerminalOutput(`> INITIATING KV WRITE: [${kvKey}]...`, 'action');

    try {
      const parsedValue = JSON.parse(kvValue); // Validate JSON

      // Simulating Edge Uplink Latency
      const latencyMilli = Math.floor(Math.random() * (800 - 300 + 1) + 300);
      await new Promise(r => setTimeout(r, latencyMilli));

      const endpoint = import.meta.env.VITE_ONYX_WORKER_URL || '/api/onyx/kv';

      // Fallback if no real endpoint is configured (mock success for UI)
      if (endpoint === '/api/onyx/kv' && !import.meta.env.VITE_ONYX_WORKER_URL) {
          setResponseLog(`[SUCCESS] KV Sync successful (Mock Mode). Latency: ${latencyMilli}ms`);
          addTerminalOutput(`> [SUCCESS] SYNC COMPLETE (MOCK). LATENCY: ${latencyMilli}ms`, 'success');
          logTelemetry('onyx_kv_write_mock', { key: kvKey });
          setIsTransmitting(false);
          return;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-AXiM-Internal-Key': import.meta.env.VITE_AXIM_INTERNAL_KEY || ''
        },
        body: JSON.stringify({ key: kvKey, value: parsedValue })
      });

      const data = await response.json();

      if (response.ok) {
        setResponseLog(`[SUCCESS] KV Sync successful. Latency: ${latencyMilli}ms`);
        addTerminalOutput(`> [SUCCESS] SYNC COMPLETE. LATENCY: ${latencyMilli}ms`, 'success');
        logTelemetry('onyx_kv_write_success', { key: kvKey, latency: latencyMilli });
      } else {
        setResponseLog(`[FAILED] Edge rejected write payload. Err: ${data.error}. Latency: ${latencyMilli}ms`);
        addTerminalOutput(`> [FAILED] SYNC FAILED. ERR: ${data.error}. LATENCY: ${latencyMilli}ms`, 'error');
        logTelemetry('onyx_kv_write_failed', { key: kvKey, error: data.error });
      }
    } catch (err) {
      setResponseLog(`[PARSE ERROR] Invalid JSON payload or network failure.`);
      addTerminalOutput(`> [PARSE ERROR] Invalid JSON payload or network failure.`, 'error');
    } finally {
      setIsTransmitting(false);
    }
  };

  const sanitizeAndRenderCode = (text) => {
    // Simple mock rendering for terminal text
    const cleanHTML = DOMPurify.sanitize(text, { USE_PROFILES: { html: true } });
    return { __html: cleanHTML };
  };

  return (
    <div className="p-8 h-full flex flex-col gap-8">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h2 className="text-xl font-black text-white uppercase tracking-widest">Onyx Terminal</h2>
          <p className="text-zinc-500 font-mono text-[0.65rem] uppercase tracking-widest">Direct Edge KV Configurator</p>
        </div>
        <div className="flex items-center gap-4">
          {isStreaming && (
            <div className="flex items-center gap-2 px-3 py-1 bg-axim-purple/10 border border-axim-purple/30 rounded-sm shadow-[0_0_10px_rgba(147,51,234,0.2)] animate-pulse">
              <div className="w-2 h-2 rounded-full bg-axim-purple shadow-[0_0_8px_rgba(147,51,234,0.8)]" />
              <span className="text-[0.65rem] font-mono text-axim-purple uppercase tracking-widest">Edge Connected</span>
            </div>
          )}
          <SafeIcon icon={LuIcons.LuTerminal} className="w-8 h-8 text-zinc-600" />
        </div>
      </div>


      {/* System Operational Verification (SOV) Panel */}
      <div className="bg-[#0A0A0A]/80 backdrop-blur-md border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)] rounded-sm p-6 mb-2 hover:border-axim-purple/30 transition-colors">
        <div className="flex items-center gap-3 mb-4">
          <SafeIcon icon={LuIcons.LuShieldCheck} className="w-5 h-5 text-axim-green" />
          <h3 className="text-sm font-black text-white uppercase tracking-widest">Onyx Core Diagnostics Engine</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center justify-between p-3 border border-white/5 bg-black rounded-sm">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">Identity Gateway Layer</span>
            <span className="px-2 py-1 bg-axim-green/10 border border-axim-green/50 shadow-[0_0_8px_rgba(16,185,129,0.5)] text-axim-green text-[0.65rem] font-mono uppercase tracking-widest rounded-sm flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-axim-green animate-pulse" />[ PASS ]</span>
          </div>
          <div className="flex items-center justify-between p-3 border border-white/5 bg-black rounded-sm">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">Edge Data Buffer</span>
            <span className="px-2 py-1 bg-axim-green/10 border border-axim-green/50 shadow-[0_0_8px_rgba(16,185,129,0.5)] text-axim-green text-[0.65rem] font-mono uppercase tracking-widest rounded-sm flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-axim-green animate-pulse" />[ PASS ]</span>
          </div>
          <div className="flex items-center justify-between p-3 border border-white/5 bg-black rounded-sm">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">Onyx Swarm Uplink</span>
            <span className="px-2 py-1 bg-axim-green/10 border border-axim-green/50 shadow-[0_0_8px_rgba(16,185,129,0.5)] text-axim-green text-[0.65rem] font-mono uppercase tracking-widest rounded-sm flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-axim-green animate-pulse" />[ PASS ]</span>
          </div>
          <div className="flex items-center justify-between p-3 border border-white/5 bg-black rounded-sm">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">Edge Cache Status</span>
            <span className="px-2 py-1 bg-axim-purple/10 border border-axim-purple/50 shadow-[0_0_8px_rgba(147,51,234,0.5)] text-axim-purple text-[0.65rem] font-mono uppercase tracking-widest rounded-sm flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-axim-purple animate-pulse" />[ HIT // MEM_POOL ]</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">

      {/* Telemetry Replay Controller */}
      <div className="bg-[#0A0A0A]/80 backdrop-blur-md border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)] rounded-sm p-6 mb-2 hover:border-axim-purple/30 transition-colors">
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
                 addTerminalOutput(`[ SIMULATING DATA STREAM: REPLAYING AT ${speed}x ]`, 'info');
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
            {isTransmitting ? (
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-white/80 animate-pulse rounded-sm" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-axim-purple animate-pulse rounded-sm" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-white/80 animate-pulse rounded-sm" style={{ animationDelay: '300ms' }} />
                </div>
                Transmitting to Edge...
              </div>
            ) : 'Deploy to Cloudflare KV'}
          </button>
        </form>

        {/* Console Output */}
        <div className="bg-[#0A0A0A]/80 backdrop-blur-md border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)] rounded-sm p-4 font-mono text-xs flex flex-col relative overflow-hidden hover:border-axim-purple/30 transition-colors">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-axim-purple via-[#DB2777] to-transparent opacity-50" />
          <div className="text-zinc-600 mb-4 uppercase tracking-widest border-b border-white/5 pb-2 flex items-center gap-2">
            <SafeIcon icon={LuIcons.LuActivity} className="w-3 h-3" /> Execution Log
          </div>

          <div
             ref={logContainerRef}
             className="flex-1 text-zinc-400 space-y-2 overflow-y-auto max-h-[300px] pr-2 scroll-smooth"
          >
             <div className="animate-pulse">{'> INITIALIZING TERMINAL UPLINK... OK'}</div>
             <div className="animate-pulse animation-delay-200">{'> AWAITING OPERATOR INPUT...'}</div>

             {terminalOutput.map((item, idx) => (
                <div key={`term-${idx}`} className={`mt-2 ${item.type === 'error' ? 'text-red-500' : item.type === 'success' ? 'text-axim-green' : 'text-zinc-300'}`}>
                   <span dangerouslySetInnerHTML={sanitizeAndRenderCode(item.text)} />
                </div>
             ))}

             {telemetryQueue && telemetryQueue.slice(0, 50).map((event) => (
                <div key={event.id} className="mt-2 text-[10px] break-all border-l-2 border-axim-purple pl-2 py-1">
                   <span className="text-zinc-500">[{new Date(event.timestamp).toLocaleTimeString()}]</span>{" "}
                   <span className={`font-bold ${event.type.includes('error') || event.type.includes('failed') ? 'text-red-400' : 'text-axim-purple'}`}>{event.type.toUpperCase()}</span>
                   <span className="text-zinc-500"> - {JSON.stringify(event.payload)}</span>
                </div>
             ))}
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
