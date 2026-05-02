import React, { useEffect } from 'react';
import { theme } from '../config/theme';

export default function Chatbot() {
  useEffect(() => {
    const CHATBOT_ID = theme.chatbaseBotId;
    if (!CHATBOT_ID || CHATBOT_ID.includes("placeholder") || CHATBOT_ID === "null" || CHATBOT_ID === "undefined") return;

    // Set the window property Chatbase requires
    window.chatbaseConfig = {
      chatbotId: CHATBOT_ID,
    };

    // Create and inject the script
    const script = document.createElement("script");
    script.src = "https://www.chatbase.co/embed.min.js";
    script.chatbotId = CHATBOT_ID;
    script.domain = "www.chatbase.co";
    script.defer = true;

    document.body.appendChild(script);

    return () => {
      // Cleanup if the component unmounts
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
      delete window.chatbaseConfig;
    };
  }, []);

  return null;
}
