export function logTelemetry(type, payload) {
  console.log(`%c[AXiM Telemetry] %c${type}`, 'color: #9333ea; font-weight: bold;', 'color: #fff;', payload);
}
