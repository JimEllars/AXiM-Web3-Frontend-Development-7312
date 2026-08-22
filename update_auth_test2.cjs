const fs = require('fs');
let content = fs.readFileSync('src/hooks/useAximAuth.test.js', 'utf8');

content = content.replace("supabase.auth.getSession.mockRejectedValueOnce(new Error('Failed to fetch'));",
"supabase.auth.getSession.mockImplementationOnce(() => Promise.reject(new Error('Failed to fetch')));");

fs.writeFileSync('src/hooks/useAximAuth.test.js', content);
