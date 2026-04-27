const fs = require('fs');

let content = fs.readFileSync('src/pages/Dashboard.jsx', 'utf8');

// Remove EcosystemRegistry import if it's unused
if (!content.includes('<EcosystemRegistry') && !content.includes('EcosystemRegistry(')) {
    content = content.replace(/import EcosystemRegistry from '\.\.\/components\/admin\/EcosystemRegistry';\n/, '');
}

// Remove supabase import if unused
if (content.indexOf('supabase.') === -1 && content.indexOf('supabase(') === -1) {
    content = content.replace(/import { supabase } from '\.\.\/lib\/supabase';\n/, '');
}

fs.writeFileSync('src/pages/Dashboard.jsx', content);
