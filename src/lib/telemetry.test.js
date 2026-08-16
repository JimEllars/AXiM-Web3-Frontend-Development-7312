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
});
