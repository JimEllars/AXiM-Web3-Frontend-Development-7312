import { describe, it, expect, vi } from 'vitest';
import rpcWorker from './rpc-worker.js';

describe('rpc-worker', () => {
  it('returns 504 Gateway Timeout when Alchemy RPC times out', async () => {
    const env = { ALCHEMY_RPC_URL: 'https://fake.rpc.com' };
    const request = new Request('https://axim.us.com/rpc', {
      method: 'POST',
      body: JSON.stringify({ method: 'eth_blockNumber' })
    });

    global.fetch = vi.fn().mockRejectedValue(new DOMException('Timeout', 'TimeoutError'));

    const response = await rpcWorker.fetch(request, env);
    expect(response.status).toBe(504);
    const data = await response.json();
    expect(data.error).toBe('Gateway Timeout');
  });
});
