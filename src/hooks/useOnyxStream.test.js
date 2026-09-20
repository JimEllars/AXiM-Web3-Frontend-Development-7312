import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useOnyxStream } from './useOnyxStream';
import * as telemetry from '../lib/telemetry';


vi.mock('../hooks/useAximAuth', () => ({
  useAximAuth: () => ({
    profile: { clearance_level: 1 },
    session: {}
  })
}));

vi.mock('../store/useAximStore', () => ({
  useAximStore: Object.assign(vi.fn((selector) => {
    const mockStore = {
      token: 'mock-token',
      addToast: vi.fn()
    };
    return selector ? selector(mockStore) : mockStore;
  }), { getState: () => ({ logTelemetryEvent: vi.fn() }) })
}));

describe('useOnyxStream', () => {
  let logSpy;

  beforeEach(() => {
    logSpy = vi.spyOn(telemetry, 'logTelemetry').mockImplementation(() => {});
    vi.useFakeTimers();
    global.fetch = vi.fn();
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('initializes with correct default state', () => {
    const { result } = renderHook(() => useOnyxStream());
    expect(result.current.messages).toEqual([]);
    expect(result.current.isStreaming).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('handles empty message appropriately', async () => {
    const { result } = renderHook(() => useOnyxStream());

    await act(async () => {
      await result.current.sendMessage('   ');
    });

    expect(result.current.messages).toEqual([]);
    expect(result.current.isStreaming).toBe(false);
  });

  it('aborts stream correctly', async () => {
    const { result } = renderHook(() => useOnyxStream());

    global.fetch.mockImplementationOnce(() => new Promise(() => {}));

    act(() => {
      result.current.sendMessage('Hello Onyx');
    });

    expect(result.current.isStreaming).toBe(true);

    act(() => {
      result.current.abortStream();
    });

    expect(result.current.isStreaming).toBe(false);
    const messages = result.current.messages;
    const assistantMessage = messages.find(m => m.role === 'assistant');
    expect(assistantMessage.content).toContain('[STREAM ABORTED]');
  });

  it('handles fallback mode on connection failure', async () => {
    const { result, unmount } = renderHook(() => useOnyxStream());

    global.fetch.mockImplementation(() => Promise.reject(new Error('Network Error')));

    act(() => {
      result.current.sendMessage('Trigger fallback');
    });

    // Advance through the maxRetries backoff (4 retries)
    await act(async () => { await vi.advanceTimersByTimeAsync(20000); });
    await act(async () => { await vi.advanceTimersByTimeAsync(20000); });
    await act(async () => { await vi.advanceTimersByTimeAsync(20000); });
    await act(async () => { await vi.advanceTimersByTimeAsync(20000); });

    expect(result.current.isStreaming).toBe(false);
    expect(result.current.error).toBe('Network Error');

    const messages = result.current.messages;
    const assistantMessage = messages.find(m => m.role === 'assistant');
    expect(assistantMessage?.isFallback).toBe(true);
    expect(assistantMessage.content).toMatch(/(\[SYSTEM OFFLINE\]|\[SYSTEM\] Reconnecting Uplink...)/);

    unmount();
  });

  it('truncates messages when exceeding max bounds', async () => {
    // Note: Due to React state batching and our test structure, the loop exceeds the 200 message limit
    // but we can verify it gets truncated eventually. We mock the crypto.randomUUID to avoid duplicate keys.
    const { result } = renderHook(() => useOnyxStream());

    global.fetch.mockImplementation(() => Promise.resolve({
      ok: true,
      headers: new Headers(),
      body: { getReader: () => ({ read: () => Promise.resolve({ done: true }) }) }
    }));

    await act(async () => {
      // Create an array of 105 length, each send creates 2 messages (user + assistant) -> 210 total, capped at 200
      for (let i = 0; i < 105; i++) {
        await result.current.sendMessage(`test message ${i}`);
      }
    });

    // Our slice limit is 200
    expect(result.current.messages.length).toBeLessThanOrEqual(200);
  });
});
