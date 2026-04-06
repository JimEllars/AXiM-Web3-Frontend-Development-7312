import { fetchPostsByCategory, fetchCache } from './src/lib/wp-fetch.js';

async function runBenchmark() {
  const originalFetch = global.fetch;

  process.env.VITE_WORDPRESS_REST_URL = 'https://custom.axim.us.com/wp-json/wp/v2';

  global.fetch = async (url) => {
    if (url.startsWith('https://axim.us.com/wp-json/wp/v2')) {
      await new Promise(r => setTimeout(r, 500));
      return { ok: false, statusText: 'Not Found' };
    }
    if (url.startsWith('https://wp.axim.us.com/wp-json/wp/v2')) {
      await new Promise(r => setTimeout(r, 500));
      return { ok: false, statusText: 'Not Found' };
    }
    if (url.startsWith('https://custom.axim.us.com/wp-json/wp/v2')) {
      await new Promise(r => setTimeout(r, 200));
      if (url.includes('/categories')) {
        return { ok: true, json: async () => [{ id: 1, slug: 'apps' }] };
      }
      if (url.includes('/posts')) {
        return { ok: true, json: async () => [{ id: 1, title: { rendered: 'Post 1' }, _embedded: {} }] };
      }
    }

    return { ok: true, json: async () => [] };
  };

  fetchCache.clear();

  const start = Date.now();
  await fetchPostsByCategory('apps', 1);
  const duration = Date.now() - start;

  console.log(`\n================================`);
  console.log(`Benchmark completed in ${duration}ms`);
  console.log(`================================\n`);
  global.fetch = originalFetch;
}

runBenchmark();
