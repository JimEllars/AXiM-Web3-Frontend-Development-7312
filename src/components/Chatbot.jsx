import { useEffect } from 'react';
import { theme } from '../config/theme';

export default function Chatbot() {
  const botId = theme?.chatbaseBotId || import.meta.env.VITE_CHATBASE_BOT_ID;

  useEffect(() => {
    if (!botId) return;

    window.chatbaseConfig = {
      chatbotId: botId,
    };

    const script = document.createElement('script');
    script.src = "https://www.chatbase.co/embed.min.js";
    script.id = botId;
    script.domain = "www.chatbase.co";
    script.defer = true;

    document.body.appendChild(script);

    return () => {
      // Clean up script on unmount if needed
      const existingScript = document.getElementById(botId);
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
      // Also attempt to remove the embedded iframe/container chatbase creates
      const chatbaseContainer = document.getElementById('chatbase-bubble');
      if (chatbaseContainer) {
          chatbaseContainer.remove();
      }
    };
  }, [botId]);


  // The Chatbase script handles its own UI injection, but we can add a connection badge
  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 px-3 py-1 bg-black/80 backdrop-blur-md border border-white/10 rounded-full shadow-lg pointer-events-none">
      <div className="w-2 h-2 rounded-full bg-axim-green animate-pulse" />
      <span className="text-[0.65rem] font-mono text-zinc-400 uppercase tracking-widest">Onyx Edge Connected</span>
    </div>
  );

}
