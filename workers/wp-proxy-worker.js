export default {
  async fetch(request, env, ctx) {
    // 1. Handle CORS Preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, authorization, x-axim-client',
        },
      });
    }


    // 2. Handle AI Context Edge Endpoint
    if (request.method === 'GET' && new URL(request.url).pathname === '/api/ai-context') {
      try {
        const wpResponse = await fetch('https://wp.axim.us.com/wp-json/wp/v2/posts?per_page=10', {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Cloudflare-WP-Proxy-AI-Context/1.0'
          }
        });

        if (!wpResponse.ok) {
           return new Response(JSON.stringify({ error: 'Failed to fetch AI context' }), { status: 500 });
        }

        const posts = await wpResponse.json();

        const cleanPosts = posts.map(post => ({
          title: (post.title?.rendered || '').replace(/<[^>]*>?/gm, ''),
          excerpt: (post.excerpt?.rendered || '').replace(/<[^>]*>?/gm, ''),
          slug: post.slug,
          link: 'https://axim.us.com/article/' + post.slug
        }));

        return new Response(JSON.stringify(cleanPosts), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=3600',
            'Access-Control-Allow-Origin': '*'
          }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: 'Internal Error fetching AI context' }), { status: 500 });
      }
    }

    try {
      const url = new URL(request.url);
      const endpoint = url.searchParams.get('endpoint');

      let fetchUrl;

      // Ensure that the target URL explicitly includes the incoming query string.
      if (endpoint) {
        if (!endpoint.startsWith('/wp-json/') && !endpoint.startsWith('/wp/')) {
          return new Response(JSON.stringify({ success: false, error: 'Invalid or missing endpoint parameter.', code: 403, timestamp: new Date().toISOString() }), {
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
          return new Response(JSON.stringify({ success: false, error: 'Invalid or missing proxy path.', code: 403, timestamp: new Date().toISOString() }), {
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
        ctx.waitUntil(
          cache.put(cacheKey, finalResponse.clone()).catch(err => {
            console.error('Cache put failed', err);
          })
        );
      }

      return finalResponse;

    } catch (error) {
      return new Response(JSON.stringify({ success: false, error: 'Internal Server Error', code: 500, timestamp: new Date().toISOString() }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
  }
};
