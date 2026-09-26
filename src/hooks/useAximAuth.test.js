global.import = { meta: { env: { VITE_ENABLE_WEB3: 'true' } } };
import 'global-jsdom/register';
import { expect, test, describe, afterEach, mock, vi } from 'vitest';
import assert from 'assert';
import { act, renderHook, waitFor, cleanup } from '@testing-library/react';
import React from 'react';

// Use vi.mock before importing useAximAuth
// We will test multiple scenarios by updating the returned value
let mockAccount = null;

vi.mock('thirdweb/react', () => ({
  useActiveAccount: () => mockAccount,
  useConnect: () => ({ connect: vi.fn(), isConnecting: false })
}));

vi.mock('../lib/supabase.js', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(() => Promise.resolve({ data: { session: null }, error: null })),
      getUser: vi.fn(),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } }))
    }
  }
}));

// Import dynamically to ensure mock is applied
const { useAximAuth } = await import('./useAximAuth.js');
const { localStore } = await import('../lib/persistence.js');

describe('useAximAuth Hook', () => {
  afterEach(() => {
    vi.useRealTimers();
    cleanup();
    vi.restoreAllMocks();
    vi.spyOn(window, 'alert').mockImplementation(() => {});
    localStore.clearCache();
    mockAccount = null;
    localStorage.clear();
  });

  test.skip('should return null profile and loading false initially when no account', async () => {
    const { result } = renderHook(() => useAximAuth());

    // Initially loading should be true but quickly resolve
    await waitFor(() => {
      assert.strictEqual(result.current.loading, false);
      assert.strictEqual(result.current.profile, null);
      assert.strictEqual(result.current.account, null);
    });
  });

  test.skip('should fetch and set profile when account becomes available', async () => {
    const mockAddress = '0x1234567890abcdef1234567890abcdef12345678';
    mockAccount = { address: mockAddress };

    const { result } = renderHook(() => useAximAuth());

    assert.strictEqual(result.current.loading, true);

    await waitFor(() => {
      assert.strictEqual(result.current.loading, false);
      assert.ok(result.current.profile);
      assert.strictEqual(result.current.profile.wallet_address, mockAddress);
      assert.strictEqual(result.current.profile.clearance_level, 1);
    }, { timeout: 1000 });
  });

  test.skip('should not fetch profile again if already loaded for the same address', async () => {
    const mockAddress = '0x123';
    mockAccount = { address: mockAddress };

    const { result, rerender } = renderHook(() => useAximAuth());

    await waitFor(() => {
      assert.strictEqual(result.current.loading, false);
      assert.ok(result.current.profile);
      assert.strictEqual(result.current.profile.wallet_address, mockAddress);
    });

    // Capture the current profile reference to check if it gets replaced
    const currentProfile = result.current.profile;

    // Rerender with same account
    rerender();

    // It should immediately resolve redundant sync
    assert.strictEqual(result.current.loading, false);
    assert.strictEqual(result.current.profile, currentProfile);
  });

  test.skip('handles errors during profile fetch gracefully', async () => {
    const mockAddress = '0xerror';
    mockAccount = { address: mockAddress };

    const originalGetProfile = localStore.getProfile;
    const originalConsoleError = console.error;

    // Suppress expected error logs
    console.error = vi.fn();

    // Force an error
    localStore.getProfile = () => {
      throw new Error('Test error');
    };

    try {
      const { result } = renderHook(() => useAximAuth());

      await waitFor(() => {
        assert.strictEqual(result.current.loading, false);
      });

      assert.strictEqual(result.current.profile, null);
      assert.strictEqual(console.error.mock.calls.length, 1);
    } finally {
      localStore.getProfile = originalGetProfile;
      console.error = originalConsoleError;
    }
  });

  test.skip('clears profile when account is disconnected', async () => {
    const mockAddress = '0xdisconnect';
    mockAccount = { address: mockAddress };

    const { result, rerender } = renderHook(() => useAximAuth());

    await waitFor(() => {
      assert.strictEqual(result.current.loading, false);
      assert.ok(result.current.profile);
    });

    // Simulate disconnect
    mockAccount = null;
    rerender();

    await waitFor(() => {
      assert.strictEqual(result.current.loading, false);
      assert.strictEqual(result.current.profile, null);
    });
  });

  test.skip('should retain session on intermittent 500 errors', async () => {
    // Setup offline session
    const fakeSession = { user: { email: 'test@axim.us.com' } };
    localStore.saveOfflineSession(fakeSession);

    const { supabase } = await import('../lib/supabase.js');
    // Force getSession to throw simulating 500 error
    supabase.auth.getSession.mockImplementationOnce(() => Promise.reject(new Error('Failed to fetch')));

    const { result } = renderHook(() => useAximAuth());

    await waitFor(() => {
      // It should pull from offline session despite error
      assert.strictEqual(result.current.loading, false);
      assert.deepStrictEqual(result.current.session, fakeSession);
      assert.strictEqual(result.current.profile.email, 'test@axim.us.com');
    }, { timeout: 1000 });
  });

  test('keeps the cached session during the three-second reconnect grace period', async () => {
    const { supabase } = await import('../lib/supabase.js');
    const cachedSession = { user: { email: 'cached@axim.us.com' } };
    let authStateChange;
    localStore.saveOfflineSession(cachedSession);
    supabase.auth.onAuthStateChange.mockImplementation((callback) => {
      authStateChange = callback;
      return { data: { subscription: { unsubscribe: vi.fn() } } };
    });
    vi.useFakeTimers();
    supabase.auth.getSession
      .mockImplementationOnce(() => new Promise(() => {}))
      .mockResolvedValueOnce({ data: { session: null }, error: null });

    const { result } = renderHook(() => useAximAuth());
    expect(result.current.session).toEqual(cachedSession);

    await act(async () => {
      authStateChange('TOKEN_REFRESHED', null);
    });
    expect(result.current.isReconnecting).toBe(true);
    expect(result.current.isAuthenticated).toBe(true);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(3000);
    });
    expect(result.current.isReconnecting).toBe(false);
    expect(result.current.session).toEqual(cachedSession);
    vi.useRealTimers();
  });

});

  test('isHydrating logic works correctly', async () => {
    const { supabase } = await import('../lib/supabase.js');
    let resolveGetSession;
    supabase.auth.getSession.mockImplementationOnce(() => new Promise((resolve) => {
      resolveGetSession = resolve;
    }));

    const { result } = renderHook(() => useAximAuth());

    // Initially loading and isHydrating should be true
    assert.strictEqual(result.current.loading, true);
    assert.strictEqual(result.current.isHydrating, true);

    // Resolve the promise
    resolveGetSession({ data: { session: { user: { email: 'test@axim.us.com' } } }, error: null });

    await waitFor(() => {
      assert.strictEqual(result.current.loading, false);
      assert.strictEqual(result.current.isHydrating, false);
    });
  });
