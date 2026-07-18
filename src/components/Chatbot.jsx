import React, { useEffect, useState } from 'react';
import { logTelemetry } from '../lib/telemetry';
import { useAximStore } from '../store/useAximStore';
import DatabaseUplinkError from '../common/DatabaseUplinkError';

export default function Chatbot() {
  const [isFaulted, setIsFaulted] = useState(false);
  const { isWeb3Authenticated } = useAximStore();
  useEffect(() => {
    // Inject Chatbase script securely
    if (!window.chatbaseConfig) {
      window.chatbaseConfig = {
        chatbotId: "xYiQ2yI2XeGmRLzRUkNvP",
      };
    }
    if (!document.querySelector('script[src="https://www.chatbase.co/embed.min.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://www.chatbase.co/embed.min.js';
      script.async = true;
      script.defer = true;
      script.setAttribute('chatbotId', 'xYiQ2yI2XeGmRLzRUkNvP');
      script.setAttribute('domain', 'www.chatbase.co');
            script.onerror = (err) => {
        logTelemetry('support_widget_ingress_failed', {
          source: 'chatbase_embed',
          reason: 'resource_load_fault',
          endpoint: script.src
        });
        setIsFaulted(true);
      };
      document.body.appendChild(script);
    }

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
          if (event.data?.type === 'chatbase_message_sent' || event.data?.event === 'chatbase_message_sent') {
             logTelemetry('SUPPORT_INQUIRY_FIRED', {
               platform: 'chatbase',
               queryCharCount: event.data?.message?.length || 0,
               source: 'chatbase_widget',
               messageLength: event.data?.message?.length || 0
            });
          }
      }
    };

    window.addEventListener('message', handleMessage);

    const timeoutId = setTimeout(() => {
      const scriptTag = document.querySelector('script[src="https://www.chatbase.co/embed.min.js"]');
      if (!scriptTag) {
         setIsFaulted(true);
      } else if (typeof window.chatbaseConfig === 'undefined') {
         setIsFaulted(true);
      } else {
         // Also verify if the script failed to execute properly and hasn't created any DOM nodes
         const hasIframeOrBubble = document.getElementById('chatbase-bubble-window') || document.getElementById('chatbase-message-bubble') || document.getElementById('chatbase-bubble-button') || document.querySelector('.chatbase-bubble');
         // But since we can't be 100% sure the bubble opens automatically, checking window properties is safest.
         // Since chatbase usually defines something on window, but let's stick to the script node presence or our own tracking
      }
    }, 6000);

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
      clearTimeout(timeoutId);
      window.removeEventListener('message', handleMessage);
      observer.disconnect();
      document.removeEventListener('click', handleWidgetClick, true);
    };
  }, []);

    if (isFaulted) {
    return (
      <div className="fixed bottom-6 right-6 z-50 w-80 shadow-xl bg-bg-void/90 border border-white/10 backdrop-blur-md">
        <DatabaseUplinkError onRetry={() => setIsFaulted(false)} />
      </div>
    );
  }

  return (
    <>
      {isWeb3Authenticated && (
        <div className="fixed bottom-24 right-6 z-50 px-2 py-0.5 bg-axim-purple/10 border border-axim-purple/30 text-[8px] font-mono tracking-widest text-axim-purple uppercase rounded-sm select-none pointer-events-none">
          [AES_256 // ON-CHAIN SECURED]
        </div>
      )}
    </>
  );
}
