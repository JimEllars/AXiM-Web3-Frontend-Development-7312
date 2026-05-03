const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.jsx', 'utf-8');

const target = `  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchDashboardHistoricalData();
  }, []);`;

const replacement = `  useEffect(() => {
    fetchDashboardHistoricalData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);`;

code = code.replace(target, replacement);

fs.writeFileSync('src/pages/Dashboard.jsx', code);
