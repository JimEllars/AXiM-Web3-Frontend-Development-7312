const fs = require('fs');
let content = fs.readFileSync('src/hooks/useOnyxStream.js', 'utf-8');

content = content.replace(
  "setMessages(prev => [...prev, userMessage]);",
  "setMessages(prev => [...prev, userMessage].slice(-500));"
);

content = content.replace(
  "setMessages(prev => [...prev, {\n      id: onyxMessageId,\n      role: 'assistant',\n      content: '',\n      timestamp: new Date().toISOString(),\n      isStreaming: true\n    }]);",
  "setMessages(prev => [...prev, {\n      id: onyxMessageId,\n      role: 'assistant',\n      content: '',\n      timestamp: new Date().toISOString(),\n      isStreaming: true\n    }].slice(-500));"
);

fs.writeFileSync('src/hooks/useOnyxStream.js', content);
