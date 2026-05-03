const fs = require('fs');
const content = `export default function Chatbot() {\n  return null;\n}\n`;
fs.writeFileSync('src/components/Chatbot.jsx', content);
