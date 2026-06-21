import React, { useEffect } from 'react';
import { logTelemetry } from '../lib/telemetry';

export default function Chatbot() {
  useEffect(() => {
    // Attempt to track when the Chatbase widget is opened
    // The widget injects a button with id 'chatbase-bubble-button' or similar,
    // but the most reliable cross-platform way without exact DOM structure is
    // a global listener or polling if they don't provide an API callback.
    // However, clicking inside the chatbase-bubble wrapper can be tracked.
    const handleWidgetClick = (e) => {
      // Check if click was on the chatbase bubble
      const target = e.target;
      if (target.closest && target.closest('#chatbase-bubble-button, .chatbase-bubble')) {
        logTelemetry('AI_ASSISTANT_OPENED', { source: 'global_widget' });
      }
    };

    // Chatbase might use an iframe, so catching clicks on the iframe wrapper
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.addedNodes.length) {
          mutation.addedNodes.forEach(node => {
            if (node.id === 'chatbase-bubble-window' || node.id === 'chatbase-message-bubble') {
                // Widget opened
                logTelemetry('AI_ASSISTANT_OPENED', { source: 'global_widget_opened' });
            }
          });
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    document.addEventListener('click', handleWidgetClick, true);

    return () => {
      observer.disconnect();
      document.removeEventListener('click', handleWidgetClick, true);
    };
  }, []);

  return null; // Global script in index.html handles rendering
}
