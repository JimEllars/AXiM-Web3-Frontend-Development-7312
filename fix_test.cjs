const fs = require('fs');

let content = fs.readFileSync('src/lib/telemetry.test.js', 'utf8');

content = content.replace(
  "global.fetch.mockRejectedValueOnce(new Error('Network error'));",
  "global.fetch.mockRejectedValue(new Error('Network error'));"
);

content = content.replace(
  "global.fetch.mockResolvedValueOnce({ ok: true, status: 200, json: () => Promise.resolve({ success: true }) });",
  "global.fetch.mockResolvedValue({ ok: true, status: 200, json: () => Promise.resolve({ success: true }) });"
);

fs.writeFileSync('src/lib/telemetry.test.js', content);
