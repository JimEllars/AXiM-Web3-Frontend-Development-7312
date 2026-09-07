const fs = require('fs');

let testContent = fs.readFileSync('src/hooks/useOnyxStream.test.js', 'utf8');

testContent = testContent.replace(
  "global.fetch = vi.fn(() => Promise.reject(new Error('Network Error')));",
  "global.fetch.mockRejectedValue(new Error('Network Error'));"
);

testContent = testContent.replace(
  "await waitFor(() => {",
  "await waitFor(() => {"
);

fs.writeFileSync('src/hooks/useOnyxStream.test.js', testContent);

// We should fix the test that causes the infinite loop
// The issue is vi.runAllTimers() running 10000 times because of a setInterval
let content = fs.readFileSync('src/hooks/useOnyxStream.test.js', 'utf8');
content = content.replace("vi.runAllTimers();", "vi.advanceTimersByTime(35000);");
fs.writeFileSync('src/hooks/useOnyxStream.test.js', content);
