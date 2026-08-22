import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { logTelemetry, flushTelemetryQueue, getTelemetryStore } from './telemetry';
import { useAximStore } from '../store/useAximStore';

describe('Telemetry', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAximStore.setState({ telemetryCollection: [], telemetryQueue: [] });
    // mock global fetch
    global.fetch = vi.fn(() => Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({ success: true }) }));
    global.window = Object.create(window);
    Object.defineProperty(window, 'navigator', {
        value: {
            sendBeacon: vi.fn(),
        },
    });
  });

  it('should log telemetry events and add to queue', () => {
    logTelemetry('test_event', { foo: 'bar' });
    const store = getTelemetryStore();
    expect(store.length).toBe(1);
    expect(store[0].type).toBe('test_event');
    expect(store[0].payload.foo).toBe('bar');
  });

  it('should flush telemetry queue and clear on success', async () => {
    logTelemetry('test_event_2', { baz: 'qux' });
    await flushTelemetryQueue();
    const store = getTelemetryStore();
    expect(store.length).toBe(0);
    expect(global.fetch).toHaveBeenCalled();
  });

  it('should buffer events when fetch rejects and batch flush on reconnect', async () => {
    // Override fetch to fail
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    // Override supabase insert to also fail so it stays in queue
    const { supabase } = await import('../lib/supabase.js');
    supabase.from.mockReturnValueOnce({
      insert: vi.fn().mockRejectedValue(new Error('Supabase error'))
    });

    logTelemetry('buffer_test', { data: 1 });
    await flushTelemetryQueue();

    // The fetch failed, the supabase insert failed, the event should be put back in queue
    let store = getTelemetryStore();
    // getTelemetryStore returns the collection which still has the event since it didn't sync
    expect(store.length).toBeGreaterThan(0);

    // Now simulate success
    global.fetch.mockResolvedValueOnce({ ok: true, status: 200, json: () => Promise.resolve({ success: true }) });
    await flushTelemetryQueue();

    store = getTelemetryStore();
    expect(store.length).toBe(0);
  });

});
