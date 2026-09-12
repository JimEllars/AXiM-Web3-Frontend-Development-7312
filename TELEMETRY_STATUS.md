# Telemetry Status

Baseline latencies:
- Telemetry Sync: ~150ms
- Worker Latency: ~50ms

Modifications:
- Modified `src/lib/telemetry.js` to batch events and transmit performance metrics.
- Modified `workers/telemetry-worker.js` to return 202 instead of 204.
- Modified `src/hooks/useAximAuth.js` and `src/components/ProtectedRoute.jsx` for silent session validation.
- Modified `src/components/admin/OnyxTerminal.jsx` to debounce terminal output and emit telemetry events.
- Updated `public/_routes.json` to properly map Cloudflare pages routing.
