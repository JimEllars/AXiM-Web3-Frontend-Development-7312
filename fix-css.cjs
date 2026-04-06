const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'node_modules', '@questlabs', 'react-sdk', 'dist', 'style.css');

if (fs.existsSync(targetFile)) {
  let content = fs.readFileSync(targetFile, 'utf8');
  content = content.replace(/clipPath:/g, 'clip-path:');
  content = content.replace(/calc\(100%-24px\)/g, 'calc(100% - 24px)');
  fs.writeFileSync(targetFile, content);
  console.log('Fixed questlabs style.css');
}
