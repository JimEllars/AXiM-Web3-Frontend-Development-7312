import { useEffect } from 'react';
import { theme } from '../config/theme';

export default function Chatbot() {
  const botId = import.meta.env.VITE_CHATBASE_BOT_ID || theme?.chatbaseBotId;
  const isBotConfigured = botId && botId !== "987654321" && !botId.includes("placeholder");

  useEffect(() => {
    if (!isBotConfigured) return;

    try {
      window.chatbaseConfig = {
        chatbotId: botId,
      };

      const script = document.createElement('script');
      script.src = "https://www.chatbase.co/embed.min.js";
      script.id = botId;
      script.domain = "www.chatbase.co";
      script.defer = true;
      script.async = true; // Ensure asynchronous non-blocking load

      document.body.appendChild(script);

      return () => {
        try {
          const existingScript = document.getElementById(botId);
          if (existingScript) {
            document.body.removeChild(existingScript);
          }
          const chatbaseContainer = document.getElementById('chatbase-bubble');
          if (chatbaseContainer) {
              chatbaseContainer.remove();
          }
        } catch (e) {
          console.warn('Failed to cleanup Chatbase component', e);
        }
      };
    } catch (e) {
      console.warn('Chatbase failed to load, non-blocking error handled', e);
    }
  }, [botId, isBotConfigured]);

  return null;
}
