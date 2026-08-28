import test, { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import assert from 'assert';
import * as thirdwebClientModule from './thirdweb-client.js';

vi.mock('./telemetry.js', () => ({
  logTelemetry: vi.fn()
}));

describe('thirdweb-client configuration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('exports a valid thirdweb client', () => {
    const client = thirdwebClientModule.client;
    assert.strictEqual(typeof client, 'object', 'Client must be an object');
    assert.ok('clientId' in client, 'Client must contain a clientId property');
  });

  it('correctly uses the environment variable or fallback to instantiate the client', () => {
    const expectedClientId = import.meta.env?.VITE_THIRDWEB_CLIENT_ID || 'default_client_id';
    assert.strictEqual(thirdwebClientModule.client.clientId, expectedClientId);
  });

  it('verifyWeb3Connection iterates over FALLBACK_RPCS and returns true on success', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    }).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ result: '0x1' }),
    });

    const result = await thirdwebClientModule.verifyWeb3Connection();
    expect(result).toBe(true);
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it('verifyWeb3Connection returns false if all RPCs fail', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 500,
    });

    const result = await thirdwebClientModule.verifyWeb3Connection();
    expect(result).toBe(false);
    expect(global.fetch).toHaveBeenCalledTimes(thirdwebClientModule.FALLBACK_RPCS.length);
  });
});
