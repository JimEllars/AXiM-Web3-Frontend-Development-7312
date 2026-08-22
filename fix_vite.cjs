const fs = require('fs');

let content = fs.readFileSync('vite.config.js', 'utf8');

content = content.replace(
  "'react-vendor': ['react', 'react-dom', 'react-router-dom'],",
  "'vendor-react': ['react', 'react-dom', 'react-router-dom', 'zustand'],"
);
content = content.replace(
  "'state-vendor': ['zustand']",
  "'vendor-web3': ['thirdweb', 'ethers']"
);
content = content.replace(
  "'ui-vendor': ['framer-motion', 'lucide-react', 'react-icons'],",
  "'vendor-icons': ['lucide-react'],\n          'ui-vendor': ['framer-motion', 'react-icons'],"
);

fs.writeFileSync('vite.config.js', content);
