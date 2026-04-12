import { test } from 'node:test';
import assert from 'node:assert';
import { fetchPostsByCategory } from './src/lib/wp-fetch.js';

test('fallback trigger on 0 posts', async () => {
    let mockFetchCalls = [];
    const mockFetch = async (url) => {
        mockFetchCalls.push(url);
        if (url.includes('/categories?slug=apps')) {
            return {
                ok: true,
                json: async () => [{ id: 81, slug: 'apps' }]
            };
        }
        if (url.includes('/posts?categories=81')) {
            return {
                ok: true,
                json: async () => [] // Returns 0 posts!
            };
        }
        if (url.includes('/posts?orderby=date')) { // The fallback fetch
            return {
                ok: true,
                json: async () => [{ id: 999, title: { rendered: 'Fallback' } }]
            };
        }
    };

    global.fetch = mockFetch;

    const result = await fetchPostsByCategory('apps', 1);
    console.log(result);
    console.log(mockFetchCalls);
});
