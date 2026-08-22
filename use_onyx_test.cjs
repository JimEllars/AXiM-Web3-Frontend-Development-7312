const fs = require('fs');

let hookContent = fs.readFileSync('src/hooks/useOnyxStream.js', 'utf8');
if (hookContent.includes('const backoff = Math.pow(2, retryCount) * 1000;')) {
    // it didn't replace correctly in the previous script? Let's check.
}
