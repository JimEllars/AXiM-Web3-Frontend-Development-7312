import React, { useEffect } from 'react';
import { theme } from '../config/theme';

export default function Chatbot() {
  useEffect(() => {
    if (!theme.chatbaseBotId || theme.chatbaseBotId === "placeholder-bot-id") return;

    // Set the window property Chatbase requires
    window.chatbaseConfig = {
      chatbotId: theme.chatbaseBotId,
    };

    // Create and inject the script
    const script = document.createElement("script");
    script.src = "https://www.chatbase.co/embed.min.js";
    script.chatbotId = theme.chatbaseBotId;
    script.domain = "www.chatbase.co";
    script.defer = true;

    document.head.appendChild(script);

    return () => {
      // Cleanup if the component unmounts
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
      delete window.chatbaseConfig;
    };
  }, []);

  return null;
}
