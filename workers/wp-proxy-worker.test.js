import { test, describe, expect } from 'vitest';
import worker from './wp-proxy-worker.js';

describe('wp-proxy-worker', () => {
  test('handles OPTIONS request', async () => {
    const req = new Request('https://proxy.example.com', { method: 'OPTIONS' });
    const res = await worker.fetch(req, {}, { waitUntil: () => {} });
    expect(res.status).toBe(204);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');
    expect(res.headers.get('Access-Control-Allow-Headers')).toContain('authorization');
    expect(res.headers.get('Access-Control-Allow-Headers')).toContain('x-axim-client');
  });

  test('returns standardized error for invalid endpoint', async () => {
    const req = new Request('https://proxy.example.com?endpoint=/invalid', { method: 'GET' });
    const res = await worker.fetch(req, {}, { waitUntil: () => {} });
    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error).toBe('Invalid or missing endpoint parameter.');
    expect(body.code).toBe(403);
  });
});
