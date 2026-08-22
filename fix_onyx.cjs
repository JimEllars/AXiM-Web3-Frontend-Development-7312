const fs = require('fs');
let content = fs.readFileSync('src/hooks/useOnyxStream.js', 'utf8');

// Replace the maxRetries and backoff logic
content = content.replace(
  "const maxRetries = 3;",
  "const maxRetries = 4;\n    let currentBackoff = 1000;"
);

content = content.replace(
  "const backoff = Math.pow(2, retryCount) * 1000;",
  "const backoff = currentBackoff;\n          currentBackoff = Math.min(currentBackoff * 2, 8000);"
);

// Handle heartbeat pings without failing
content = content.replace(
  "if (parsed.error) throw new Error(parsed.error);",
  "if (parsed.error) throw new Error(parsed.error);\n                if (parsed.type === 'keepalive') continue;"
);

fs.writeFileSync('src/hooks/useOnyxStream.js', content);
