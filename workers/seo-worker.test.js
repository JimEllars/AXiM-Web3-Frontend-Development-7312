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
});
