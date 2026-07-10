const fs = require('fs');
let content = fs.readFileSync('src/pages/Support.jsx', 'utf8');

if (content.includes('await new Promise(resolve => setTimeout(resolve, 1500));')) {
    content = content.replace('await new Promise(resolve => setTimeout(resolve, 1500));', '');
}

content = content.replace(
  'await fetch("/v1/webhooks/enrich"',
  'await fetch(import.meta.env.VITE_SUPPORT_WEBHOOK || "/v1/webhooks/enrich"'
);

fs.writeFileSync('src/pages/Support.jsx', content);
