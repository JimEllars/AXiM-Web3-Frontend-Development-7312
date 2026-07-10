export default {
  async fetch(request, env, ctx) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-AXiM-Internal-Key'
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method === 'POST') {
      ctx.waitUntil(
        (async () => {
          try {
            const body = await request.text();
            let payloadArr = [];

            try {
              payloadArr = JSON.parse(body);
            } catch (err) {
              console.error("Failed to parse telemetry JSON", err);
              return;
            }

            if (Array.isArray(payloadArr) && payloadArr.length > 15) {
              payloadArr = payloadArr.map(item => ({ ...item, severity: "CRITICAL_BURST" }));
            }

            const dbUrl = env.SUPABASE_URL + '/rest/v1/telemetry_ingress';

            await fetch(dbUrl, {
              method: 'POST',
              headers: {
                'apikey': env.SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${env.SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(payloadArr)
            });
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
