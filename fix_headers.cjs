const fs = require('fs');

let content = fs.readFileSync('public/_headers', 'utf8');

if (!content.includes('/index.html')) {
  content += "\n/index.html\n  Cache-Control: no-cache, no-store, must-revalidate\n";
  fs.writeFileSync('public/_headers', content);
}
