const fs = require('fs');

let dashboardContent = fs.readFileSync('src/pages/Dashboard.jsx', 'utf8');

dashboardContent = dashboardContent.replace(
  /className="lg:col-span-2 p-6 bg-white\/5 backdrop-blur-xl border border-white\/10 rounded-sm"/g,
  `className="lg:col-span-2 p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-sm"`
);

// We need to check Recent Partner Inquiries and ensure it spans lg:col-span-3
dashboardContent = dashboardContent.replace(
  /className="lg:col-span-3 p-6 bg-white\/5 backdrop-blur-xl border border-white\/10 rounded-sm mt-8"/g,
  `className="lg:col-span-3 p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-sm mt-8"`
);

fs.writeFileSync('src/pages/Dashboard.jsx', dashboardContent);
