const fs = require('fs');

const oldLogo = 'https://wp.axim.us.com/wp-content/uploads/2026/08/AXiM-Business-Development-1200x628-layout1284-axim-infrastructure-axim-axim-1l7kujc-e1786418301264.webp';
const newLogo = 'https://wp.axim.us.com/wp-content/uploads/2026/09/AXiM-Development-1200x400-layout684-business-axim-axim-infrastructure-1l9s8d3.webp';

let seoContent = fs.readFileSync('src/components/SEO.jsx', 'utf8');
seoContent = seoContent.replace(oldLogo, newLogo);
fs.writeFileSync('src/components/SEO.jsx', seoContent);

let workerContent = fs.readFileSync('workers/seo-worker.js', 'utf8');
workerContent = workerContent.split(oldLogo).join(newLogo); // Replace all occurrences
fs.writeFileSync('workers/seo-worker.js', workerContent);

console.log('SEO and Worker logo updated');
