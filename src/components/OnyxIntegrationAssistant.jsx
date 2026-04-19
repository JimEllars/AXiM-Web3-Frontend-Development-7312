import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';

const { LuMessageSquare, LuX, LuSend, LuTerminal } = LuIcons;

export default function OnyxIntegrationAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello. I am Onyx. I can assist with integrating AXiM B2B API endpoints into your infrastructure. How can I help?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('https://api.axim.us.com/v1/functions/llm-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_CHATBASE_BOT_ID || ''}`
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'You are Onyx, a dedicated sales engineer and integration assistant for AXiM Systems. Your goal is to answer developer questions about our high-availability B2B API endpoints, such as document orchestration (Demand Letters, NDAs, Pay Stubs) and zero-trust fulfillment. Guide users towards technical integration and value realization.'
            },
            ...messages,
            userMessage
          ]
        })
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply || data.message || 'Error processing response.' }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'There was an error communicating with the edge bridge. Please try again later.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-axim-teal rounded-full flex items-center justify-center shadow-lg shadow-axim-teal/20 hover:bg-teal-400 transition-colors z-50 ${isOpen ? 'hidden' : ''}`}
      >
        <SafeIcon icon={LuMessageSquare} className="w-6 h-6 text-black" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 w-80 sm:w-96 bg-[#0a0a0a] border border-white/10 rounded-sm shadow-2xl z-50 overflow-hidden flex flex-col h-[500px]"
          >
            <div className="bg-white/5 border-b border-white/10 p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <SafeIcon icon={LuTerminal} className="w-4 h-4 text-axim-teal" />
                <span className="font-bold uppercase tracking-widest text-sm text-white">Ask Onyx</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                <SafeIcon icon={LuX} className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-sm text-sm font-mono ${
                    msg.role === 'user'
                      ? 'bg-axim-teal/10 border border-axim-teal/30 text-axim-teal'
                      : 'bg-white/5 border border-white/10 text-zinc-300'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] p-3 rounded-sm text-sm font-mono bg-white/5 border border-white/10 text-zinc-500 animate-pulse">
                    Onyx is thinking...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white/5 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about API integration..."
                  className="flex-1 bg-transparent border border-white/20 rounded-sm px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-axim-teal"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading}
                  className="px-4 bg-axim-teal text-black rounded-sm flex items-center justify-center hover:bg-teal-400 transition-colors disabled:opacity-50"
                >
                  <SafeIcon icon={LuSend} className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
