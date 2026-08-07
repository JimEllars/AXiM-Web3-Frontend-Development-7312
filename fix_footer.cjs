const fs = require('fs');

let content = fs.readFileSync('src/components/Footer.jsx', 'utf8');

// Replace the duplicate </p> tag area
const regex = /\[OPERATOR_ID: VERIFIED \/\/ ARBITRUM\]\n\s*<\/span>\n\s*\)}\n\s*<\/p>\n\s*<div className="flex gap-4">/m;
const replace = `[OPERATOR_ID: VERIFIED // ARBITRUM]
              </span>
            )}
            <div className="flex gap-4">`;

content = content.replace(regex, replace);

fs.writeFileSync('src/components/Footer.jsx', content);
