const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
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
    (event.sessionId === undefined || typeof event.sessionId === 'string') &&
    event.type.length <= 128 &&
    JSON.stringify(event.payload ?? null).length <= 16384
  );
}

export default {
  async fetch(request, env, ctx) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    if (request.method !== 'POST' || (url.pathname !== '/' && url.pathname !== '/telemetry/batch' && url.pathname !== '/api/telemetry')) {
      return new Response('Not Found or Method Not Allowed', { status: 404, headers: CORS_HEADERS });
    }

    if (!env.AXIM_CORE_URL || !env.AXIM_GATEWAY_TOKEN) {
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
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3500);

          const response = await fetch(`${env.AXIM_CORE_URL}/api/v1/telemetry/ingest`, {
            method: 'POST',
            headers: {
              'X-Axim-Gateway-Token': env.AXIM_GATEWAY_TOKEN,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(events),
            signal: controller.signal
          });

          clearTimeout(timeoutId);

          if (!response.ok) {
            throw new Error(`Gateway returned ${response.status}`);
          }
        } catch (err) {
          console.warn('Telemetry Gateway ingestion failed, falling back to KV buffer', err);
          if (env.TELEMETRY_BUFFER_KV) {
            try {
              const batchId = crypto.randomUUID();
              await env.TELEMETRY_BUFFER_KV.put(
                `telemetry_batch_${Date.now()}_${batchId}`,
                JSON.stringify(events),
                { expirationTtl: 86400 } // Keep for 24h
              );
            } catch (kvErr) {
              console.error('Failed to write to KV buffer', kvErr);
            }
          }
        }
      })()
    );

    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }
};
