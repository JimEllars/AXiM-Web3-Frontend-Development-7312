import { describe, it, expect } from 'vitest';
import worker from './telemetry-worker.js';

describe('telemetry-worker', () => {
  it('handles OPTIONS request', async () => {
    const req = new Request('https://telemetry.axim.us.com', { method: 'OPTIONS' });
    const res = await worker.fetch(req, {}, { waitUntil: () => {} });
    expect(res.status).toBe(204);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('https://axim.us.com');
    expect(res.headers.get('Access-Control-Allow-Headers')).toContain('X-AXiM-Internal-Key');
    expect(res.headers.get('Access-Control-Allow-Headers')).toContain('x-axim-client');
  });
});
