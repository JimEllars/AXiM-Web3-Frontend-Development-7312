const CORS_HEADERS = {
  'Access-Control-Allow-Origin': 'https://axim.us.com',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-AXiM-Internal-Key, authorization, x-axim-client',
  'Cache-Control': 'no-store, max-age=0',
  Vary: 'Origin'
};

function jsonResponse(payload, status) {
  if (payload && payload.error) {
    payload = { success: false, error: payload.error, code: status, timestamp: new Date().toISOString() };
  }
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
  });
}

function isValidEvent(event) {
  return Boolean(
    event &&
    typeof event.id === 'string' &&
    event.id.length <= 128 &&
    typeof event.timestamp === 'string' &&
    !Number.isNaN(Date.parse(event.timestamp)) &&
    typeof event.type === 'string' &&
    event.type.length <= 128 &&
    JSON.stringify(event.payload ?? null).length <= 16384
  );
}

export default {
  async fetch(request, env, ctx) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 200, headers: CORS_HEADERS });
    }

    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405, headers: CORS_HEADERS });
    }

    if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
      return jsonResponse({ error: 'Telemetry ingestion is not configured.' }, 503);
    }

    let events;
    try {
      events = await request.json();
    } catch {
      return jsonResponse({ error: 'Invalid JSON payload.' }, 400);
    }

    if (!Array.isArray(events)) {
      events = [events];
    }

    if (events.length === 0 || events.length > 50) {
      return jsonResponse({ error: 'Expected between 1 and 50 telemetry events.' }, 400);
    }

    if (!events.every(isValidEvent)) {
      return jsonResponse({ error: 'Telemetry event validation failed.' }, 400);
    }

    // Capture request CF details (client IP/geo tagging)
    const geoData = {
      ip: request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || 'unknown',
      country: request.cf?.country || 'unknown',
      city: request.cf?.city || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown'
    };

    // Append geo/client data to each event payload securely
    events = events.map(event => ({
      ...event,
      payload: {
         ...(event.payload || {}),
         _cf_geo: geoData
      }
    }));

    ctx.waitUntil(
      (async () => {
        try {
          const response = await fetch(`${env.SUPABASE_URL}/rest/v1/telemetry_ingress`, {
            method: 'POST',
            headers: {
              apikey: env.SUPABASE_SERVICE_ROLE_KEY,
              Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
              'Content-Type': 'application/json',
              Prefer: 'return=minimal'
            },
            body: JSON.stringify(events)
          });
          if (!response.ok) {
            console.error('Telemetry ingestion failed', response.status);
          }
        } catch (err) {
          console.error('Telemetry ingestion error', err);
        }
      })()
    );

    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }
};
