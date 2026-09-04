export default {
  async fetch(request, env) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': 'https://axim.us.com',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      Vary: 'Origin'
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
    }

    try {
      const primaryRpcUrl = env.ALCHEMY_RPC_URL;
      const secondaryRpcUrl = "https://arb1.arbitrum.io/rpc";

      const reqBody = await request.text();

      let response;
      try {
        if (!primaryRpcUrl) throw new Error("Primary RPC not configured");
        response = await fetch(primaryRpcUrl, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
          },
          body: reqBody,
          signal: AbortSignal.timeout(3500)
        });
        if (!response.ok) {
           throw new Error(`Primary RPC returned ${response.status}`);
        }
      } catch (err) {
        console.warn("RPC Worker Primary Failed, trying Secondary:", err);
        response = await fetch(secondaryRpcUrl, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
          },
          body: reqBody,
          signal: AbortSignal.timeout(5000)
        });
      }

      const data = await response.text();

      return new Response(data, {
        status: response.status,
        headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
        }
      });

    } catch (error) {
      console.error("RPC Worker Error:", error);
      if (error.name === 'TimeoutError') {
        return new Response(JSON.stringify({ error: "Gateway Timeout" }), {
          status: 504,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }
      return new Response(JSON.stringify({ error: "Internal Server Error" }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
  }
};
