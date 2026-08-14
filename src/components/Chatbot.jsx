import React, { useEffect } from 'react';
import { useAximStore } from '../store/useAximStore';

export default function Chatbot() {
  const isWeb3Authenticated = useAximStore((state) => state.isWeb3Authenticated);

  useEffect(() => {
    window.chatbaseConfig = { chatbotId: "axim-dev-bot-placeholder" };
    const script = document.createElement("script");
    script.src = "https://www.chatbase.co/embed.min.js";
    script.id = "axim-dev-bot-placeholder";
    script.defer = true;
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
      delete window.chatbaseConfig;
    };
  }, []);

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
