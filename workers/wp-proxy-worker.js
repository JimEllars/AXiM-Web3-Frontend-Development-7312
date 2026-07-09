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
      headers.set('Cache-Control', 'public, max-age=300'); // 5 minutes edge caching
      headers.set('X-AXiM-Edge-Latency', `${duration}ms`);

      return new Response(responseBody, {
        status: wpResponse.status,
        headers: headers
      });

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
