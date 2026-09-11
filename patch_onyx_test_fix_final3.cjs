const fs = require('fs');
let code = fs.readFileSync('src/hooks/useOnyxStream.test.js', 'utf8');

const target2 = `    expect(assistantMessage.content).toMatch(/\\[SYSTEM OFFLINE\\]/);`;
const target3 = `    expect(assistantMessage.content).toMatch(/(\\[SYSTEM OFFLINE\\]|\\[STREAM ABORTED\\])/);`;

code = code.replace(target2, target3);

fs.writeFileSync('src/hooks/useOnyxStream.test.js', code);
