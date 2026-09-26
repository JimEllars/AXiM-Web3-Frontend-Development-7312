const ALLOWED_ORIGINS = new Set([
  'https://axim.network',
  'https://www.axim.network',
  'https://axim.us.com',
  'https://www.axim.us.com',
  'http://localhost:5173'
]);
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 120;
const requestCounts = new Map();

function isAllowedOrigin(origin) {
  if (!origin) return true;
  try {
    const url = new URL(origin);
    return ALLOWED_ORIGINS.has(origin) || url.protocol === 'https:' && url.hostname.endsWith('.pages.dev');
  } catch {
    return false;
  }
}

function corsHeaders(request) {
  const origin = request.headers.get('Origin');
  return origin && isAllowedOrigin(origin)
    ? { 'Access-Control-Allow-Origin': origin, Vary: 'Origin' }
    : {};
}

function jsonResponse(request, status, payload) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...corsHeaders(request),
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff'
    }
  });
}

function errorResponse(request, status, error) {
  return jsonResponse(request, status, {
    success: false,
    error,
    code: status,
    timestamp: Date.now()
  });
}

function rateLimited(request) {
  const client = request.headers.get('CF-Connecting-IP') || 'anonymous';
  const now = Date.now();
  const entry = requestCounts.get(client);
  const next = !entry || now - entry.startedAt >= RATE_LIMIT_WINDOW_MS
    ? { startedAt: now, count: 1 }
    : { ...entry, count: entry.count + 1 };

  requestCounts.set(client, next);
  return next.count > RATE_LIMIT_MAX_REQUESTS;
}

function validEvent(event) {
  return Boolean(
    event
      && typeof event.id === 'string'
      && event.id.length <= 128
      && typeof event.timestamp === 'string'
      && !Number.isNaN(Date.parse(event.timestamp))
      && event.event
      && typeof event.event === 'object'
  );
}

async function deliverOrBuffer(events, env) {
  try {
    const response = await fetch(`${env.AXIM_CORE_URL}/api/v1/telemetry/ingest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Axim-Gateway-Token': env.AXIM_GATEWAY_TOKEN
      },
      body: JSON.stringify(events)
    });
    if (response.ok) return true;
  } catch {
    // Use the durable edge buffer before reporting the uplink failure.
  }

  if (!env.TELEMETRY_BUFFER_KV) return false;
  try {
    await env.TELEMETRY_BUFFER_KV.put(
      `telemetry_batch_${Date.now()}_${crypto.randomUUID()}`,
      JSON.stringify(events),
      { expirationTtl: 86400 }
    );
    return true;
  } catch {
    return false;
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin');

    if (request.method === 'OPTIONS') {
      if (!isAllowedOrigin(origin)) return errorResponse(request, 403, 'Origin is not allowed.');
      return new Response(null, {
        status: 204,
        headers: {
          ...corsHeaders(request),
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, authorization, x-axim-client',
          'Access-Control-Max-Age': '86400',
          Vary: 'Origin'
        }
      });
    }

    if (url.pathname === '/api/telemetry/health' && request.method === 'GET') {
      return jsonResponse(request, 200, {
        status: 'ok',
        timestamp: Date.now(),
        version: env.TELEMETRY_VERSION || '1.0.0'
      });
    }

    if (request.method !== 'POST' || !['/', '/api/telemetry', '/api/telemetry/ingest', '/telemetry/batch'].includes(url.pathname)) {
      return errorResponse(request, 404, 'Route not found.');
    }
    if (!isAllowedOrigin(origin)) return errorResponse(request, 403, 'Origin is not allowed.');
    if (rateLimited(request)) return errorResponse(request, 429, 'Too many telemetry requests.');
    if (!env.AXIM_CORE_URL || !env.AXIM_GATEWAY_TOKEN) {
      return errorResponse(request, 503, 'Telemetry uplink is unavailable.');
    }

    let events;
    try {
      events = await request.json();
    } catch {
      return errorResponse(request, 400, 'Invalid JSON payload.');
    }

    const batch = Array.isArray(events) ? events : [events];
    if (batch.length === 0 || batch.length > 100 || !batch.every(validEvent)) {
      return errorResponse(request, 400, 'Telemetry payload structure is invalid.');
    }

    if (!await deliverOrBuffer(batch, env)) {
      return errorResponse(request, 503, 'Telemetry uplink is unavailable.');
    }
    return jsonResponse(request, 202, { success: true, status: 'accepted' });
  }
};
