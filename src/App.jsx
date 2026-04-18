import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Web3Header from './components/Web3Header';
import BackgroundEffects from './components/BackgroundEffects';
import PageTransition from './components/PageTransition';
import Home from './pages/Home';
import Articles from './pages/Articles';
import Article from './pages/Article';
import Tools from './pages/Tools';
import Consultation from './pages/Consultation';
import EarlyAccess from './pages/EarlyAccess';
import Profile from './pages/Profile';
import PartnerPortal from './pages/PartnerPortal';
import Chatbot from './components/Chatbot';

function App() {
  const location = useLocation();

  useEffect(() => {
    const clickRankAi = document.createElement("script");
    clickRankAi.src = "https://js.clickrank.ai/seo/a53a59e0-cc42-4ec5-995e-d44d7177f1b3/script?" + new Date().getTime();
    clickRankAi.async = true;
    document.head.appendChild(clickRankAi);

    return () => {
      if (document.head.contains(clickRankAi)) {
        document.head.removeChild(clickRankAi);
      }
    };
  }, [location.pathname]);

  return (
    <div className="w-full flex flex-col min-h-screen selection:bg-axim-gold/30 selection:text-white bg-bg-void">
      <BackgroundEffects />
      <Chatbot />
      <Web3Header />
      <main className="flex-grow pt-24 pb-20 relative z-10">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/articles" element={<PageTransition><Articles /></PageTransition>} />
            <Route path="/article/:slug" element={<PageTransition><Article /></PageTransition>} />
            <Route path="/tools" element={<PageTransition><Tools /></PageTransition>} />
            <Route path="/consultation" element={<PageTransition><Consultation /></PageTransition>} />
            <Route path="/early-access" element={<PageTransition><EarlyAccess /></PageTransition>} />
            <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
            <Route path="/partners" element={<PageTransition><PartnerPortal /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </main>
      <footer className="py-12 border-t border-white/10 text-center font-mono text-[0.7rem] text-zinc-500 uppercase tracking-[0.2em] relative z-10 bg-[#050505]">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="text-left hidden md:block">
            REF: AXM_SYSTEMS_ROOT // V.1.0.9
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-axim-green rounded-full shadow-[0_0_8px_#3aaa74] animate-pulse"></div>
              <span className="text-white">SYSTEM_STATUS: OPERATIONAL</span>
            </div>
            <div className="opacity-50 text-[0.6rem]">
              &copy;{new Date().getFullYear()} AXiM Systems. Protocol Controlled.
            </div>
          </div>
          <div className="text-right hidden md:flex justify-end gap-6 opacity-50">
            <a href="#" className="hover:text-white transition-colors">Documentation</a>
            <a href="#" className="hover:text-white transition-colors">Governance</a>
            <a href="#" className="hover:text-white transition-colors">API</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;