# Telemetry Status

## Telemetry Pipeline

The telemetry pipeline is activated and dispatching successfully to the Cloudflare workers.
Buffer limits for IndexedDB/localStorage offline storage in `src/lib/telemetry.js` have been increased to 100 max events.

## Auth Resilience

Auth session state handles errors gracefully: `src/hooks/useAximAuth.js` is adjusted to prevent race condition loaders and avoids unmounting user sessions unnecessarily on network `500` faults by leveraging `localStore` optimistic cache states.

## UI Indicators

`TelemetryBar.jsx` animates smoothly based on offline/buffering edge states, and node status colors properly reflect telemetry ping states in `DashboardNodes.jsx`.

## Current Endpoints
- `/api/telemetry` -> Edge proxy queue -> Core Database
