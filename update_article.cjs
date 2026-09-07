const fs = require('fs');
let content = fs.readFileSync('src/pages/Article.jsx', 'utf8');

if (!content.includes('import { affiliateProducts } from')) {
    content = content.replace("import DOMPurify from 'dompurify';", "import DOMPurify from 'dompurify';\nimport { affiliateProducts } from '../data/companyOfferings.js';");
}

const mockProductsBlockRegex = /const mockProducts = \[\s*\{[\s\S]*?\}\s*\];/;
content = content.replace(mockProductsBlockRegex, '');

content = content.replace('<AffiliateTable products={mockProducts} />', '<AffiliateTable products={affiliateProducts || []} />');

fs.writeFileSync('src/pages/Article.jsx', content);
console.log('Article.jsx updated');
