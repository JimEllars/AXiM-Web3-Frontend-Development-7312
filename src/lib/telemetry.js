import { useAximStore } from '../store/useAximStore';
import { onCLS, onFCP, onLCP } from 'web-vitals';

const OFFLINE_QUEUE_KEY = 'axim_telemetry_offline_queue';
const MAX_QUEUE_SIZE = 100;
const MAX_BATCH_RETRIES = 3;
const BATCH_SIZE = 10;

let memoryQueue = [];
let isFlushing = false;
let performanceMetrics = {};

function isCriticalEvent(event) {
  const category = event?.event?.category || event?.type || '';
  return /auth|error/i.test(category);
}

function readOfflineQueue() {
  if (typeof window === 'undefined') return [];

  try {
    const queue = JSON.parse(window.localStorage.getItem(OFFLINE_QUEUE_KEY) || '[]');
    return Array.isArray(queue) ? queue : [];
  } catch {
    return [];
  }
}

function trimQueue(queue) {
  const result = [...queue];

  while (result.length > MAX_QUEUE_SIZE) {
    const removableIndex = result.findIndex((event) => !isCriticalEvent(event));
    result.splice(removableIndex === -1 ? 0 : removableIndex, 1);
  }

  return result;
}

function persistOfflineQueue(queue) {
  if (typeof window === 'undefined') return;

  const trimmed = trimQueue(queue);
  try {
    window.localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(trimmed));
  } catch {
    // Telemetry must never interfere with application interaction.
  }
}

function notifyQueueChanged() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('axim-telemetry-queue-update', {
    detail: { count: memoryQueue.length + readOfflineQueue().length }
  }));
}

function enqueueOffline(events) {
  const persisted = readOfflineQueue();
  persistOfflineQueue([...persisted, ...events]);
  notifyQueueChanged();
}

function configuredTelemetryEndpoint() {
  const configured = import.meta.env.VITE_TELEMETRY_ENDPOINT;
  return configured && !configured.includes('your-edge-worker-url') && !configured.includes('workers.dev')
    ? configured
    : null;
}

function telemetryEndpoint() {
  const configured = configuredTelemetryEndpoint();
  return configured
    ? new URL('/api/telemetry/ingest', configured).toString()
    : '/api/telemetry/ingest';
}

export function getTelemetryHealthEndpoint() {
  const configured = configuredTelemetryEndpoint();
  return configured
    ? new URL('/api/telemetry/health', configured).toString()
    : '/api/telemetry/health';
}

function delayForAttempt(attempt) {
  const exponentialDelay = 250 * (2 ** attempt);
  const jitter = Math.floor(Math.random() * 150);
  return exponentialDelay + jitter;
}

function wait(delay) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

async function dispatchBatch(events, useBeacon) {
  const endpoint = telemetryEndpoint();
  const payload = JSON.stringify(events);

  if (useBeacon && typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
    try {
      if (navigator.sendBeacon(endpoint, new Blob([payload], { type: 'application/json' }))) {
        return true;
      }
    } catch {
      // Continue with fetch so unloading pages still have a best-effort path.
    }
  }

  if (typeof fetch !== 'function') return false;

  for (let attempt = 0; attempt < MAX_BATCH_RETRIES; attempt += 1) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true
      });

      if (response.ok) return true;
      if (response.status < 500) return false;
    } catch {
      // Network failures are retryable and persist after the final attempt.
    }

    if (attempt < MAX_BATCH_RETRIES - 1) await wait(delayForAttempt(attempt));
  }

  return false;
}

function removeDeliveredEvents(events) {
  if (typeof useAximStore.setState !== 'function') return;

  const deliveredIds = new Set(events.map((event) => event.id));
  const state = useAximStore.getState();
  useAximStore.setState({
    telemetryCollection: (state.telemetryCollection || []).filter((event) => !deliveredIds.has(event.id)),
    telemetryQueue: (state.telemetryQueue || []).filter((event) => !deliveredIds.has(event.id))
  });
}

export function getTelemetryStore() {
  return [...(useAximStore.getState().telemetryCollection || [])];
}

export function getOfflineTelemetryQueue() {
  return [...memoryQueue, ...readOfflineQueue()];
}

export function __resetTelemetryForTests() {
  memoryQueue = [];
  isFlushing = false;
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(OFFLINE_QUEUE_KEY);
  }
}

export function logTelemetry(type, payload = {}) {
  const event = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    event: { category: type, ...payload },
    path: typeof window === 'undefined' ? '' : window.location.pathname,
    performance: {
      ttfb: performanceMetrics.TTFB || 0,
      fcp: performanceMetrics.FCP || 0,
      cls: performanceMetrics.CLS || 0,
      lcp: performanceMetrics.LCP || 0
    },
    sessionId: typeof window === 'undefined' ? undefined : window.sessionStorage.getItem('axim_session_id')
  };

  if (typeof window !== 'undefined' && !event.sessionId) {
    event.sessionId = crypto.randomUUID();
    window.sessionStorage.setItem('axim_session_id', event.sessionId);
  }

  useAximStore.getState().logTelemetryEvent(event);
  memoryQueue = trimQueue([...memoryQueue, event]);

  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    memoryQueue = memoryQueue.filter((queuedEvent) => queuedEvent.id !== event.id);
    enqueueOffline([event]);
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('axim-telemetry-update', { detail: event }));
  }

  if (memoryQueue.length >= BATCH_SIZE) void flushTelemetryQueue();
  return event;
}

export async function flushTelemetryQueue(useBeacon = false) {
  if (isFlushing) return false;

  const persisted = readOfflineQueue();
  const events = trimQueue([...persisted, ...memoryQueue]);
  if (events.length === 0) return true;

  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    memoryQueue = [];
    persistOfflineQueue(events);
    notifyQueueChanged();
    return false;
  }

  isFlushing = true;
  memoryQueue = [];
  persistOfflineQueue([]);

  const succeeded = await dispatchBatch(events, useBeacon);
  if (succeeded) {
    removeDeliveredEvents(events);
  } else {
    enqueueOffline(events);
  }

  isFlushing = false;
  notifyQueueChanged();
  return succeeded;
}

export function logHighPriorityTelemetry(type, payload) {
  const event = logTelemetry(type, payload);
  void flushTelemetryQueue(true);
  return event;
}

export function trackEvent(category, action, label, value) {
  if (typeof category !== 'string' || category.length === 0) return;
  logTelemetry(category, { action, label, value });
}

export function captureException(error, errorInfo) {
  if (!error) return;
  logHighPriorityTelemetry('application_error', {
    message: error.message,
    stack: error.stack,
    componentStack: errorInfo?.componentStack
  });
}

export const flushErrorQueue = flushTelemetryQueue;

export function setupTelemetryHooks() {
  if (typeof window === 'undefined') return;
  window.addEventListener('wallet_connect', (event) => logTelemetry('wallet_connect', event.detail || {}));
  window.addEventListener('wallet_disconnect', (event) => logTelemetry('wallet_disconnect', event.detail || {}));
  window.addEventListener('chain_switch', (event) => logTelemetry('chain_switch', event.detail || {}));
  window.addEventListener('ai_query', (event) => logTelemetry('ai_query', event.detail || {}));
  window.addEventListener('error', (event) => logHighPriorityTelemetry('route_error', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno
  }));
}

if (typeof window !== 'undefined') {
  onFCP((metric) => { performanceMetrics.FCP = metric.value; });
  onCLS((metric) => { performanceMetrics.CLS = metric.value; });
  onLCP((metric) => { performanceMetrics.LCP = metric.value; });

  window.addEventListener('online', () => { void flushTelemetryQueue(); });
  window.addEventListener('pagehide', () => { void flushTelemetryQueue(true); });
  window.addEventListener('beforeunload', () => { void flushTelemetryQueue(true); });
}
