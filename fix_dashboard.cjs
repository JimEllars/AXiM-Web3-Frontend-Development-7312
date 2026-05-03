const fs = require('fs');
let content = fs.readFileSync('src/pages/Dashboard.jsx', 'utf8');
content = content.replace(
  'useEffect(() => {\n    fetchDashboardHistoricalData();\n  }, [fetchDashboardHistoricalData]);',
  '// eslint-disable-next-line react-hooks/exhaustive-deps\n  useEffect(() => {\n    fetchDashboardHistoricalData();\n  }, []);'
);
fs.writeFileSync('src/pages/Dashboard.jsx', content);
