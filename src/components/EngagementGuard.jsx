import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useScroll, useMotionValueEvent } from 'framer-motion';
import { logTelemetry, flushTelemetryQueue } from '../lib/telemetry';

export default function EngagementGuard() {
  const location = useLocation();
  const startTime = useRef(Date.now());
  const interactionTimer = useRef(null);

  // Local state flags for scroll depth to prevent rapid duplicate dispatches
  const [hasLogged25, setHasLogged25] = useState(false);
  const [hasLogged50, setHasLogged50] = useState(false);
  const [hasLogged75, setHasLogged75] = useState(false);
  const [hasLogged100, setHasLogged100] = useState(false);

  const { scrollYProgress } = useScroll();

  // Reset metrics on route change
  useEffect(() => {
    // Log dwell time for the previous route before resetting
    const dwellTime = Date.now() - startTime.current;
    if (dwellTime > 1000) { // Only log if dwell time > 1s
      logTelemetry('page_unload', {
        route: location.pathname,
        dwell_time_ms: dwellTime
      });
    }

    startTime.current = Date.now();
    logTelemetry('page_view', { route: location.pathname });

    setHasLogged25(false);
    setHasLogged50(false);
    setHasLogged75(false);
    setHasLogged100(false);

    // Attempt to flush queue on navigation
    flushTelemetryQueue();

    return () => {
      const finalDwellTime = Date.now() - startTime.current;
      logTelemetry('page_unload', {
        route: location.pathname,
        dwell_time_ms: finalDwellTime
      });
    };
  }, [location.pathname]);

  // Track scroll depth
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest >= 0.25 && !hasLogged25) {
      logTelemetry('scroll_depth', { route: location.pathname, depth: '25%' });
      setHasLogged25(true);
    }
    if (latest >= 0.50 && !hasLogged50) {
      logTelemetry('scroll_depth', { route: location.pathname, depth: '50%' });
      setHasLogged50(true);
    }
    if (latest >= 0.75 && !hasLogged75) {
      logTelemetry('scroll_depth', { route: location.pathname, depth: '75%' });
      setHasLogged75(true);
    }
    if (latest >= 0.95 && !hasLogged100) {
      logTelemetry('scroll_depth', { route: location.pathname, depth: '100%' });
      setHasLogged100(true);
    }
  });

  // Track interactions (heartbeat)
  useEffect(() => {
    const handleInteraction = () => {
      if (!interactionTimer.current) {
        logTelemetry('user_interaction_heartbeat', { route: location.pathname });
        // Throttle heartbeats to once every 30 seconds
        interactionTimer.current = setTimeout(() => {
          interactionTimer.current = null;
        }, 30000);
      }
    };

    window.addEventListener('click', handleInteraction, { passive: true });
    window.addEventListener('keydown', handleInteraction, { passive: true });
    window.addEventListener('scroll', handleInteraction, { passive: true });

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('scroll', handleInteraction);
      if (interactionTimer.current) clearTimeout(interactionTimer.current);
    };
  }, [location.pathname]);

  // Track tab visibility dwell time
  useEffect(() => {
    let hideTime = 0;
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        hideTime = Date.now();
        const dwellTime = hideTime - startTime.current;
        logTelemetry('tab_hidden', { route: location.pathname, session_dwell_ms: dwellTime });
      } else {
        if (hideTime > 0) {
           const awayTime = Date.now() - hideTime;
           logTelemetry('tab_visible', { route: location.pathname, away_time_ms: awayTime });
        }
      }
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);
    return () => window.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [location.pathname]);

  return null; // Zero re-render UI component
}
