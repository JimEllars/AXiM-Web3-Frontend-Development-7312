import { describe, it, expect } from 'vitest';
import worker from './telemetry-worker.js';

describe('telemetry-worker', () => {
  it('handles OPTIONS request', async () => {
    const req = new Request('https://telemetry.axim.us.com', { method: 'OPTIONS', headers: { Origin: 'https://axim.us.com' } });
    const res = await worker.fetch(req, {}, { waitUntil: () => {} });
    expect([204, 503]).toContain(res.status);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');
    expect(res.headers.get('Access-Control-Allow-Headers')).toContain('X-AXiM-Internal-Key');
    expect(res.headers.get('Access-Control-Allow-Headers')).toContain('x-axim-client');
  });

  it('handles GET /api/telemetry/health request', async () => {
    const req = new Request('https://telemetry.axim.us.com/api/telemetry/health', { method: 'GET' });
    Object.defineProperty(req, 'cf', { value: { colo: 'TEST_COLO' } });
    const res = await worker.fetch(req, {}, { waitUntil: () => {} });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe('OPERATIONAL');
    expect(body.timestamp).toBeDefined();
    expect(body.node).toBe('TEST_COLO');
  });

  it('validates payload and returns 400 for invalid JSON', async () => {
    const req = new Request('https://telemetry.axim.us.com/api/telemetry/ingest', {
      method: 'POST',
      headers: { Origin: 'https://axim.us.com' },
      body: 'invalid json'
    });
    const res = await worker.fetch(req, { AXIM_CORE_URL: 'http://test', AXIM_GATEWAY_TOKEN: 'token' }, { waitUntil: () => {} });
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('Invalid JSON payload.');
  });

  it('validates payload and returns 400 for missing fields', async () => {
    const req = new Request('https://telemetry.axim.us.com/api/telemetry/ingest', {
      method: 'POST',
      headers: { Origin: 'https://axim.us.com' },
      body: JSON.stringify([{ id: '123' }]) // missing type and timestamp
    });
    const res = await worker.fetch(req, { AXIM_CORE_URL: 'http://test', AXIM_GATEWAY_TOKEN: 'token' }, { waitUntil: () => {} });
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('Telemetry event validation failed.');
  });

  it('validates payload and returns 400 for too many events', async () => {
    const events = Array.from({ length: 101 }, (_, i) => ({ id: `event_${i}`, type: 'test', timestamp: new Date().toISOString() }));
    const req = new Request('https://telemetry.axim.us.com/api/telemetry/ingest', {
      method: 'POST',
      headers: { Origin: 'https://axim.us.com' },
      body: JSON.stringify(events)
    });
    const res = await worker.fetch(req, { AXIM_CORE_URL: 'http://test', AXIM_GATEWAY_TOKEN: 'token' }, { waitUntil: () => {} });
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('Expected between 1 and 100 telemetry events.');
  });
});
