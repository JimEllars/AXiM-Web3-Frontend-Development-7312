const fs = require('fs');

// Patch useOnyxStream.js
let onyxContent = fs.readFileSync('src/hooks/useOnyxStream.js', 'utf8');

const targetOnyx = `        if (retryCount < maxRetries) {
          retryCount++;
          const backoff = currentBackoff;
          currentBackoff = Math.min(currentBackoff * 2 + Math.random() * 1000, 8000);
          console.warn(\`[Onyx Stream] Connection lost. Retrying in \${backoff}ms...\`);
          logTelemetry('onyx_stream_retry', { retryCount, backoff });
          setTimeout(connectStream, backoff);`;

const replaceOnyx = `        if (retryCount < maxRetries) {
          retryCount++;
          const backoff = currentBackoff;
          currentBackoff = Math.min(currentBackoff * 2 + Math.random() * 1000, 8000);
          console.warn(\`[Onyx Stream] Connection lost. Retrying in \${backoff}ms...\`);
          logTelemetry('onyx_stream_retry', { retryCount, backoff });

          setMessages(prev => prev.map(msg =>
            msg.id === onyxMessageId
              ? { ...msg, content: msg.content + '\\n[SYSTEM] Reconnecting Uplink...' }
              : msg
          ));

          setTimeout(connectStream, backoff);`;

onyxContent = onyxContent.replace(targetOnyx, replaceOnyx);


const heartbeatTarget = `  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);`;

const heartbeatReplace = `  useEffect(() => {
    let intervalId;
    if (isStreaming) {
      intervalId = setInterval(() => {
        // Send a simulated heartbeat to keep stream alive in UI and potentially trigger server keepalive
        setMessages(prev => {
           // We don't want to actually print the heartbeat to the screen, but we can update state to trigger re-renders or logs
           logTelemetry('onyx_stream_heartbeat', { status: 'alive' });
           return prev;
        });
      }, 15000);
    }

    return () => {
      clearInterval(intervalId);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [isStreaming]);`;

onyxContent = onyxContent.replace(heartbeatTarget, heartbeatReplace);
fs.writeFileSync('src/hooks/useOnyxStream.js', onyxContent);

// Patch OnyxTerminal.jsx
let terminalContent = fs.readFileSync('src/components/admin/OnyxTerminal.jsx', 'utf8');

const targetTerminal = `            <div className="flex items-center gap-2 px-3 py-1 bg-axim-purple/10 border border-axim-purple/30 rounded-sm shadow-[0_0_10px_rgba(147,51,234,0.2)] animate-pulse">
              <div className="w-2 h-2 rounded-full bg-axim-purple shadow-[0_0_8px_rgba(147,51,234,0.8)]" />
              <span className="text-[0.65rem] font-mono text-axim-purple uppercase tracking-widest">{connectionStatus}</span>
            </div>`;

const replaceTerminal = `            <div className="flex items-center gap-2 px-3 py-1 bg-axim-purple/10 border border-axim-purple/30 rounded-sm shadow-[0_0_10px_rgba(147,51,234,0.2)] animate-pulse">
              <div className="w-2 h-2 rounded-full bg-axim-purple shadow-[0_0_8px_rgba(147,51,234,0.8)]" />
              <span className="text-[0.65rem] font-mono text-axim-purple uppercase tracking-widest">
                {connectionStatus === 'STREAMING' ? 'UPLINK ACTIVE' : connectionStatus}
              </span>
            </div>`;

terminalContent = terminalContent.replace(targetTerminal, replaceTerminal);
fs.writeFileSync('src/components/admin/OnyxTerminal.jsx', terminalContent);
