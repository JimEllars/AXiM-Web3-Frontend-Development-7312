sed -i 's|</motion.section>|</section>|' src/pages/AdminDashboard.jsx
sed -i 's|<section className="max-w-7xl mx-auto px-6 lg:px-8 mt-8">|<motion.section\n        className="max-w-7xl mx-auto px-6 lg:px-8 mt-8"\n        onViewportEnter={() => { logTelemetry('\''admin_dashboard_viewed'\'', { initialTab: activeTab }); }}\n        viewport={{ once: true, amount: 0.2 }}\n      >|' src/pages/AdminDashboard.jsx
sed -i 's|</section></div>|</div>|' src/pages/AdminDashboard.jsx
