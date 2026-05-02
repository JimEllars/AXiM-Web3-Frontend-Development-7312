import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LuTerminal, LuX, LuChevronUp, LuChevronDown, LuSend } from 'react-icons/lu';
import SafeIcon from '../../common/SafeIcon';
import { useAximStore } from '../../store/useAximStore';
import { useAximAuth } from '../../hooks/useAximAuth';
import { useOnyxStream } from '../../hooks/useOnyxStream';

export default function OnyxTerminal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    { type: 'system', text: 'ONYX SWARM TERMINAL v3.0 // AWAITING COMMAND...' }
  ]);

  const terminalEndRef = useRef(null);
  const { executeOnyxCommand, isStreaming } = useOnyxStream();
  const { wpDiagnosticError, nodeStatuses, historicalHealth } = useAximStore((state) => ({
    wpDiagnosticError: state.wpDiagnosticError,
    nodeStatuses: state.nodeStatuses,
    historicalHealth: state.historicalHealth
  }));


  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;

    const command = input.trim();

    // Inject system context
    const recentLatency = historicalHealth?.[0]?.latency || 'N/A';
    const wpStatus = wpDiagnosticError ? 'ERROR: ' + wpDiagnosticError : 'OK';
    const contextPrefix = `[SYSTEM CONTEXT: WP_STATUS: ${wpStatus}, RECENT_LATENCY: ${recentLatency}ms] USER PROMPT: `;
    const backendPayload = contextPrefix + command;
    setInput('');
    setHistory(prev => [...prev, { type: 'user', text: `> ${command}` }]);

    // Add an empty AI message that we will update
    setHistory(prev => [...prev, { type: 'ai', text: '' }]);

    const response = await executeOnyxCommand(backendPayload);

    if (response) {
      setHistory(prev => {
        const newHistory = [...prev];
        newHistory[newHistory.length - 1].text = response;
        return newHistory;
      });
    } else {
      setHistory(prev => {
        const newHistory = [...prev];
        // Replace empty AI message with error
        newHistory[newHistory.length - 1] = { type: 'error', text: `[SYSTEM ERROR]: Command failed` };
        return newHistory;
      });
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-black/80 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-axim-purple hover:bg-axim-purple/20 transition-colors shadow-[0_0_20px_125,0,255,0.2)] z-50"
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
          <SafeIcon icon={LuTerminal} className="w-4 h-4 text-axim-purple" />
          <span className="font-mono font-[Fira_Code,JetBrains_Mono,monospace] text-xs uppercase text-white tracking-widest font-bold">Onyx Command Terminal</span>
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
          <div className="flex-grow p-4 overflow-y-auto font-mono font-[Fira_Code,JetBrains_Mono,monospace] text-xs custom-scrollbar space-y-2">
            {history.map((line, i) => (
              <div
                key={i}
                className={`
                  ${line.type === 'system' ? 'text-axim-purple opacity-80' : ''}
                  ${line.type === 'user' ? 'text-white font-bold' : ''}
                  ${line.type === 'ai' ? 'text-axim-purple' : ''}
                  ${line.type === 'error' ? 'text-red-500' : ''}
                  whitespace-pre-wrap break-words
                `}
              >
                <div dangerouslySetInnerHTML={{ __html: line.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') }} />
              </div>
            ))}
            {isStreaming && (
              <div className="flex items-center gap-2 text-axim-purple/50">
                <div className="w-2 h-2 bg-axim-purple rounded-full animate-ping"></div>
                Processing...
              </div>
            )}
            <div ref={terminalEndRef} />
          </div>

          {/* Input Area */}

          {/* Quick Actions */}

          {/* Emergency Actions */}
          <div className="px-3 py-1 bg-black flex gap-2 border-t border-white/10">
            <span className="text-[0.6rem] text-red-500 font-mono font-bold uppercase tracking-widest my-auto mr-2">Emergency Actions:</span>
            <button
              onClick={(e) => {
                const cmd = '[SYSTEM OVERRIDE] Initiate edge cache purge and verify node routing.';
                setInput(cmd);
                // We use setTimeout to allow state update before trigger submit
                setTimeout(() => {
                  handleSubmit({ preventDefault: () => {} });
                }, 0);
              }}
              className="whitespace-nowrap px-2 py-1 bg-red-500/10 border border-red-500/50 text-red-400 hover:text-axim-gold hover:border-axim-gold text-[0.6rem] font-mono uppercase transition-colors rounded-sm shadow-[0_0_10px_rgba(239,68,68,0.2)]"
              disabled={isStreaming}
            >
              Purge Edge Cache
            </button>
          </div>
<div className="px-3 pb-2 pt-1 border-t border-white/10 bg-black flex gap-2 overflow-x-auto custom-scrollbar">
            <button
              onClick={() => setInput('Analyze Infrastructure')}
              className="whitespace-nowrap px-2 py-1 bg-white/5 border border-white/10 text-axim-purple text-[0.6rem] font-mono uppercase hover:bg-axim-purple/20 transition-colors rounded-sm"
              disabled={isStreaming}
            >
              Analyze Infrastructure
            </button>
            <button
              onClick={() => setInput('Run Security Audit')}
              className="whitespace-nowrap px-2 py-1 bg-white/5 border border-white/10 text-axim-purple text-[0.6rem] font-mono uppercase hover:bg-axim-purple/20 transition-colors rounded-sm"
              disabled={isStreaming}
            >
              Run Security Audit
            </button>
            <button
              onClick={() => setInput('Check PDF Generation Queue')}
              className="whitespace-nowrap px-2 py-1 bg-white/5 border border-white/10 text-axim-purple text-[0.6rem] font-mono uppercase hover:bg-axim-purple/20 transition-colors rounded-sm"
              disabled={isStreaming}
            >
              Check PDF Queue
            </button>
          </div>

          <div className="p-3 border-t border-white/10 bg-black">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <span className="text-axim-purple font-mono font-[Fira_Code,JetBrains_Mono,monospace] font-bold">{'>'}</span>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-grow bg-transparent border-none outline-none font-mono font-[Fira_Code,JetBrains_Mono,monospace] text-xs text-white placeholder:text-zinc-600"
                placeholder="Enter command..."
                disabled={isStreaming}
              />
              <button
                type="submit"
                disabled={isStreaming || !input.trim()}
                className="text-axim-purple hover:text-white disabled:opacity-50 transition-colors"
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
