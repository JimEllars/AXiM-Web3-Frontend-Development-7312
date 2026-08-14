import { useAximStore } from '../store/useAximStore';
import { supabase } from '../lib/supabase';

let isFlushing = false;
let batchQueue = []; // In-memory queue for dispatching batches

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
            useAximStore.setState({ telemetryCollection: [...currentCollection, ...uniqueCached], telemetryQueue: [...(store.telemetryQueue || []), ...uniqueCached] });
            batchQueue = [...batchQueue, ...uniqueCached];
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
    sessionId: typeof window !== 'undefined' ? sessionStorage.getItem('axim_session_id') : undefined,
  };

  // Ensure session id is established silently if not present
  if (typeof window !== 'undefined' && !event.sessionId) {
    const newSessionId = crypto.randomUUID();
    sessionStorage.setItem('axim_session_id', newSessionId);
    event.sessionId = newSessionId;
  }

  useAximStore.getState().logTelemetryEvent(event);
  batchQueue.push(event);

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
  if (isFlushing || batchQueue.length === 0) return;
  isFlushing = true;

  const currentBatch = [...batchQueue];
  batchQueue = []; // Clear queue immediately to capture new events while flushing

  try {
    const payload = JSON.stringify(currentBatch);
    const endpoint = import.meta.env.VITE_TELEMETRY_WORKER_URL || import.meta.env.VITE_TELEMETRY_ENDPOINT || import.meta.env.VITE_ONYX_WORKER_URL || '/api/telemetry';

    if (!endpoint) {
      batchQueue = [...currentBatch, ...batchQueue]; // Restore on fail
      return;
    }

    let success = false;

    if (typeof window !== 'undefined') {
      if (window.navigator?.sendBeacon && force) {
        const blob = new Blob([payload], { type: 'application/json' });
        success = window.navigator.sendBeacon(endpoint, blob);
      } else if (window.fetch) {
try {
          const fetchPromise = fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-AXiM-Internal-Key': import.meta.env.VITE_AXIM_INTERNAL_KEY || 'UNSET_DEV_KEY'
            },
            body: payload,
            keepalive: true,
          });

          const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 8000));
          const response = await Promise.race([fetchPromise, timeoutPromise]);

          if (response.status === 200 || response.status === 204) {
            success = true;
            try {
              if (response.status !== 204) {
                const responseData = await response.json();
                console.log('[TELEMETRY_SYNC_SUCCESS]', responseData);
              }
            } catch (jsonErr) {
              console.warn("Could not parse telemetry response JSON", jsonErr);
            }
          } else {
            success = false;
          }
        } catch (fetchErr) {
          console.warn("Edge telemetry failed, falling back to direct Supabase insert", fetchErr);

          try {
            const { error } = await supabase.from('telemetry_events').insert(currentBatch);
            if (!error) {
               success = true;
               console.log('[TELEMETRY_SYNC_SUCCESS] Fallback via Supabase direct insert successful');
            } else {
               success = false;
               console.error('[TELEMETRY_SYNC_FAILED] Fallback via Supabase direct insert failed', error);
            }
          } catch (supabaseErr) {
            success = false;
            console.error('[TELEMETRY_SYNC_FAILED] Fallback via Supabase direct insert completely failed', supabaseErr);
          }

          // Dispatch a mock success to keep UI functional and prevent infinite queues if worker is offline
          window.dispatchEvent(new window.CustomEvent('axim-telemetry-fallback-sync', { detail: { count: currentBatch.length } }));
        }
      }
    }

    if (success) {
      const store = useAximStore.getState();
      const idsToRemove = new Set(currentBatch.map(e => e.id));

      const newCollection = store.telemetryCollection.filter(e => !idsToRemove.has(e.id));
      const newQueue = store.telemetryQueue.filter(e => !idsToRemove.has(e.id));

      useAximStore.setState({ telemetryCollection: newCollection, telemetryQueue: newQueue });
      if (typeof window !== 'undefined') {
        localStorage.setItem('axim_telemetry_cache', JSON.stringify(newCollection));
      }
    } else {
      // Put back in queue if failed
      batchQueue = [...currentBatch, ...batchQueue];
    }
  } catch (err) {
    // Fail silently, preserving cache for next sync
    batchQueue = [...currentBatch, ...batchQueue];
  } finally {
    isFlushing = false;
  }
}

if (typeof window !== 'undefined') {
  setInterval(() => flushTelemetryQueue(false), 5000);

  const handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      flushTelemetryQueue(true);
    }
  };

  window.addEventListener('visibilitychange', handleVisibilityChange);
  window.addEventListener('pagehide', () => flushTelemetryQueue(true));
}
