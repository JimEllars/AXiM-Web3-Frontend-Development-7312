import 'global-jsdom/register';
import { test, describe, afterEach, beforeEach } from 'node:test';
import assert from 'node:assert';
import { renderHook, waitFor, cleanup } from '@testing-library/react';
import { useAximAuth } from './useAximAuth.js';
import { setActiveAccountMock } from 'thirdweb/react';
import { localStore } from '../lib/persistence.js';

describe('useAximAuth Hook', () => {
  let originalGetProfile;
  let consoleError;

  beforeEach(() => {
    originalGetProfile = localStore.getProfile;
    consoleError = console.error;
    console.error = () => {};
  });

  afterEach(() => {
    setActiveAccountMock(null);
    localStore.getProfile = originalGetProfile;
    console.error = consoleError;
    cleanup();
  });

  test('should return null profile and loading false when no account', async () => {
    setActiveAccountMock(null);

    const { result } = renderHook(() => useAximAuth());

    await waitFor(() => {
      assert.strictEqual(result.current.loading, false);
    });

    assert.strictEqual(result.current.account, null);
    assert.strictEqual(result.current.profile, null);
  });

  test('should load profile from localStore when account exists', async () => {
    const mockAccount = { address: '0x123' };
    const mockProfile = { name: 'Test User' };

    setActiveAccountMock(mockAccount);
    localStore.getProfile = (address) => {
      if (address === '0x123') return mockProfile;
      return null;
    };

    const { result } = renderHook(() => useAximAuth());

    await waitFor(() => {
      assert.strictEqual(result.current.loading, false);
    });

    assert.strictEqual(result.current.account, mockAccount);
    assert.deepStrictEqual(result.current.profile, mockProfile);
  });

  test('should handle localStore error gracefully', async () => {
    const mockAccount = { address: '0x456' };

    setActiveAccountMock(mockAccount);
    localStore.getProfile = () => {
      throw new Error('Storage Error');
    };

    const { result } = renderHook(() => useAximAuth());

    await waitFor(() => {
      assert.strictEqual(result.current.loading, false);
    });

    assert.strictEqual(result.current.account, mockAccount);
    assert.strictEqual(result.current.profile, null);
  });
});
