import { useAximStore } from '../store/useAximStore';

let isFlushing = false;

export function rehydrateTelemetry() {
  if (typeof window === 'undefined') return;
  try {
    const cached = localStorage.getItem('axim_telemetry_cache');
    if (cached) {
      const parsedCache = JSON.parse(cached);
      if (Array.isArray(parsedCache) && parsedCache.length > 0) {
        // Ensure Zustand persist is loaded by delaying slightly, or merge directly.
        setTimeout(() => {
          const store = useAximStore.getState();
          const currentCollection = store.telemetryCollection || [];
          const existingIds = new Set(currentCollection.map(e => e.id));

          const uniqueCached = parsedCache.filter(e => !existingIds.has(e.id));
          if (uniqueCached.length > 0) {
            useAximStore.setState({ telemetryCollection: [...currentCollection, ...uniqueCached] });
          }
        }, 0);
      }
    }
  } catch (err) {
    console.error("Failed to rehydrate telemetry from local cache", err);
  }
}

// Rehydrate on load
rehydrateTelemetry();

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
      const collection = useAximStore.getState().telemetryCollection;
      localStorage.setItem('axim_telemetry_cache', JSON.stringify(collection));
      window.dispatchEvent(new window.CustomEvent('axim-telemetry-update', { detail: event }));
    }
  } catch (e) {
    console.error("Telemetry error", e);
  }

  console.log(`[TELEMETRY: ${type}]`, payload);
}

export async function flushTelemetryQueue(force = false) {
  const telemetryStore = useAximStore.getState().telemetryCollection;
  if (isFlushing || telemetryStore.length === 0) return;
  isFlushing = true;

  try {
    const payload = JSON.stringify(telemetryStore);
    const endpoint = import.meta.env.VITE_TELEMETRY_ENDPOINT || import.meta.env.VITE_ONYX_WORKER_URL;

    if (!endpoint) {
        console.log('[MOCK TELEMETRY SYNC]', payload);
        useAximStore.setState({ telemetryCollection: [] });
        if (typeof window !== 'undefined') {
          localStorage.removeItem('axim_telemetry_cache');
        }
        return;
    }

    let success = false;

    if (typeof window !== 'undefined' && window.fetch) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-AXiM-Internal-Key': import.meta.env.VITE_AXIM_INTERNAL_KEY || 'UNSET_DEV_KEY'
          },
          body: payload,
          keepalive: true,
        });
        success = response.ok || response.status === 200 || response.status === 204;
      } catch (fetchErr) {
        console.error("Fetch telemetry failed, will retry later", fetchErr);
        success = false;
      }
    }

    if (success) {
      useAximStore.setState({ telemetryCollection: [] });
      if (typeof window !== 'undefined') {
        localStorage.removeItem('axim_telemetry_cache');
      }
    }
  } catch (err) {
    // Fail silently, preserving cache for next sync
    console.error("Flush telemetry error, preserving cache", err);
  } finally {
    isFlushing = false;
  }
}
