import ProtectedRoute from './components/ProtectedRoute';
import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Footer from './components/Footer';
import GlobalTicker from './components/GlobalTicker';
import Header from './components/Header';
import BackgroundEffects from './components/BackgroundEffects';
import PageTransition from './components/PageTransition';
import Home from './pages/Home';
import Articles from './pages/Articles';
import Tools from './pages/Tools';
import Consultation from './pages/Consultation';
import Partners from './pages/Partners';
import EarlyAccess from './pages/EarlyAccess';
import Profile from './pages/Profile';
import Status from './pages/Status';
import Dashboard from './pages/Dashboard';

import Chatbot from './components/Chatbot';
import ProactiveBanner from './components/ProactiveBanner';
import { useAximStore } from './store/useAximStore';

function App() {
  const location = useLocation();
  const startTelemetryPolling = useAximStore((state) => state.startTelemetryPolling);

  useEffect(() => {
    startTelemetryPolling();
  }, [startTelemetryPolling]);

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
      <ProactiveBanner />
      <Chatbot />
      <Header />
      <main className="flex-grow pt-24 pb-20 relative z-10">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/articles" element={<PageTransition><Articles /></PageTransition>} />
            <Route path="/tools" element={<PageTransition><Tools /></PageTransition>} />
            <Route path="/partners" element={<PageTransition><Partners /></PageTransition>} />
            <Route path="/consultation" element={<PageTransition><Consultation /></PageTransition>} />
            <Route path="/early-access" element={<PageTransition><EarlyAccess /></PageTransition>} />
            <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
            <Route path="/status" element={<PageTransition><Status /></PageTransition>} />
            <Route path="/dashboard" element={<ProtectedRoute><PageTransition><Dashboard /></PageTransition></ProtectedRoute>} />

          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

export default App;
