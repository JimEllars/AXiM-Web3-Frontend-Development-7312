const fs = require('fs');

let terminalContent = fs.readFileSync('src/components/admin/OnyxTerminal.jsx', 'utf8');

// We need to use error and isStreaming from useOnyxStream to show "Connected", "Reconnecting...", or "Offline Buffer"
if (!terminalContent.includes('const connectionStatus = error ?')) {
  terminalContent = terminalContent.replace(
    "const { isStreaming } = useOnyxStream();",
    "const { isStreaming, error } = useOnyxStream();\n  const connectionStatus = error ? 'Offline Buffer' : isStreaming ? 'Reconnecting...' : 'Edge Connected';"
  );

  terminalContent = terminalContent.replace(
    '<span className="text-[0.65rem] font-mono text-axim-purple uppercase tracking-widest">Edge Connected</span>',
    '<span className="text-[0.65rem] font-mono text-axim-purple uppercase tracking-widest">{connectionStatus}</span>'
  );

  fs.writeFileSync('src/components/admin/OnyxTerminal.jsx', terminalContent);
}
