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
        logTelemetry('SUPPORT_INQUIRY_FIRED', { source: 'global_widget', context: 'widget_click' });
      }
    };

    // Chatbase might use an iframe, so catching clicks on the iframe wrapper

    const handleMessage = (event) => {
      // Look for message post events from Chatbase
      if (event.data && typeof event.data === 'string') {
        if (event.data === 'chatbase-widget-closed') {
          logTelemetry('SUPPORT_INQUIRY_FIRED', {
            platform: 'chatbase',
            queryCharCount: 0,
            event: 'widget_closed'
          });
        }

        try {
          const data = JSON.parse(event.data);
          // Only track when user sends message
          if (data && data.type === 'chatbase_message_sent') {
            logTelemetry('SUPPORT_INQUIRY_FIRED', {
               platform: 'chatbase',
               queryCharCount: data.message?.length || 0,
               source: 'chatbase_widget',
               messageLength: data.message?.length || 0
            });
          }
        } catch(e) { /* ignore parse error */ }
      } else if (event.data && typeof event.data === 'object') {
          // Alternatively if they send an object
          if (event.data.type === 'chatbase_message_sent' || event.data.event === 'chatbase_message_sent') {
             logTelemetry('SUPPORT_INQUIRY_FIRED', {
               platform: 'chatbase',
               queryCharCount: event.data.message?.length || 0,
               source: 'chatbase_widget',
               messageLength: event.data.message?.length || 0
            });
          }
      }
    };

    window.addEventListener('message', handleMessage);

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.addedNodes.length) {
          mutation.addedNodes.forEach(node => {
            if (node.id === 'chatbase-bubble-window' || node.id === 'chatbase-message-bubble') {
                // Widget opened
                logTelemetry('SUPPORT_INQUIRY_FIRED', { source: 'global_widget_opened', context: 'widget_rendered' });
            }
          });
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    document.addEventListener('click', handleWidgetClick, true);

    return () => {
      window.removeEventListener('message', handleMessage);
      observer.disconnect();
      document.removeEventListener('click', handleWidgetClick, true);
    };
  }, []);

  return null; // Global script in index.html handles rendering
}
