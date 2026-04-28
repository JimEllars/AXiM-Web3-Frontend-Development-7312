export function logTelemetry(type, payload) {
  const telemetryUrl = 'https://api.axim.us.com/v1/telemetry/events';
  const data = {
    type,
    ...payload,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    path: window.location.pathname,
    userId: localStorage.getItem('supabase-auth-token') ? 'authenticated-user' : 'anonymous',
  };

  try {
    fetch(telemetryUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      keepalive: true,
    }).catch(e => {
        // Silently fail to not block UI
    });
  } catch (error) {
    // Silently fail to not block UI
  }
}
