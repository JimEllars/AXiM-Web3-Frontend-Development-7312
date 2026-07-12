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

      // 4. Supabase Setup
      // using REST fetch since Supabase client might not be installed
      const supabaseUrl = env.VITE_SUPABASE_URL || env.SUPABASE_URL;
      const supabaseKey = env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_SERVICE_ROLE_KEY;

      if (!supabaseUrl || !supabaseKey) {
        return new Response(JSON.stringify({ error: 'Server Configuration Error' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      }

      const headers = {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      };

      const results = { successful: [], failed: [] };

      // Helper function to update status
      const updateRecordStatus = async (id, status) => {
        await fetch(`${supabaseUrl}/rest/v1/echo_dlq_records?id=eq.${id}`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify({ status })
        });
      };

      // Process in chunks of 5
      const chunkSize = 5;
      for (let i = 0; i < recordIds.length; i += chunkSize) {
        const chunk = recordIds.slice(i, i + chunkSize);

        const chunkPromises = chunk.map(async (id) => {
          try {
            // 4a. Fetch record
            const getRes = await fetch(`${supabaseUrl}/rest/v1/echo_dlq_records?id=eq.${id}&select=*`, {
              method: 'GET',
              headers
            });

            if (!getRes.ok) {
              throw new Error(`Failed to fetch record ${id}`);
            }

            const data = await getRes.json();
            if (!data || data.length === 0) {
              throw new Error(`Record ${id} not found`);
            }
            const record = data[0];

            // Set to replaying (handled by ui but edge can ensure it just in case, or ui can handle)
            // As per instructions, edge executes the replay.

            // 4b. Mock a successful POST to the target_destination
            // We simulate a successful POST for now.
            const mockPost = async () => {
              // const destination = record.target_destination;
              // const payload = record.payload;
              return new Promise((resolve) => setTimeout(resolve, 100)); // 100ms mock delay
            };
            await mockPost();

            // 4c. Update status to resolved
            await updateRecordStatus(id, 'resolved');
            results.successful.push(id);

          } catch (err) {
            results.failed.push({ id, error: err.message });
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
