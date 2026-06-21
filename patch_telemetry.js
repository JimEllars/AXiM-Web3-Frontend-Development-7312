import fs from 'fs';

const filePath = 'src/lib/telemetry.js';
let content = fs.readFileSync(filePath, 'utf8');

// Update telemetryStore initialization
content = content.replace('export const telemetryStore = [];', `
let initialStore = [];
if (typeof window !== 'undefined' && sessionStorage) {
  try {
    const cached = sessionStorage.getItem('axim_telemetry_cache');
    if (cached) {
      initialStore = JSON.parse(cached);
    }
  } catch(e) {
    console.error("Telemetry cache parse error", e);
  }
}
export const telemetryStore = initialStore;
`);

// Update length check and storage
const oldLogLogic = `  // Keep memory footprint light; only store last 50 events locally
  if (telemetryStore.length > 50) {
    telemetryStore.pop();
  }`;

const newLogLogic = `  // Hard cap telemetry memory at 100 events
  if (telemetryStore.length > 100) {
    telemetryStore.length = 100;
  }

  // Sync to sessionStorage
  if (typeof window !== 'undefined' && sessionStorage) {
    try {
      sessionStorage.setItem('axim_telemetry_cache', JSON.stringify(telemetryStore));
    } catch(e) {
      console.error("Telemetry cache write error", e);
    }
  }`;

content = content.replace(oldLogLogic, newLogLogic);

fs.writeFileSync(filePath, content);
console.log('Patched src/lib/telemetry.js');
