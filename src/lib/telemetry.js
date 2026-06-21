
let initialStore = [];
if (typeof window !== 'undefined' && sessionStorage) {
  try {
    const cached = sessionStorage.getItem('axim_telemetry_cache');
    if (cached) {
      initialStore = JSON.parse(cached);
    }
  } catch(e) {
    console.error("Telemetry cache parse error", e);
  }
}
export const telemetryStore = initialStore;

let isFlushing = false;

export function logTelemetry(type, payload) {
  const event = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    type,
    payload,
  };

  telemetryStore.unshift(event);

  // Hard cap telemetry memory at 100 events
  if (telemetryStore.length > 100) {
    telemetryStore.length = 100;
  }

  // Sync to sessionStorage
  if (typeof window !== 'undefined' && sessionStorage) {
    try {
      sessionStorage.setItem('axim_telemetry_cache', JSON.stringify(telemetryStore));
    } catch(e) {
      console.error("Telemetry cache write error", e);
    }
  }

  // Optional: Dispatch a custom event so UI components can re-render if needed
  try {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new window.CustomEvent('axim-telemetry-update', { detail: event }));
    }
  } catch (e) { console.error("Telemetry error", e); }


  console.log(`[TELEMETRY: ${type}]`, payload);
}

export async function flushTelemetry() {
  if (isFlushing || telemetryStore.length === 0) return;
  isFlushing = true;

  try {
    const payload = JSON.stringify(telemetryStore);

    // Use navigator.sendBeacon if available
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      navigator.sendBeacon('/api/telemetry/sync', payload);
    } else if (typeof window !== 'undefined' && window.fetch) {
      // Fallback to fetch
      await fetch('/api/telemetry/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true,
      });
    }
  } catch (err) {
    // Fail silently
  } finally {
    isFlushing = false;
  }
}

// Setup background sync
if (typeof window !== 'undefined') {
  setInterval(() => {
    flushTelemetry();
  }, 60000); // 60 seconds

  window.addEventListener('beforeunload', () => {
    flushTelemetry();
  });
}
