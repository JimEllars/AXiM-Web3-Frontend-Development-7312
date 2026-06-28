import { useAximStore } from '../store/useAximStore';

let isFlushing = false;

export function getTelemetryStore() {
  return [...useAximStore.getState().telemetryCollection];
}

export function logTelemetry(type, payload) {
  const event = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    type,
    payload,
  };

  useAximStore.getState().logTelemetryEvent(event);

  try {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new window.CustomEvent('axim-telemetry-update', { detail: event }));
    }
  } catch (e) { console.error("Telemetry error", e); }

  console.log(`[TELEMETRY: ${type}]`, payload);
}

export async function flushTelemetryQueue(force = false) {
  const telemetryStore = useAximStore.getState().telemetryCollection;
  if (isFlushing || telemetryStore.length === 0) return;
  isFlushing = true;

  try {
    const payload = JSON.stringify(telemetryStore);
    const endpoint = import.meta.env.VITE_TELEMETRY_ENDPOINT;

    if (!endpoint) {
        console.log('[MOCK TELEMETRY SYNC]', payload);
        useAximStore.setState({ telemetryCollection: [] });
        return;
    }

    let success = false;

    // Use navigator.sendBeacon if available
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      success = navigator.sendBeacon(endpoint, payload);
    }

    if (!success && typeof window !== 'undefined' && window.fetch) {
      // Fallback to fetch
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true,
      });
      success = response.ok;
    }

    if (success) {
      useAximStore.setState({ telemetryCollection: [] });
    }
  } catch (err) {
    // Fail silently, preserving cache for next sync
  } finally {
    isFlushing = false;
  }
}
