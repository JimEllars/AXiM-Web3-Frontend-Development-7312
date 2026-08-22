import { useEffect } from 'react';
import { theme } from '../config/theme';

export default function Chatbot() {
  const botId = import.meta.env.VITE_CHATBASE_BOT_ID || theme?.chatbaseBotId;
  const isBotConfigured = botId && botId !== "987654321" && !botId.includes("placeholder");

  useEffect(() => {
    if (!isBotConfigured) return;

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
  }, [botId, isBotConfigured]);

  if (!isBotConfigured) return null;
  return null; // Chatbase injects its own floating bubble when configured
}
