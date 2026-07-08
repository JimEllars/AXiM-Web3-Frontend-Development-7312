export default {
  async fetch(request, env, ctx) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method === 'POST') {
      ctx.waitUntil(
        (async () => {
          try {
            const body = await request.text();
            console.log("Telemetry Payload:", body);
            // Simulate Supabase POST request or handle it here
            // If there's actual Supabase POST it would be here, but current code only has console.log
          } catch (e) {
            console.error("Error reading telemetry payload:", e);
          }
        })()
      );
      // Immediately return 204 to the frontend
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    return new Response('Not Found', { status: 404 });
  }
};
