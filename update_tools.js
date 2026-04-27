const fs = require('fs');

let toolsContent = fs.readFileSync('src/pages/Tools.jsx', 'utf8');

// Replace standard <button>Enroll Protocol...</button> with an anchor tag with target="_blank"
toolsContent = toolsContent.replace(
  /<button className="([^"]+)">\s*Enroll Protocol <SafeIcon icon=\{LuArrowRight\} \/>\s*<\/button>/g,
  `<a href="#" target="_blank" rel="noopener noreferrer" className="$1">\n                Enroll Protocol <SafeIcon icon={LuArrowRight} />\n              </a>`
);

fs.writeFileSync('src/pages/Tools.jsx', toolsContent);
