import { test, describe, expect } from 'vitest';
import worker from './telemetry-worker.js';

describe('telemetry-worker', () => {
  test('handles OPTIONS request', async () => {
    const req = new Request('https://telemetry.example.com', { method: 'OPTIONS' });
    const res = await worker.fetch(req, {}, { waitUntil: () => {} });
    expect(res.status).toBe(200);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('https://axim.us.com');
    expect(res.headers.get('Access-Control-Allow-Headers')).toContain('x-axim-client');
    expect(res.headers.get('Access-Control-Allow-Headers')).toContain('authorization');
  });
});
