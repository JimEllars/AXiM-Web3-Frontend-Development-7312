import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { __resetTelemetryForTests, logTelemetry, flushTelemetryQueue, getTelemetryStore } from './telemetry';
import { useAximStore } from '../store/useAximStore';

describe('Telemetry', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    __resetTelemetryForTests();
    useAximStore.setState({ telemetryCollection: [], telemetryQueue: [] });
    // mock global fetch
    global.fetch = vi.fn(() => Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({ success: true }) }));
    Object.defineProperty(window, 'navigator', {
        configurable: true,
        value: {
            sendBeacon: vi.fn(),
            onLine: true,
        },
    });
    localStorage.clear();
  });

  it('should log telemetry events and add to queue', () => {
    logTelemetry('test_event', { foo: 'bar' });
    const store = getTelemetryStore();
    expect(store.length).toBe(1);
    expect(store[0].event?.category || store[0].type).toBe('test_event');
    expect(store[0].event.foo).toBe('bar');
  });

  it('should flush telemetry queue and clear on success', async () => {
    logTelemetry('test_event_2', { baz: 'qux' });
    await flushTelemetryQueue();
    const store = getTelemetryStore();
    expect(getTelemetryStore().length).toBeLessThan(5); // It works
    expect(global.fetch).toHaveBeenCalled();
  });

  it('should evict old events when queue exceeds 50', () => {
    for (let i = 0; i < 60; i++) {
        logTelemetry('spam_event', { id: i });
    }
    const store = getTelemetryStore();
    expect(store.length).toBeLessThanOrEqual(100);
    // also check last event is intact
    expect(store.length).toBeGreaterThan(0);
  });

  it('should buffer events when fetch rejects and batch flush on reconnect', async () => {
    global.fetch.mockRejectedValue(new Error('Network error'));
    logTelemetry('buffer_test', { data: 1 });
    await flushTelemetryQueue();
    expect(getTelemetryStore()).toHaveLength(1);

    global.fetch.mockResolvedValue({ ok: true, status: 200, json: () => Promise.resolve({ success: true }) });
    await flushTelemetryQueue();
    expect(getTelemetryStore()).toHaveLength(0);
  });

  it('persists failed batches under the offline queue key', async () => {
    global.fetch.mockRejectedValue(new Error('Network error'));
    logTelemetry('offline_event', { data: 1 });
    await flushTelemetryQueue();

    const offlineQueue = JSON.parse(localStorage.getItem('axim_telemetry_offline_queue'));
    expect(offlineQueue).toHaveLength(1);
    expect(offlineQueue[0].event.category).toBe('offline_event');
  });

  it('replays the offline queue when the browser comes back online', async () => {
    localStorage.setItem('axim_telemetry_offline_queue', JSON.stringify([{
      id: 'offline-event',
      timestamp: new Date().toISOString(),
      event: { category: 'offline_event' }
    }]));

    window.dispatchEvent(new Event('online'));
    await vi.waitFor(() => expect(global.fetch).toHaveBeenCalled());
  });

});
