const fs = require('fs');

let content = fs.readFileSync('src/lib/telemetry.js', 'utf8');

// Add online listener
if (!content.includes("window.addEventListener('online'")) {
  content = content.replace(
    "window.addEventListener('pagehide', () => flushTelemetryQueue(true));",
    "window.addEventListener('pagehide', () => flushTelemetryQueue(true));\n  window.addEventListener('online', () => flushTelemetryQueue(true));"
  );
}

// Add setupTelemetryHooks function
const hooksCode = `
export function setupTelemetryHooks() {
  if (typeof window === 'undefined') return;

  // Wallet hooks
  window.addEventListener('wallet_connect', (e) => logTelemetry('wallet_connect', e.detail || {}));
  window.addEventListener('wallet_disconnect', (e) => logTelemetry('wallet_disconnect', e.detail || {}));
  window.addEventListener('chain_switch', (e) => logTelemetry('chain_switch', e.detail || {}));

  // AI query hook
  window.addEventListener('ai_query', (e) => logTelemetry('ai_query', e.detail || {}));
}
`;

if (!content.includes("setupTelemetryHooks")) {
  content += hooksCode;
}

fs.writeFileSync('src/lib/telemetry.js', content);
