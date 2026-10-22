import { test, describe, expect } from 'vitest';
import worker from './wp-proxy-worker.js';

describe('wp-proxy-worker', () => {
  test('handles OPTIONS request and returns default origin', async () => {
    const req = new Request('https://proxy.example.com', { method: 'OPTIONS' });
    const res = await worker.fetch(req, {}, { waitUntil: () => {} });
    expect(res.status).toBe(204);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('https://axim.us.com');
    expect(res.headers.get('Access-Control-Allow-Headers')).toContain('authorization');
    expect(res.headers.get('Access-Control-Allow-Headers')).toContain('x-axim-client');
  });

  test('handles OPTIONS request and returns allowed origin', async () => {
    const req = new Request('https://proxy.example.com', { method: 'OPTIONS', headers: { 'Origin': 'http://localhost:5173' } });
    const res = await worker.fetch(req, {}, { waitUntil: () => {} });
    expect(res.status).toBe(204);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:5173');
  });

  test('returns 403 for disallowed path', async () => {
    const req = new Request('https://proxy.example.com?endpoint=/invalid', { method: 'GET' });
    const res = await worker.fetch(req, {}, { waitUntil: () => {} });
    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error).toBe('Forbidden path');
  });

  test('returns 403 for wp-login.php', async () => {
    const req = new Request('https://proxy.example.com?endpoint=/wp-login.php', { method: 'GET' });
    const res = await worker.fetch(req, {}, { waitUntil: () => {} });
    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error).toBe('Forbidden');
  });

  test('returns 403 for CGI injection (?-d)', async () => {
    const req = new Request('https://proxy.example.com?endpoint=/wp-json/wp/v2/posts&-d+allow_url_include=1', { method: 'GET' });
    const res = await worker.fetch(req, {}, { waitUntil: () => {} });
    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error).toBe('Forbidden');
  });

  test('returns 403 for .php paths', async () => {
    const req = new Request('https://proxy.example.com?endpoint=/wp-json/wp/v2/posts/test.php', { method: 'GET' });
    const res = await worker.fetch(req, {}, { waitUntil: () => {} });
    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error).toBe('Forbidden');
  });
});
