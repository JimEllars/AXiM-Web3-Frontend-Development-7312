import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as LuIcons from 'react-icons/lu';
import SafeIcon from '../common/SafeIcon';

const { LuSearch, LuX, LuSparkles, LuBrainCircuit } = LuIcons;

export default function OnyxSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setResults(null);

    try {
      const response = await fetch('https://api.axim.us.com/v1/functions/match_ai_interactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (response.ok) {
        const data = await response.json();
        // Assuming API returns { summary: "..." } or similar
        setResults(data.summary || data.answer || "No relevant intel found for this query.");
      } else {
        setResults("Error processing query via Onyx Intelligence Network.");
      }
    } catch (err) {
      setResults("Connection failed. Onyx uplink is offline.");
    } finally {
      setIsSearching(false);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setQuery('');
    setResults(null);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-sm hover:bg-white/10 hover:border-axim-gold/30 transition-all text-zinc-400 group"
      >
        <SafeIcon icon={LuSearch} className="w-3.5 h-3.5 group-hover:text-axim-gold transition-colors" />
        <span className="text-[0.65rem] font-mono uppercase tracking-widest">Onyx Search</span>
        <div className="flex gap-1 ml-4">
          <span className="px-1.5 py-0.5 bg-black/40 border border-white/5 rounded text-[0.55rem] font-mono">⌘</span>
          <span className="px-1.5 py-0.5 bg-black/40 border border-white/5 rounded text-[0.55rem] font-mono">K</span>
        </div>
      </button>

      {/* Mobile Icon */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden p-2 text-white border border-white/10 bg-white/5 rounded-sm hover:text-axim-gold transition-colors"
      >
        <SafeIcon icon={LuSearch} className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
              onClick={closeModal}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl bg-bg-void border border-axim-gold/20 shadow-[0_0_50px_rgba(255,234,0,0.05)] z-[101] overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-axim-gold to-transparent opacity-50" />

              <form onSubmit={handleSearch} className="relative border-b border-white/10 p-4 flex items-center gap-4 bg-white/5">
                <SafeIcon icon={LuBrainCircuit} className="w-6 h-6 text-axim-gold animate-pulse" />
                <input
                  autoFocus
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask Onyx Global Intelligence..."
                  className="flex-grow bg-transparent border-none text-white text-lg focus:outline-none focus:ring-0 placeholder-zinc-600 font-mono"
                />
                <button type="button" onClick={closeModal} className="p-1 text-zinc-500 hover:text-white transition-colors">
                  <SafeIcon icon={LuX} className="w-5 h-5" />
                </button>
              </form>

              <div className="p-6 min-h-[150px] max-h-[60vh] overflow-y-auto">
                {isSearching ? (
                  <div className="flex flex-col items-center justify-center h-full gap-4 text-axim-gold opacity-70">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-axim-gold rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-axim-gold rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-axim-gold rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-xs font-mono uppercase tracking-widest">Querying Vector Network...</span>
                  </div>
                ) : results ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="prose prose-invert prose-p:text-sm prose-p:leading-relaxed prose-a:text-axim-gold max-w-none"
                  >
                    <div className="flex items-start gap-3 bg-axim-gold/5 border border-axim-gold/10 p-4 rounded-sm">
                       <SafeIcon icon={LuSparkles} className="w-5 h-5 text-axim-gold mt-0.5 flex-shrink-0" />
                       <div className="text-sm font-mono text-zinc-300 whitespace-pre-wrap leading-relaxed">
                         {results}
                       </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="text-center text-zinc-600 font-mono text-xs uppercase flex flex-col items-center justify-center h-full gap-2">
                    <SafeIcon icon={LuSearch} className="w-6 h-6 opacity-50" />
                    <span>Type to search technical docs & insights</span>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
