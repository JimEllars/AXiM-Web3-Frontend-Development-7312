const fs = require('fs');
const filePath = 'src/components/Footer.jsx';
let content = fs.readFileSync(filePath, 'utf8');

const oldLogo = 'https://wp.axim.us.com/wp-content/uploads/2026/08/AXiM-Business-Development-1200x628-layout1284-axim-infrastructure-axim-axim-1l7kujc-e1786418301264.webp';
const newLogo = 'https://wp.axim.us.com/wp-content/uploads/2026/09/AXiM-Development-1200x400-layout684-business-axim-axim-infrastructure-1l9s8d3.webp';

content = content.replace(oldLogo, newLogo);

fs.writeFileSync(filePath, content);
console.log('Footer logo updated');
