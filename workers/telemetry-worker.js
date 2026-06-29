export default {
  async fetch(request, env, ctx) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
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
          } catch (e) {
            console.error("Error reading telemetry payload:", e);
          }
        })()
      );
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    return new Response('Not Found', { status: 404 });
  }
};
