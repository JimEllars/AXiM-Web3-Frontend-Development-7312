import { afterEach, describe, expect, it, vi } from 'vitest';
import worker from './seo-worker.js';

describe('seo-worker', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('forwards non-bot requests to the configured Pages origin', async () => {
    const response = new Response('Pages content', { status: 200 });
    const fetchMock = vi.fn().mockResolvedValue(response);
    vi.stubGlobal('fetch', fetchMock);
    const request = new Request('https://axim.us.com/articles?category=tech', {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    const result = await worker.fetch(request, {
      PAGES_ORIGIN: 'https://axim-web3-frontend.pages.dev'
    });

    expect(result).toBe(response);
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock.mock.calls[0][0].url).toBe(
      'https://axim-web3-frontend.pages.dev/articles?category=tech'
    );
  });

  it('intercepts GPTBot/1.2', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify([{ title: { rendered: 'Test Title' }, excerpt: { rendered: 'Test Excerpt' } }]), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    const request = new Request('https://axim.us.com/article/tech-slug', {
      headers: { 'User-Agent': 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.2; +https://openai.com/gptbot)' }
    });

    // We expect it to try to fetch from WP or Cache and NOT just pass through to pages origin
    const env = { PAGES_ORIGIN: 'https://axim.us.com', WP_API_URL: 'https://wp.axim.us.com', FRONTEND_SEO_CACHE: { get: vi.fn().mockResolvedValue(null), put: vi.fn() } };
    await worker.fetch(request, env);
    expect(env.FRONTEND_SEO_CACHE.get).toHaveBeenCalled();
  });

  it('intercepts ClaudeBot/1.0', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify([{ title: { rendered: 'Test Title' }, excerpt: { rendered: 'Test Excerpt' } }]), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    const request = new Request('https://axim.us.com/article/tech-slug', {
      headers: { 'User-Agent': 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; ClaudeBot/1.0; +claudebot@anthropic.com)' }
    });

    const env = { PAGES_ORIGIN: 'https://axim.us.com', WP_API_URL: 'https://wp.axim.us.com', FRONTEND_SEO_CACHE: { get: vi.fn().mockResolvedValue(null), put: vi.fn() } };
    await worker.fetch(request, env);
    expect(env.FRONTEND_SEO_CACHE.get).toHaveBeenCalled();
  });

  it('intercepts PerplexityBot', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify([{ title: { rendered: 'Test Title' }, excerpt: { rendered: 'Test Excerpt' } }]), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    const request = new Request('https://axim.us.com/article/tech-slug', {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PerplexityBot/1.0; +https://perplexity.ai/bot)' }
    });

    const env = { PAGES_ORIGIN: 'https://axim.us.com', WP_API_URL: 'https://wp.axim.us.com', FRONTEND_SEO_CACHE: { get: vi.fn().mockResolvedValue(null), put: vi.fn() } };
    await worker.fetch(request, env);
    expect(env.FRONTEND_SEO_CACHE.get).toHaveBeenCalled();
  });
});