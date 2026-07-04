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

      // 2. Strict Validation: Prevent Open Proxy
      if (!endpoint || (!endpoint.startsWith('/wp-json/') && !endpoint.startsWith('/wp/'))) {
        return new Response(JSON.stringify({ error: 'Invalid or missing endpoint parameter.' }), {
          status: 403,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }

      // 3. Construct Target URL
      const targetUrl = `https://wp.axim.us.com${endpoint}`;

      // 4. Server-Side Fetch
      const wpResponse = await fetch(targetUrl, {
        method: request.method,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Cloudflare-WP-Proxy/1.0'
        }
      });

      // 5. Build Response with Permissive CORS and Caching
      const responseBody = await wpResponse.arrayBuffer(); // Read body safely
      const headers = new Headers(wpResponse.headers);
      headers.set('Access-Control-Allow-Origin', '*');
      headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
      headers.set('Cache-Control', 'public, max-age=300'); // 5 minutes edge caching

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
