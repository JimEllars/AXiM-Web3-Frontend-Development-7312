export default {
  async fetch(request, env, ctx) {
    // 1. Handle CORS Preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    try {
      const url = new URL(request.url);
      const endpoint = url.searchParams.get('endpoint');

      let fetchUrl;

      // Ensure that the target URL explicitly includes the incoming query string.
      if (endpoint) {
        if (!endpoint.startsWith('/wp-json/') && !endpoint.startsWith('/wp/')) {
          return new Response(JSON.stringify({ error: 'Invalid or missing endpoint parameter.' }), {
            status: 403,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            }
          });
        }

        // Remove endpoint from the original query params
        url.searchParams.delete('endpoint');

        // Parse the endpoint string as it might contain query params itself
        const parsedEndpoint = new URL(`https://wp.axim.us.com${endpoint}`);

        // Merge the params
        parsedEndpoint.searchParams.forEach((val, key) => {
          url.searchParams.set(key, val);
        });

        fetchUrl = 'https://wp.axim.us.com' + parsedEndpoint.pathname + url.search;
      } else {
        const proxyPath = url.pathname.replace('/api/wp', '');

        if (!proxyPath || (!proxyPath.startsWith('/wp-json/') && !proxyPath.startsWith('/wp/'))) {
          return new Response(JSON.stringify({ error: 'Invalid or missing proxy path.' }), {
            status: 403,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            }
          });
        }

        fetchUrl = 'https://wp.axim.us.com' + proxyPath + url.search;
      }

      // 4. Server-Side Fetch
      const startTime = Date.now();

      const cacheKey = new Request(fetchUrl, request);
      const cache = caches.default;

      if (request.method === 'GET') {
        let cachedResponse = await cache.match(cacheKey);
        if (cachedResponse) {
          const newHeaders = new Headers(cachedResponse.headers);
          newHeaders.set('X-Cache-Status', 'HIT');
          return new Response(cachedResponse.body, {
            status: cachedResponse.status,
            statusText: cachedResponse.statusText,
            headers: newHeaders
          });
        }
      }
      const wpResponse = await fetch(fetchUrl, {
        method: request.method,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Cloudflare-WP-Proxy/1.0'
        }
      });
      const duration = Date.now() - startTime;

      // 5. Build Response with Permissive CORS and Caching
      const responseBody = await wpResponse.arrayBuffer(); // Read body safely
      const headers = new Headers(wpResponse.headers);
      headers.set('Access-Control-Allow-Origin', '*');
      headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');

      if (fetchUrl.match(/\.(webp|png|jpg|jpeg|svg)$/i)) {
        headers.set('Cache-Control', 'public, max-age=31536000, immutable');
      } else {
        headers.set('Cache-Control', 'public, max-age=60, s-maxage=300, stale-while-revalidate=600'); // 5 minutes edge caching, 1 hour CDN caching
      }

      headers.set('X-AXiM-Edge-Latency', `${duration}ms`);

      const finalResponse = new Response(responseBody, {
        status: wpResponse.status,
        headers: headers
      });

      if (request.method === 'GET' && wpResponse.ok) {
        ctx.waitUntil(cache.put(cacheKey, finalResponse.clone()));
      }

      return finalResponse;

    } catch (error) {
      return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
  }
};
