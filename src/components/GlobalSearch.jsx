import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as LuIcons from 'react-icons/lu';
import SafeIcon from '../common/SafeIcon';

const { LuSearch, LuX } = LuIcons;

const STATIC_ROUTES = [
  { title: "Home", path: "/" },
  { title: "Articles", path: "/articles" },
  { title: "Tools Hub", path: "/tools" },
  { title: "Consultation", path: "/consultation" },
  { title: "Early Access", path: "/early-access" },
  { title: "Partner Portal", path: "/partners" },
  { title: "System Status", path: "/status" },
  { title: "Dashboard", path: "/dashboard" },
  { title: "Profile", path: "/profile" },
  { title: "Demand Letter Generator", path: "/tools" },
  { title: "NDA Generator", path: "/tools" },
  { title: "Pay Stub Generator", path: "/tools" },
  { title: "Right to Privacy Letter", path: "/tools" },
  { title: "Credit Error Dispute", path: "/tools" }
];

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

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

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const matches = STATIC_ROUTES.filter(route =>
      route.title.toLowerCase().includes(lowerQuery) || route.path.toLowerCase().includes(lowerQuery)
    );
    setResults(matches);
  }, [query]);

  const closeModal = () => {
    setIsOpen(false);
    setQuery('');
    setResults([]);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-sm hover:bg-white/10 hover:border-axim-teal/30 transition-all text-zinc-400 group"
      >
        <SafeIcon icon={LuSearch} className="w-3.5 h-3.5 group-hover:text-axim-teal transition-colors" />
        <span className="text-[0.65rem] font-mono uppercase tracking-widest">Search</span>
        <div className="flex gap-1 ml-4">
          <span className="px-1.5 py-0.5 bg-black/40 border border-white/5 rounded text-[0.55rem] font-mono">⌘</span>
          <span className="px-1.5 py-0.5 bg-black/40 border border-white/5 rounded text-[0.55rem] font-mono">K</span>
        </div>
      </button>

      {/* Mobile Icon */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden p-2 text-white border border-white/10 bg-white/5 rounded-sm hover:text-axim-teal transition-colors"
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
              className="fixed top-20 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl bg-bg-void border border-axim-teal/20 shadow-[0_0_50px_rgba(58,170,116,0.05)] z-[101] overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-axim-teal to-transparent opacity-50" />

              <form onSubmit={(e) => e.preventDefault()} className="relative border-b border-white/10 p-4 flex items-center gap-4 bg-white/5">
                <SafeIcon icon={LuSearch} className="w-6 h-6 text-axim-teal" />
                <input
                  autoFocus
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search AXiM Hub..."
                  className="flex-grow bg-transparent border-none text-white text-lg focus:outline-none focus:ring-0 placeholder-zinc-600 font-mono"
                />
                <button type="button" onClick={closeModal} className="p-1 text-zinc-500 hover:text-white transition-colors">
                  <SafeIcon icon={LuX} className="w-5 h-5" />
                </button>
              </form>

              <div className="p-6 min-h-[150px] max-h-[60vh] overflow-y-auto">
                {query.trim() && results.length > 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-2"
                  >
                    <h4 className="text-[0.65rem] font-mono text-zinc-500 uppercase tracking-widest mb-2 border-b border-white/10 pb-1">Pages & Tools</h4>
                    {results.map((route, i) => (
                      <Link
                        key={i}
                        to={route.path}
                        onClick={closeModal}
                        className="block p-3 bg-white/5 border border-white/10 hover:border-axim-teal/50 hover:bg-white/10 transition-colors text-sm text-white font-bold no-underline flex items-center gap-2"
                      >
                        {route.title}
                      </Link>
                    ))}
                  </motion.div>
                ) : query.trim() ? (
                  <div className="text-center text-zinc-600 font-mono text-xs uppercase flex flex-col items-center justify-center h-full gap-2 py-8">
                    <span>No matching pages found</span>
                  </div>
                ) : (
                  <div className="text-center text-zinc-600 font-mono text-xs uppercase flex flex-col items-center justify-center h-full gap-2">
                    <SafeIcon icon={LuSearch} className="w-6 h-6 opacity-50" />
                    <span>Search for tools, documents, and resources</span>
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
