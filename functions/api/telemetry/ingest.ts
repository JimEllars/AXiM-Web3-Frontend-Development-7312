export async function onRequestPost({ request, env }: { request: Request; env: any }) {
  // Proxy to upstream or return 202 Accepted
  return new Response(JSON.stringify({ status: 'accepted' }), {
    status: 202,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
  });
}
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Axim-Gateway-Token'
    }
  });
}
