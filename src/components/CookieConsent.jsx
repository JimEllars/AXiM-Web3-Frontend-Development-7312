import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('axim_telemetry_consent');
    if (!consent) {
      setIsVisible(true);
    } else if (consent === 'granted') {
      // Re-apply granted state on sub-sequent page loads
      if (typeof window.gtag === 'function') {
        window.gtag('consent', 'update', {
          'analytics_storage': 'granted',
          'ad_storage': 'granted',
          'ad_user_data': 'granted',
          'ad_personalization': 'granted'
        });
      }
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('axim_telemetry_consent', 'granted');
    setIsVisible(false);

    // Live update the consent state to unlock Google Analytics
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        'analytics_storage': 'granted',
        'ad_storage': 'granted',
        'ad_user_data': 'granted',
        'ad_personalization': 'granted'
      });
    }
  };

  const handleDecline = () => {
    localStorage.setItem('axim_telemetry_consent', 'denied');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="fixed bottom-0 left-0 w-full z-[9999] bg-black/90 backdrop-blur-md border-t border-white/10 p-6 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <div className="flex-1 text-sm text-zinc-400">
            <p className="mb-2">
              <strong className="text-white uppercase tracking-wider text-xs">Telemetry & Cookies</strong>
            </p>
            <p>
              We use cookies and telemetry to analyze traffic, optimize performance, and improve your experience.
              By clicking "Authorize", you consent to our use of these technologies in accordance with our GDPR and CCPA compliance policies.
            </p>
          </div>
          <div className="flex gap-4 shrink-0">
            <button
              onClick={handleDecline}
              className="px-6 py-2 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white border border-white/10 hover:border-white/30 transition-colors"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="px-6 py-2 text-xs font-bold uppercase tracking-widest text-black bg-white hover:bg-axim-purple hover:text-white transition-colors shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_20px_rgba(147,51,234,0.5)]"
            >
              Authorize
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
