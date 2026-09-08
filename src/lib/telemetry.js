import { useAximStore } from '../store/useAximStore';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { localStore } from '../lib/persistence';

let isFlushing = false;
let batchQueue = []; // In-memory queue for dispatching batches

let hasRehydrated = false;

export function rehydrateTelemetry() {
  if (typeof window === 'undefined' || hasRehydrated) return;
  hasRehydrated = true;
  try {
    const cached = localStore.getTelemetryCache();
    if (cached && Array.isArray(cached) && cached.length > 0) {
      const parsedCache = cached;
        setTimeout(() => {
          const store = useAximStore.getState();
          const currentCollection = store.telemetryCollection || [];
          const existingIds = new Set(currentCollection.map(e => e.id));

          const uniqueCached = parsedCache.filter(e => !existingIds.has(e.id));
          if (uniqueCached.length > 0) {
            useAximStore.setState({ telemetryCollection: [...currentCollection, ...uniqueCached], telemetryQueue: [...(store.telemetryQueue || []), ...uniqueCached] });
            batchQueue = [...batchQueue, ...uniqueCached];
          }
          localStore.saveTelemetryCache([]);
        }, 0);
      }
  } catch (err) {
    if (import.meta.env?.MODE !== 'production' && process.env.NODE_ENV !== 'production') { console.error("Failed to rehydrate telemetry from local cache", err); }
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

  const MAKE_WEBHOOK_URL = import.meta.env?.VITE_MAKE_AUTOMATION_WEBHOOK || null;
  const HIGH_VALUE_EVENTS = ['vip_consultation_requested', 'store_waitlist_intent', 'checkout_intent'];

  if (HIGH_VALUE_EVENTS.includes(type) && MAKE_WEBHOOK_URL) {
    fetch(MAKE_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: type, payload, timestamp: event.timestamp })
    }).catch(err => { if (import.meta.env?.MODE !== 'production' && process.env.NODE_ENV !== 'production') { console.warn("[WEBHOOK] Make.com Forwarding Failed silently."); } })
  }

  useAximStore.getState().logTelemetryEvent(event);
  batchQueue.push(event);

  if (batchQueue.length >= 10) {
    flushTelemetryQueue();
  }

  try {
    if (typeof window !== 'undefined') {
      const collection = useAximStore.getState().telemetryCollection;
      localStore.saveTelemetryCache(collection);
      window.dispatchEvent(new window.CustomEvent('axim-telemetry-update', { detail: event }));
    }
  } catch (e) {
    if (import.meta.env?.MODE !== 'production' && process.env.NODE_ENV !== 'production') { console.error("Telemetry error", e); }
  }

  if (import.meta.env?.MODE !== 'production' && process.env.NODE_ENV !== 'production') {
    console.log(`[TELEMETRY: ${type}]`, payload);
  }
}

export async function flushTelemetryQueue(force = false) {
  if (isFlushing || batchQueue.length === 0) return;
  isFlushing = true;

  const currentBatch = [...batchQueue];
  batchQueue = []; // Clear queue immediately to capture new events while flushing

  try {
    const payload = JSON.stringify(currentBatch);
    const rawEndpoint = (typeof import.meta !== 'undefined' && import.meta.env) ? (import.meta.env.VITE_TELEMETRY_ENDPOINT || import.meta.env.VITE_TELEMETRY_WORKER_URL) : undefined;
    const isValidRemote = Boolean(rawEndpoint) && !rawEndpoint.includes('your-edge-worker-url') && !rawEndpoint.includes('workers.dev');
    const endpoint = isValidRemote ? rawEndpoint : '/api/telemetry';

    if (!endpoint) {
      batchQueue = [...currentBatch, ...batchQueue].slice(0, 50); // Restore on fail
      if (typeof window !== 'undefined') {
        try { sessionStorage.setItem('axim_telemetry_offline_queue', JSON.stringify(batchQueue)); } catch (e) { /* ignore */ }
      }
      return;
    }

    let success = false;

    if (typeof window !== 'undefined') {
      if (window.navigator?.sendBeacon && force) {
        const blob = new Blob([payload], { type: 'application/json' });

        try {
          success = window.navigator.sendBeacon(endpoint, blob);
        } catch(e) {
          success = false;
        }

      } else if (window.fetch) {
        try {
          let retries = 3;
          const backoffs = [1000, 2000, 4000];
          let attempt = 0;

          let response = null;

          while (retries > 0) {
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
              response = await Promise.race([fetchPromise, timeoutPromise]);

              if (response.status === 200 || response.status === 202 || response.status === 204) {
                 break;
              } else if (response.status === 429) {
                 throw new Error('Rate limited');
              } else {
                 break;
              }
            } catch(e) {
               retries--;
               if (retries === 0) throw e;
               await new Promise(r => setTimeout(r, backoffs[attempt] || 4000));
               attempt++;

            }
          }

          if (response && (response.status === 200 || response.status === 202 || response.status === 204)) {
            success = true;
            try {
              if (response.status !== 204 && response.status !== 202) {
                const responseData = await response.json();
                console.log('[TELEMETRY_SYNC_SUCCESS]', responseData);
              }
            } catch (jsonErr) {
              if (import.meta.env?.MODE !== 'production' && process.env.NODE_ENV !== 'production') { console.warn("Could not parse telemetry response JSON", jsonErr); }
            }
          } else {
            success = false;
          }
        } catch (fetchErr) {
          if (import.meta.env?.MODE !== 'production' && process.env.NODE_ENV !== 'production') { console.warn("Edge telemetry failed", fetchErr); }

          // Using imported isSupabaseConfigured

          if (isSupabaseConfigured) {
            if (import.meta.env?.MODE !== 'production' && process.env.NODE_ENV !== 'production') { console.warn("Falling back to direct Supabase insert"); }
            try {
              const { error } = await supabase.from('telemetry_ingress').insert(currentBatch);
              if (!error) {
                 success = true;
                 console.log('[TELEMETRY_SYNC_SUCCESS] Fallback via Supabase direct insert successful');
              } else {
                 success = false;
                 if (import.meta.env?.MODE !== 'production' && process.env.NODE_ENV !== 'production') { console.warn('[TELEMETRY_SYNC_FAILED] Fallback via Supabase direct insert failed', error.message); }
              }
            } catch (supabaseErr) {
              success = false;
              if (import.meta.env?.MODE !== 'production' && process.env.NODE_ENV !== 'production') { console.warn("[TELEMETRY] Sync failed silently.", supabaseErr.message); }
            }
          } else {
            success = false;
            if (typeof window !== 'undefined') {
              try {
                localStore.saveTelemetryCache([...useAximStore.getState().telemetryCollection, ...currentBatch]);
              } catch(e) { /* ignore */ }
            }
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
        localStore.saveTelemetryCache(newCollection);
      }
    } else {
      // Put back in queue if failed
      batchQueue = [...currentBatch, ...batchQueue].slice(0, 50);
      if (typeof window !== 'undefined') {
        try {
          sessionStorage.setItem('axim_telemetry_offline_queue', JSON.stringify(batchQueue));
        } catch (e) { /* ignore */ }
        localStore.saveTelemetryCache(batchQueue);
      }
    }
  } catch (err) {
    if (import.meta.env?.MODE !== 'production' && process.env.NODE_ENV !== 'production') { console.warn("[TELEMETRY] Sync failed silently.", err.message); }
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
  window.addEventListener('beforeunload', () => flushTelemetryQueue(true));
  window.addEventListener('unload', () => flushTelemetryQueue(true));
  window.addEventListener('online', () => flushTelemetryQueue(true));
}

export function setupTelemetryHooks() {
  if (typeof window === 'undefined') return;

  // Wallet hooks
  window.addEventListener('wallet_connect', (e) => logTelemetry('wallet_connect', e.detail || {}));
  window.addEventListener('wallet_disconnect', (e) => logTelemetry('wallet_disconnect', e.detail || {}));
  window.addEventListener('chain_switch', (e) => logTelemetry('chain_switch', e.detail || {}));

  // AI query hook
  window.addEventListener('ai_query', (e) => logTelemetry('ai_query', e.detail || {}));

  // Core metrics
  window.addEventListener('error', (e) => logTelemetry('route_error', { message: e.message, filename: e.filename, lineno: e.lineno }));

  if (window.performance) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        if (pageLoadTime > 0) {
          logTelemetry('page_latency', { durationMs: pageLoadTime });
        }
      }, 0);
    });
  }
}

export function logHighPriorityTelemetry(type, payload) {
  logTelemetry(type, payload);
  flushTelemetryQueue(true);
}

export function trackEvent(type, payload) {
  logTelemetry(type, payload);
  if (type === 'personality_test_click') {
    // Forward the interaction payload to AXiM Core telemetry (POST /satellite-telemetry)
    const CORE_TELEMETRY_ENDPOINT = import.meta.env.VITE_CORE_TELEMETRY_ENDPOINT || 'https://api.axim.us.com/satellite-telemetry';
    fetch(CORE_TELEMETRY_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: type, payload, timestamp: new Date().toISOString() })
    }).catch(err => {
      if (import.meta.env?.MODE !== 'production' && process.env.NODE_ENV !== 'production') {
        console.warn("[WEBHOOK] AXiM Core Telemetry Forwarding Failed silently.", err);
      }
    });
  }
}
