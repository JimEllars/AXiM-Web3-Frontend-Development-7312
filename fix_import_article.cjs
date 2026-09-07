const fs = require('fs');
let content = fs.readFileSync('src/pages/Article.jsx', 'utf8');
content = content.replace("import { affiliateProducts } from '../data/companyOfferings';", "import { affiliateProducts } from '../data/companyOfferings.js';");
fs.writeFileSync('src/pages/Article.jsx', content);
