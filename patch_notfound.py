import re

with open('src/pages/NotFound.jsx', 'r') as f:
    content = f.read()

content = content.replace(
    "import SEO from '../components/SEO';",
    "import SEO from '../components/SEO';\nimport { logTelemetry } from '../lib/telemetry';"
)

content = content.replace(
    """  useEffect(() => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "404_error", {
        event_category: "error",
        event_label: location.pathname + location.search
      });
    }
  }, [location]);""",
    """  useEffect(() => {
    logTelemetry('404_error_impression', { path: location.pathname + location.search });
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "404_error", {
        event_category: "error",
        event_label: location.pathname + location.search
      });
    }
  }, [location]);"""
)

content = content.replace(
    """  const trackRecovery = (label) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "recovery_click", {
        event_category: "engagement",
        event_label: label
      });
    }
  };""",
    """  const trackRecovery = (label) => {
    logTelemetry('404_recovery_clicked', { recoveryTarget: label, path: location.pathname });
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "recovery_click", {
        event_category: "engagement",
        event_label: label
      });
    }
  };"""
)

with open('src/pages/NotFound.jsx', 'w') as f:
    f.write(content)
