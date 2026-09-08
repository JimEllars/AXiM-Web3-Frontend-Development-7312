import { describe, it, expect } from 'vitest';
import worker from './telemetry-worker.js';

describe('telemetry-worker', () => {
  it('handles OPTIONS request', async () => {
    const req = new Request('https://telemetry.axim.us.com', { method: 'OPTIONS', headers: { Origin: 'https://axim.us.com' } });
    const res = await worker.fetch(req, {}, { waitUntil: () => {} });
    expect(res.status).toBe(204);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('https://axim.us.com');
    expect(res.headers.get('Access-Control-Allow-Headers')).toContain('X-AXiM-Internal-Key');
    expect(res.headers.get('Access-Control-Allow-Headers')).toContain('x-axim-client');
  });

  it('handles GET /health request', async () => {
    const req = new Request('https://telemetry.axim.us.com/health', { method: 'GET' });
    // In CF workers context, cf object is typically attached to the request or as a second parameter
    Object.defineProperty(req, 'cf', { value: { colo: 'TEST_COLO' } });
    const res = await worker.fetch(req, {}, { waitUntil: () => {} });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe('healthy');
    expect(body.timestamp).toBeDefined();
    expect(body.edgeRegion).toBe('TEST_COLO');
  });

  it('validates payload and returns 400 for invalid JSON', async () => {
    const req = new Request('https://telemetry.axim.us.com/api/telemetry', {
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
    const req = new Request('https://telemetry.axim.us.com/api/telemetry', {
      method: 'POST',
      headers: { Origin: 'https://axim.us.com' },
      body: JSON.stringify([{ id: '123' }]) // missing type and timestamp
    });
    const res = await worker.fetch(req, { AXIM_CORE_URL: 'http://test', AXIM_GATEWAY_TOKEN: 'token' }, { waitUntil: () => {} });
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('Telemetry event validation failed.');
  });
});
