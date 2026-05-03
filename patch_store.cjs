const fs = require('fs');
let code = fs.readFileSync('src/store/useAximStore.js', 'utf-8');

const target = `export const useAximStore = create((set, get) => ({
  // Telemetry state`;

const replacement = `export const useAximStore = create((set, get) => ({
  // Telemetry state
  telemetryStatus: 'STABLE',`;

code = code.replace(target, replacement);

fs.writeFileSync('src/store/useAximStore.js', code);
