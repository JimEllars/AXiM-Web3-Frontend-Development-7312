import { useAximStore } from '../store/useAximStore.js';
import 'global-jsdom/register';
import { test, describe, afterEach, mock } from 'node:test';
import assert from 'node:assert';
import { renderHook, waitFor } from '@testing-library/react';
import { usePassport } from './usePassport.js';

describe('usePassport Hook', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    useAximStore.setState({ userSession: null, isSessionLoading: true });
    global.fetch = originalFetch;
    mock.restoreAll();
  });

  test('should return userSession when verification is successful', async () => {
    const mockData = { id: 'user-1', documents: [{ title: 'Doc 1', url: 'https://example.com' }] };
    global.fetch = mock.fn(async () => ({
      ok: true,
      json: async () => mockData
    }));

    const { result } = renderHook(() => usePassport());

    assert.strictEqual(result.current.loading, true);
    assert.strictEqual(result.current.userSession, null);

    await waitFor(() => {
      assert.strictEqual(result.current.loading, false);
      assert.deepStrictEqual(result.current.userSession, mockData);
    });
  });

  test('should return null userSession when verification fails', async () => {
    global.fetch = mock.fn(async () => ({
      ok: false,
    }));

    const { result } = renderHook(() => usePassport());

    await waitFor(() => {
      assert.strictEqual(result.current.loading, false);
      assert.strictEqual(result.current.userSession, null);
    });
  });

  test('should return null userSession on error', async () => {
    global.fetch = mock.fn(async () => {
      throw new Error('Network error');
    });

    const { result } = renderHook(() => usePassport());

    await waitFor(() => {
      assert.strictEqual(result.current.loading, false);
      assert.strictEqual(result.current.userSession, null);
    });
  });
});
