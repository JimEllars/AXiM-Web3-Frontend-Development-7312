const fs = require('fs');
let content = fs.readFileSync('src/App.jsx', 'utf8');
content = content.replace(
  'useEffect(() => {\n    startTelemetryPolling();\n  }, []);',
  '// eslint-disable-next-line react-hooks/exhaustive-deps\n  useEffect(() => {\n    startTelemetryPolling();\n  }, []);'
);
fs.writeFileSync('src/App.jsx', content);
