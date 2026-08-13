import React, { useEffect, useState } from 'react';
import { logTelemetry } from '../lib/telemetry';
import { useAximStore } from '../store/useAximStore';
import DatabaseUplinkError from '../common/DatabaseUplinkError';

export default function Chatbot() {
  const [isFaulted, setIsFaulted] = useState(false);
  const { isWeb3Authenticated } = useAximStore();

  useEffect(() => {
    // Inject Chatbase script securely
    try {
      if (!window.chatbaseConfig) {
        window.chatbaseConfig = {
          chatbotId: "YOUR_CHATBASE_BOT_ID_HERE",
        };
      }
      if (!document.querySelector('script[src="https://www.chatbase.co/embed.min.js"]')) {
        const script = document.createElement('script');
        script.src = 'https://www.chatbase.co/embed.min.js';
        script.id = 'YOUR_CHATBASE_BOT_ID_HERE';
        script.async = true;
        script.defer = true;
        script.setAttribute('domain', 'www.chatbase.co');
        script.onerror = (err) => {
          logTelemetry('support_widget_ingress_failed', {
            source: 'chatbase_embed',
            reason: 'resource_load_fault',
            endpoint: script.src
          });
          logTelemetry('chatbot_403_suppressed');
          setIsFaulted(true);
        };
        document.body.appendChild(script);
      }
    } catch (e) {
      logTelemetry('chatbot_initialization_failed', { reason: '403 Forbidden / Configuration Issue' });
      logTelemetry('chatbot_403_suppressed');
    }

    const handleWidgetClick = (e) => {
      const target = e.target;
      if (target.closest && target.closest('#chatbase-bubble-button, .chatbase-bubble')) {
        logTelemetry('SUPPORT_INQUIRY_FIRED', { source: 'global_widget', context: 'widget_click' });
      }
    };

    const handleMessage = (event) => {
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
      }
    }, 6000);

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.addedNodes.length) {
          mutation.addedNodes.forEach(node => {
            if (node.id === 'chatbase-bubble-window' || node.id === 'chatbase-message-bubble') {
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
        <div className="fixed bottom-24 right-6 z-[100] inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 font-mono text-[8px] text-emerald-400 uppercase tracking-widest rounded-sm select-none pointer-events-none">
          <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
          [LLM_NODE: SECURE_INFERENCE_ACTIVE]
        </div>
      )}
    </>
  );
}
