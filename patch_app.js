const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf-8');

const target = `  useEffect(() => {
    startTelemetryPolling();

  }, []);`;

const replacement = `  useEffect(() => {
    startTelemetryPolling();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);`;

code = code.replace(target, replacement);

fs.writeFileSync('src/App.jsx', code);
