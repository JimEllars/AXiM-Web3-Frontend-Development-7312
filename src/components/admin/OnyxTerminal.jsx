import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LuTerminal, LuX, LuChevronUp, LuChevronDown, LuSend } from 'react-icons/lu';
import SafeIcon from '../../common/SafeIcon';
import { useAximStore } from '../../store/useAximStore';
import { useAximAuth } from '../../hooks/useAximAuth';

export default function OnyxTerminal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    { type: 'system', text: 'ONYX SWARM TERMINAL v3.0 // AWAITING COMMAND...' }
  ]);
  const [isConnecting, setIsConnecting] = useState(false);
  const terminalEndRef = useRef(null);
  const userSession = useAximStore((state) => state.userSession);
  const { session } = useAximAuth();

  const token = userSession?.session_token || session?.access_token;

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isConnecting) return;

    const command = input.trim();
    setInput('');
    setHistory(prev => [...prev, { type: 'user', text: `> ${command}` }]);
    setIsConnecting(true);

    try {
      const response = await fetch('https://api.axim.us.com/api/onyx-bridge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ command }),
      });

      if (!response.ok) {
        throw new Error(`Network error: ${response.status}`);
      }

      // Check if it's an SSE stream
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/event-stream')) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        let aiResponse = '';
        setHistory(prev => [...prev, { type: 'ai', text: '' }]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.token) {
                  aiResponse += data.token;
                  setHistory(prev => {
                    const newHistory = [...prev];
                    newHistory[newHistory.length - 1].text = aiResponse;
                    return newHistory;
                  });
                }
              } catch (e) {
                // Ignore parse errors on partial streams
              }
            }
          }
        }
      } else {
        // Fallback for normal JSON response
        const data = await response.json();
        setHistory(prev => [...prev, { type: 'ai', text: data.reply || 'Command executed.' }]);
      }
    } catch (err) {
      setHistory(prev => [...prev, { type: 'error', text: `[SYSTEM ERROR]: ${err.message}` }]);
    } finally {
      setIsConnecting(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-black/80 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-axim-teal hover:bg-axim-teal/20 transition-colors shadow-[0_0_20px_rgba(45,212,191,0.2)] z-50"
      >
        <SafeIcon icon={LuTerminal} className="w-6 h-6" />
      </button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`fixed right-6 bottom-6 w-[400px] bg-black/95 backdrop-blur-2xl border border-white/20 rounded-sm shadow-2xl z-50 flex flex-col ${isMinimized ? 'h-[50px]' : 'h-[500px]'}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-white/10 bg-white/5 cursor-pointer" onClick={() => setIsMinimized(!isMinimized)}>
        <div className="flex items-center gap-2">
          <SafeIcon icon={LuTerminal} className="w-4 h-4 text-axim-teal" />
          <span className="font-mono text-xs uppercase text-white tracking-widest font-bold">Onyx Command Terminal</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-zinc-500 hover:text-white transition-colors">
            <SafeIcon icon={isMinimized ? LuChevronUp : LuChevronDown} className="w-4 h-4" />
          </button>
          <button
            className="text-zinc-500 hover:text-red-500 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
          >
            <SafeIcon icon={LuX} className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Terminal Body */}
      {!isMinimized && (
        <>
          <div className="flex-grow p-4 overflow-y-auto font-mono text-xs custom-scrollbar space-y-2">
            {history.map((line, i) => (
              <div
                key={i}
                className={`
                  ${line.type === 'system' ? 'text-axim-gold opacity-80' : ''}
                  ${line.type === 'user' ? 'text-white font-bold' : ''}
                  ${line.type === 'ai' ? 'text-axim-teal' : ''}
                  ${line.type === 'error' ? 'text-red-500' : ''}
                  whitespace-pre-wrap break-words
                `}
              >
                {line.text}
              </div>
            ))}
            {isConnecting && (
              <div className="flex items-center gap-2 text-axim-teal/50">
                <div className="w-2 h-2 bg-axim-teal rounded-full animate-ping"></div>
                Processing...
              </div>
            )}
            <div ref={terminalEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 border-t border-white/10 bg-black">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <span className="text-axim-teal font-mono font-bold">{'>'}</span>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-grow bg-transparent border-none outline-none font-mono text-xs text-white placeholder:text-zinc-600"
                placeholder="Enter command..."
                disabled={isConnecting}
              />
              <button
                type="submit"
                disabled={isConnecting || !input.trim()}
                className="text-axim-teal hover:text-white disabled:opacity-50 transition-colors"
              >
                <SafeIcon icon={LuSend} className="w-4 h-4" />
              </button>
            </form>
          </div>
        </>
      )}
    </motion.div>
  );
}
