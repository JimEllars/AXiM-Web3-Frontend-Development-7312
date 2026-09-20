export default {
  async fetch(request, env, ctx) {
    // 1. Handle CORS Preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    try {
      const url = new URL(request.url);

      // Enforce endpoint matching
      if (url.pathname !== '/api/v1/replay') {
        return new Response(JSON.stringify({ error: 'Not Found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      }

      // Enforce POST method
      if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
          status: 405,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      }

      // 2. Authentication check
      const authHeader = request.headers.get('Authorization');
      // Protect with AXIM_INTERNAL_KEY
      if (!authHeader || authHeader !== `Bearer ${env.AXIM_INTERNAL_KEY}`) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      }

      // 3. Parse Payload
      let recordIds;
      try {
        const body = await request.json();
        recordIds = body.recordIds;
        if (!Array.isArray(recordIds)) {
          throw new Error('recordIds must be an array');
        }
      } catch (err) {
        return new Response(JSON.stringify({ error: 'Bad Request: invalid payload' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      }

      const coreUrl = env.AXIM_CORE_URL || "https://core.axim.us.com";
      const results = { successful: [], failed: [] };

      // Process in chunks of 5
      const chunkSize = 5;
      for (let i = 0; i < recordIds.length; i += chunkSize) {
        const chunk = recordIds.slice(i, i + chunkSize);

        const chunkPromises = chunk.map(async (recordId) => {
          try {
            const fetchRes = await fetch(`${coreUrl}/api/v1/workflows/dispatch`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-Axim-Gateway-Token": env.AXIM_GATEWAY_TOKEN || ""
              },
              body: JSON.stringify({
                workflow_type: "echo_dlq_replay",
                payload: { recordId, action: "replay" },
                trigger_source: "axim-frontend-edge"
              })
            });

            if (fetchRes.status === 200 || fetchRes.status === 201 || fetchRes.status === 202) {
              results.successful.push(recordId);
            } else {
              throw new Error(`Target returned status ${fetchRes.status}`);
            }

          } catch (err) {
            results.failed.push({ id: recordId, error: err.message });
          }
        });

        // Wait for current chunk of 5 to resolve
        await Promise.all(chunkPromises);
      }

      // 5. Build Response
      return new Response(JSON.stringify({
        message: 'Replay complete',
        results
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });

    } catch (error) {
      return new Response(JSON.stringify({ error: 'Internal Server Error', details: error.message }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
  }
};
