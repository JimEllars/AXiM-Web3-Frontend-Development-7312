const fs = require('fs');
let content = fs.readFileSync('workers/telemetry-worker.js', 'utf8');
content = content.replace(
  "return new Response(null, { status: 200, headers: CORS_HEADERS });",
  "return new Response(null, { status: 204, headers: CORS_HEADERS });"
);
fs.writeFileSync('workers/telemetry-worker.js', content);
