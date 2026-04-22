import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAximAuth } from '../hooks/useAximAuth';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';

const { LuTerminal, LuX, LuMaximize2, LuMinimize2, LuSend } = LuIcons;

export default function AximTerminal() {
  const [logs, setLogs] = useState([
    { type: 'system', text: "> INITIALIZING_ONYX_BRIDGE..." },
    { type: 'system', text: "> UPLINK_ESTABLISHED: SECURE" },
    { type: 'system', text: "> AWAITING_COMMAND..." }
  ]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const { session } = useAximAuth();

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs, isOpen, isExpanded]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
        inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const command = input.trim();
    setLogs(prev => [...prev, { type: 'user', text: `> ${command}` }]);
    setInput('');
    setIsProcessing(true);

    try {
        const response = await fetch('https://api.axim.us.com/v1/functions/onyx-bridge', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(session?.access_token && { 'Authorization': `Bearer ${session.access_token}` })
            },
            body: JSON.stringify({ command })
        });

        if (response.ok) {
            const data = await response.json();
            const reply = data.reply || "COMMAND_PROCESSED_SUCCESSFULLY";
            setLogs(prev => [...prev, { type: 'onyx', text: reply }]);
        } else {
            setLogs(prev => [...prev, { type: 'error', text: "ERR: CONNECTION_REFUSED" }]);
        }
    } catch (err) {
        setLogs(prev => [...prev, { type: 'error', text: "ERR: UPLINK_FAILED" }]);
    } finally {
        setIsProcessing(false);
    }
  };

  return (
    <>
      {/* Collapsed Toggle Button */}
      {!isOpen && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 p-4 bg-black border border-axim-teal/30 rounded-sm shadow-[0_0_15px_rgba(58,170,116,0.1)] text-axim-teal hover:bg-white/5 transition-colors group flex items-center gap-3 font-mono text-xs uppercase tracking-widest"
        >
          <SafeIcon icon={LuTerminal} className="w-5 h-5 group-hover:text-white transition-colors" />
          <span className="hidden md:inline">Onyx Terminal</span>
        </motion.button>
      )}

      {/* Expanded Terminal Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`fixed bottom-6 right-6 z-50 flex flex-col bg-black/95 backdrop-blur-md border border-axim-teal/30 shadow-[0_0_30px_rgba(0,0,0,0.8)] overflow-hidden rounded-sm transition-all duration-300 ${isExpanded ? 'w-[800px] h-[600px] max-w-[95vw] max-h-[90vh]' : 'w-[400px] h-[450px] max-w-[90vw]'}`}
          >
            {/* Terminal Header */}
            <div className="flex items-center justify-between p-3 border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-axim-teal">
                    <SafeIcon icon={LuTerminal} className="w-3 h-3" />
                    ONYX_OS // {isExpanded ? 'FULL_SCREEN' : 'COMPACT'}
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => setIsExpanded(!isExpanded)} className="p-1 text-zinc-500 hover:text-white transition-colors">
                        <SafeIcon icon={isExpanded ? LuMinimize2 : LuMaximize2} className="w-3 h-3" />
                    </button>
                    <button onClick={() => setIsOpen(false)} className="p-1 text-zinc-500 hover:text-red-500 transition-colors">
                        <SafeIcon icon={LuX} className="w-3 h-3" />
                    </button>
                </div>
            </div>

            {/* Terminal Body */}
            <div
                ref={containerRef}
                className="flex-grow p-4 font-mono text-xs overflow-y-auto scrollbar-hide space-y-2"
                onClick={() => inputRef.current?.focus()}
            >
              {logs.map((log, i) => (
                <div key={i} className={`flex items-start gap-2 ${log.type === 'error' ? 'text-red-500' : log.type === 'user' ? 'text-zinc-300' : log.type === 'system' ? 'text-zinc-500' : 'text-axim-teal'}`}>
                  <span className="opacity-50 mt-0.5">[{new Date().toLocaleTimeString()}]</span>
                  <div className="flex-1 whitespace-pre-wrap">{log.text}</div>
                </div>
              ))}
              {isProcessing && (
                  <div className="flex items-start gap-2 text-axim-teal animate-pulse">
                      <span className="opacity-50 mt-0.5">[{new Date().toLocaleTimeString()}]</span>
                      <div>PROCESSING...</div>
                  </div>
              )}
            </div>

            {/* Terminal Input */}
            <form onSubmit={handleSubmit} className="border-t border-white/10 p-3 bg-black flex items-center gap-2">
                <span className="text-axim-teal font-mono text-xs">root@onyx:~#</span>
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-grow bg-transparent border-none outline-none font-mono text-xs text-zinc-300 placeholder-zinc-700"
                    placeholder="Enter command or natural language query..."
                    disabled={isProcessing}
                />
                <button type="submit" disabled={!input.trim() || isProcessing} className="p-1 text-zinc-500 hover:text-axim-teal disabled:opacity-50 transition-colors">
                    <SafeIcon icon={LuSend} className="w-4 h-4" />
                </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
