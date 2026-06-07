import re

with open('src/App.jsx', 'r') as f:
    content = f.read()

tracker_code = """

// --- NEW: Global Analytics Route Tracker ---
function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    if (typeof window.gtag === 'function') {
      window.gtag('config', 'G-620C96FBF3', {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);

  return null;
}

function App() {"""

content = content.replace("function App() {", tracker_code)

content = content.replace("<BackgroundEffects />", "<AnalyticsTracker />\n      <BackgroundEffects />")

with open('src/App.jsx', 'w') as f:
    f.write(content)
