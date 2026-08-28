// workers/rpc-worker.js

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
      const rpcUrl = env.ALCHEMY_RPC_URL;
      if (!rpcUrl) {
         return new Response(JSON.stringify({ error: "RPC URL not configured" }), {
           status: 500,
           headers: { 'Content-Type': 'application/json', ...corsHeaders }
         });
      }

      const reqBody = await request.text();

      const response = await fetch(rpcUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: reqBody,
        signal: AbortSignal.timeout(5000)
      });

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
