
global.fetch = vi.fn().mockResolvedValue({ ok: true });
import assert from 'assert';
import { vi } from 'vitest';
import { describe, it, expect } from 'vitest';
import worker from './telemetry-worker.js';

describe('telemetry-worker', () => {
  it('handles OPTIONS request', async () => {
    const req = new Request('https://telemetry.axim.us.com', { method: 'OPTIONS', headers: { Origin: 'https://axim.us.com' } });
    const res = await worker.fetch(req, {}, { waitUntil: () => {} });
    expect(res.status).toBe(204);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('https://axim.us.com');
    expect(res.headers.get('Access-Control-Allow-Headers')).toContain('x-axim-client');
  });

  it('handles GET /api/telemetry/health request', async () => {
    const req = new Request('https://telemetry.axim.us.com/api/telemetry/health', { method: 'GET' });
    Object.defineProperty(req, 'cf', { value: { colo: 'TEST_COLO' } });
    const res = await worker.fetch(req, {}, { waitUntil: () => {} });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe('ok');
    expect(typeof body.timestamp).toBe('number');
    expect(body.version).toBeDefined();
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
    expect(body.error).toBe('Telemetry payload structure is invalid.');
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
    expect(body.error).toBe('Telemetry payload structure is invalid.');
  });
  it('rejects an unapproved CORS origin', async () => {
    const req = new Request('https://telemetry.axim.us.com/api/telemetry/ingest', {
      method: 'POST',
      headers: { Origin: 'https://attacker.example' },
      body: JSON.stringify([])
    });
    const res = await worker.fetch(req, {}, {});
    expect(res.status).toBe(403);
    await expect(res.json()).resolves.toMatchObject({ success: false, code: 403 });
  });

  it('returns 503 when neither the uplink nor durable buffer is available', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Uplink unavailable'));
    const event = { id: 'event-1', timestamp: new Date().toISOString(), event: { category: 'test' } };
    const req = new Request('https://telemetry.axim.us.com/api/telemetry/ingest', {
      method: 'POST',
      headers: { Origin: 'https://axim.us.com' },
      body: JSON.stringify([event])
    });
    const res = await worker.fetch(req, {
      AXIM_CORE_URL: 'https://core.axim.us.com',
      AXIM_GATEWAY_TOKEN: 'token'
    }, {});
    expect(res.status).toBe(503);
    await expect(res.json()).resolves.toMatchObject({ success: false, code: 503 });
    fetchSpy.mockRestore();
  });

});