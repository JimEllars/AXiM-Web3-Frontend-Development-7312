import 'global-jsdom/register';
import { test, describe, afterEach, mock } from 'node:test';
import assert from 'node:assert';
import { renderHook, waitFor, cleanup } from '@testing-library/react';
import React from 'react';

// Use mock.module before importing useAximAuth
// We will test multiple scenarios by updating the returned value
let mockAccount = null;

mock.module('thirdweb/react', {
  namedExports: {
    useActiveAccount: () => mockAccount,
    ThirdwebProvider: ({ children }) => React.createElement(React.Fragment, null, children)
  }
});

// Import dynamically to ensure mock is applied
const { useAximAuth } = await import('./useAximAuth.js');
const { localStore } = await import('../lib/persistence.js');

describe('useAximAuth Hook', () => {
  afterEach(() => {
    cleanup();
    mock.restoreAll();
    localStore.clearCache();
    mockAccount = null;
    localStorage.clear();
  });

  test('should return null profile and loading false initially when no account', async () => {
    const { result } = renderHook(() => useAximAuth());

    // Initially loading should be true but quickly resolve
    await waitFor(() => {
      assert.strictEqual(result.current.loading, false);
      assert.strictEqual(result.current.profile, null);
      assert.strictEqual(result.current.account, null);
    });
  });

  test('should fetch and set profile when account becomes available', async () => {
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

  test('should not fetch profile again if already loaded for the same address', async () => {
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

  test('handles errors during profile fetch gracefully', async () => {
    const mockAddress = '0xerror';
    mockAccount = { address: mockAddress };

    const originalGetProfile = localStore.getProfile;
    const originalConsoleError = console.error;

    // Suppress expected error logs
    console.error = mock.fn();

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

  test('clears profile when account is disconnected', async () => {
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
});
