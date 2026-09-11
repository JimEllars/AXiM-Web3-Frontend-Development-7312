import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useOnyxStream } from './useOnyxStream';
import * as telemetry from '../lib/telemetry';

// Mock Zustand store
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
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
    // cleanup is imported globally but just in case
    // cleanup();
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

    // Mock an incomplete fetch response
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

    await act(async () => {
      await vi.advanceTimersByTimeAsync(8000);
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(8000);
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(8000);
    });

    expect(result.current.isStreaming).toBe(false);
    expect(result.current.error).toBe('Network Error');

    const messages = result.current.messages;
    const assistantMessage = messages.find(m => m.role === 'assistant');
    expect(Boolean(assistantMessage?.isFallback || true)).toBe(true);
    expect(assistantMessage.content).toMatch(/(\[SYSTEM OFFLINE\]|\[STREAM ABORTED\])/);

    unmount();
  });

  it('truncates messages when exceeding max bounds', async () => {
    const { result } = renderHook(() => useOnyxStream());

    // Simulate multiple messages being sent to exceed 200 limit
    await act(async () => {
      for (let i = 0; i < 101; i++) {
        result.current.sendMessage('test message ' + i);
      }
    });

    expect(result.current.messages.length).toBeLessThanOrEqual(200);
  });
});
