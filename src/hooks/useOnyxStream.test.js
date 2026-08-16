import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useOnyxStream } from './useOnyxStream';

vi.mock('../store/useAximStore', () => ({
  useAximStore: vi.fn((selector) => selector({ userSession: { session_token: 'test' } }))
}));
vi.mock('./useAximAuth', () => ({
  useAximAuth: vi.fn(() => ({ session: null }))
}));

describe('useOnyxStream', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle standard json response', async () => {
    global.fetch = vi.fn(() => Promise.resolve({
      ok: true,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: () => Promise.resolve({ reply: 'Test reply' })
    }));

    const { result } = renderHook(() => useOnyxStream());

    await act(async () => {
      await result.current.executeOnyxCommand('test command');
    });

    expect(result.current.streamResponse).toBe('Test reply');
    expect(result.current.error).toBe(null);
  });
});
