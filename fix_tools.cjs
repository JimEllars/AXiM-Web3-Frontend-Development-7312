const fs = require('fs');

let content = fs.readFileSync('src/pages/Tools.jsx', 'utf8');

// Replace empty newlines in Launch App
content = content.replace(
  /<a\s+href=\{destUrl\}\s+target="_blank"\s+rel="noopener noreferrer"/g,
  `<a\n                    href={destUrl}\n                    target="_blank"\n                    rel="noopener noreferrer"`
);

content = content.replace(
  /<a\n  href=\{destUrl\}\n\n  target="_blank"\n\n                    rel="noopener noreferrer"/g,
  `<a href={destUrl} target="_blank" rel="noopener noreferrer"`
);

fs.writeFileSync('src/pages/Tools.jsx', content);
