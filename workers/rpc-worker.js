// workers/rpc-worker.js

export default {
  async fetch(request, env, ctx) {
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    try {
      const rpcUrl = env.ALCHEMY_RPC_URL;
      if (!rpcUrl) {
         return new Response(JSON.stringify({ error: "RPC URL not configured" }), { status: 500 });
      }

      const reqBody = await request.text();

      const response = await fetch(rpcUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: reqBody
      });

      const data = await response.text();

      return new Response(data, {
        status: response.status,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
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
