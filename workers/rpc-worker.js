// workers/rpc-worker.js

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Ensure we only handle POST requests for RPC
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    try {
      // Create a cache key using the request URL and body hash (if possible)
      // Since it's a POST, caching is tricky. For simplicity, we might cache based on specific RPC methods if needed.
      // Assuming a simplistic approach for this example or relying on a specific cache key strategy if provided elsewhere.

      const reqBody = await request.clone().text();
      const cacheKey = `${url.toString()}_${hash(reqBody)}`; // Hypothetical hash function

      if (env && env.WEB3_RPC_CACHE) {
        const cachedResponse = await env.WEB3_RPC_CACHE.get(cacheKey);
        if (cachedResponse) {
          return new Response(cachedResponse, {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }

      const endpoints = [
        env.VITE_THIRDWEB_RPC_URL,
        'https://arb1.arbitrum.io/rpc',
        'https://arbitrum.llamarpc.com'
      ];

      let lastError = null;

      for (const endpoint of endpoints) {
        if (!endpoint) continue; // Skip if env var is not set

        try {
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: request.headers,
            body: reqBody
          });

          if (response.ok) {
            const data = await response.text();

            // Cache successful JSON-RPC response
            if (env && env.WEB3_RPC_CACHE) {
              try {
                // Ensure TTL is set (e.g., 3600 seconds)
                await env.WEB3_RPC_CACHE.put(cacheKey, data, { expirationTtl: 3600 });
              } catch (e) {
                console.error("RPC Cache Write Error:", e);
              }
            }

            return new Response(data, {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          } else {
            console.warn(`Endpoint ${endpoint} returned status ${response.status}`);
            lastError = new Error(`Endpoint returned status ${response.status}`);
          }
        } catch (error) {
          console.error(`Fetch to ${endpoint} failed:`, error);
          lastError = error;
        }
      }

      // If all endpoints fail
      return new Response(JSON.stringify({ error: "All RPC endpoints failed", details: lastError?.message }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' }
      });

    } catch (error) {
      console.error("RPC Worker Error:", error);
      return new Response(JSON.stringify({ error: "Internal Server Error" }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
};

// Simple hash function for demonstration purposes
function hash(str) {
  let hash = 0;
  for (let i = 0, len = str.length; i < len; i++) {
    let chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}
