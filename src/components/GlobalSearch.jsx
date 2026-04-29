import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import DOMPurify from 'isomorphic-dompurify';

import * as LuIcons from 'react-icons/lu';
import SafeIcon from '../common/SafeIcon';

const { LuSearch, LuX } = LuIcons;

const STATIC_ROUTES = [
  { title: "Dashboard", path: "/dashboard", category: "Command Center" },
  { title: "System Status", path: "/status", category: "Command Center" },
  { title: "Intelligence Hub", path: "/articles", category: "Command Center" },

  { title: "Tools (The Machine Shop)", path: "/tools", category: "Machine Shop" },
  { title: "Launch NDA Generator", path: "/tools/nda", category: "Machine Shop" },
  { title: "Demand Letter Generator", path: "/tools", category: "Machine Shop" },
  { title: "Pay Stub Generator", path: "/tools/paystub", category: "Machine Shop" },

  { title: "Operator Vault", path: "/profile", category: "Operator Vault" },
  { title: "Asset Licenses", path: "/profile", category: "Operator Vault" },
  { title: "Security Settings", path: "/profile", category: "Operator Vault" }
];

export default function GlobalSearch() {
  const navigate = useNavigate();
  const [isSynchronizing, setIsSynchronizing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const [articleResults, setArticleResults] = useState([]);
  const [isSearchingArticles, setIsSearchingArticles] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);


  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isOpen) {
        const totalResults = results.length + articleResults.length;
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % (totalResults || 1));
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + (totalResults || 1)) % (totalResults || 1));
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (totalResults > 0) {
            let selectedItem;
            if (selectedIndex < results.length) {
              selectedItem = results[selectedIndex];
            } else {
              selectedItem = articleResults[selectedIndex - results.length];
            }
            if (selectedItem) {
              handleSelect(selectedItem);
            }
          }
        }
      }
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
  }, [isOpen, results, articleResults, selectedIndex, navigate]);


  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setArticleResults([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const matches = STATIC_ROUTES.filter(route =>
      route.title.toLowerCase().includes(lowerQuery) || route.path.toLowerCase().includes(lowerQuery)
    );
    setResults(matches); setSelectedIndex(0);

    if (query.trim().length > 2) {
      setIsSearchingArticles(true);
      const timer = setTimeout(async () => {
        try {
          const res = await fetch(`https://wp.axim.us.com/wp-json/wp/v2/posts?search=${encodeURIComponent(query)}&per_page=5`);
          if (res.ok) {
            const data = await res.json();
            setArticleResults(data); setSelectedIndex(0);
          } else {
            setArticleResults([]);
          }
        } catch (error) {
          setArticleResults([]);
        } finally {
          setIsSearchingArticles(false);
        }
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setArticleResults([]);
    }
  }, [query]);



  const handleSelect = (item) => {
    setIsSynchronizing(true);
    setTimeout(() => {
      if (item.path) {
        navigate(item.path);
      } else if (item.slug) {
        window.open(`https://wp.axim.us.com/article/${item.slug}`, '_blank');
      }
      closeModal();
      setIsSynchronizing(false);
    }, 300);
  };

  const closeModal = () => {
    setIsOpen(false);
    setQuery('');
    setResults([]);
    setArticleResults([]);
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
              className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100]"
              onClick={closeModal}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl bg-black/80 backdrop-blur-xl border border-white/10 shadow-[0_0_50px_rgba(45,212,191,0.05)] z-[101] overflow-hidden"
            >
              <form onSubmit={(e) => e.preventDefault()} className="relative border-b border-white/10 p-4 flex items-center gap-4 bg-white/5">
                <SafeIcon icon={LuSearch} className="w-6 h-6 text-axim-teal" />
                <input
                  autoFocus
                  type="text"
                  value={isSynchronizing ? "Synchronizing..." : query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search AXiM Omnibar..."
                  disabled={isSynchronizing}
                  className="flex-grow bg-transparent border-none text-white text-lg focus:outline-none focus:ring-0 placeholder-zinc-500 font-mono focus:shadow-[0_0_15px_rgba(45,212,191,0.2)] rounded-sm px-2 transition-shadow disabled:opacity-50"
                />
                <button type="button" onClick={closeModal} className="p-1 text-zinc-500 hover:text-white transition-colors">
                  <SafeIcon icon={LuX} className="w-5 h-5" />
                </button>
              </form>

              <div className="p-6 min-h-[150px] max-h-[60vh] overflow-y-auto">
                {query.trim() && (results.length > 0 || articleResults.length > 0) ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    {results.length > 0 && (
                      <div>
                        {['Command Center', 'Machine Shop', 'Operator Vault'].map(category => {
                          const categoryResults = results.filter(r => r.category === category);
                          if (categoryResults.length === 0) return null;
                          return (
                            <div key={category} className="mb-4">
                              <h4 className="text-[0.65rem] font-mono text-axim-teal uppercase tracking-widest mb-2 border-b border-white/10 pb-1">{category}</h4>
                              <div className="space-y-2">
                                {categoryResults.map((route) => {
                                  const globalIndex = results.indexOf(route);
                                  const isSelected = selectedIndex === globalIndex;
                                  return (
                                    <button
                                      key={globalIndex}
                                      onClick={(e) => { e.preventDefault(); handleSelect(route); }}
                                      className={`w-full text-left block p-3 border ${isSelected ? 'border-axim-teal bg-axim-teal/10 shadow-[0_0_10px_rgba(45,212,191,0.2)]' : 'border-white/10 bg-white/5'} hover:border-axim-teal/50 hover:bg-white/10 transition-colors text-sm text-white font-bold no-underline flex items-center gap-2`}
                                    >
                                      {route.title}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {(articleResults.length > 0 || isSearchingArticles) && (
                      <div>
                        <h4 className="text-[0.65rem] font-mono text-axim-teal uppercase tracking-widest mb-2 border-b border-white/10 pb-1 flex items-center justify-between">
                          <span>Intel Search</span>
                          {isSearchingArticles && <span className="text-axim-teal text-[0.55rem] animate-pulse">Searching...</span>}
                        </h4>
                        <div className="space-y-2">
                          {articleResults.map((post, idx) => {
                            const globalIndex = results.length + idx;
                            const isSelected = selectedIndex === globalIndex;
                            return (
                              <button
                                key={post.id}
                                onClick={(e) => { e.preventDefault(); handleSelect(post); }}
                                className={`w-full text-left block p-3 border ${isSelected ? 'border-axim-teal bg-axim-teal/10 shadow-[0_0_10px_rgba(45,212,191,0.2)]' : 'border-white/10 bg-white/5'} hover:border-axim-teal/50 hover:bg-white/10 transition-colors text-sm text-white font-bold no-underline`}
                                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.title.rendered) }}
                              />
                            );
                          })}
                        </div>
                      </div>
                    )}
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
