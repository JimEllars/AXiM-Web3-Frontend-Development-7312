export const telemetryStore = [];

export function logTelemetry(type, payload) {
  const event = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    type,
    payload,
  };

  telemetryStore.unshift(event);

  // Keep memory footprint light; only store last 50 events locally
  if (telemetryStore.length > 50) {
    telemetryStore.pop();
  }

  // Optional: Dispatch a custom event so UI components can re-render if needed
  try {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new window.CustomEvent('axim-telemetry-update', { detail: event }));
    }
  } catch (e) { console.error("Telemetry error", e); }


  console.log(`[TELEMETRY: ${type}]`, payload);
}
