const fs = require('fs');
let content = fs.readFileSync('vite.config.js', 'utf8');
content = content.replace(
  "'vendor-web3': ['thirdweb', 'ethers']",
  "'vendor-web3': ['thirdweb']"
);
fs.writeFileSync('vite.config.js', content);
