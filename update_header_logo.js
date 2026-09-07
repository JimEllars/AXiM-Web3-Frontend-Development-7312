const fs = require('fs');
const filePath = 'src/components/Header.jsx';
let content = fs.readFileSync(filePath, 'utf8');

const oldLogo = 'https://wp.axim.us.com/wp-content/uploads/2026/08/AXiM-Business-Development-1200x628-layout1284-axim-infrastructure-axim-axim-1l7kujc-e1786418301264.webp';
const newLogo = 'https://wp.axim.us.com/wp-content/uploads/2026/09/AXiM-Development-1200x400-layout684-business-axim-axim-infrastructure-1l9s8d3.webp';

content = content.replace(oldLogo, newLogo);
content = content.replace('h-12 md:h-16 w-auto object-contain', 'h-10 md:h-12 w-auto object-contain');

fs.writeFileSync(filePath, content);
console.log('Header logo updated');
