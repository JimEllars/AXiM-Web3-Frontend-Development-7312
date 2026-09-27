import { afterEach, describe, expect, it, vi } from 'vitest';
import worker from './seo-worker.js';

// Minimal mock for HTMLRewriter
class MockHTMLRewriter {
  on() { return this; }
  transform(res) { return res; }
}
globalThis.HTMLRewriter = MockHTMLRewriter;

describe('seo-worker', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('forwards non-html requests to the configured Pages origin', async () => {
    const response = new Response('Pages content', { status: 200 });
    const fetchMock = vi.fn().mockResolvedValue(response);
    vi.stubGlobal('fetch', fetchMock);
    const request = new Request('https://axim.us.com/assets/style.css', {
      headers: { 'Accept': 'text/css' }
    });

    const result = await worker.fetch(request, {
      PAGES_ORIGIN: 'https://axim-web3-frontend.pages.dev'
    });

    expect(result).toBe(response);
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock.mock.calls[0][0].url).toBe(
      'https://axim-web3-frontend.pages.dev/assets/style.css'
    );
  });

  it('intercepts html requests and uses HTMLRewriter', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('html content', { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    // Test HTMLRewriter gets used
    let rewriterCalled = false;
    class SpyHTMLRewriter {
      on() { return this; }
      transform(res) {
        rewriterCalled = true;
        return res;
      }
    }
    globalThis.HTMLRewriter = SpyHTMLRewriter;

    const request = new Request('https://axim.us.com/business', {
      headers: { 'Accept': 'text/html' }
    });

    const env = { PAGES_ORIGIN: 'https://axim.us.com', WP_API_URL: 'https://wp.axim.us.com' };
    await worker.fetch(request, env);
    expect(rewriterCalled).toBe(true);
  });

  it('redirects trailing slash for articles', async () => {
    const request = new Request('https://axim.us.com/article/tech-slug/', {
      headers: { 'Accept': 'text/html' }
    });

    const env = { PAGES_ORIGIN: 'https://axim.us.com' };
    const response = await worker.fetch(request, env);

    expect(response.status).toBe(301);
    expect(response.headers.get('Location')).toBe('https://axim.us.com/article/tech-slug');
  });

  it('returns 404 for invalid route', async () => {
    const request = new Request('https://axim.us.com/invalid-route-123', {
      headers: { 'Accept': 'text/html' }
    });

    const env = { PAGES_ORIGIN: 'https://axim.us.com' };
    const response = await worker.fetch(request, env);

    expect(response.status).toBe(404);
  });
});
