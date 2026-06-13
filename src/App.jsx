import ProtectedRoute from './components/ProtectedRoute';
import React, { useEffect, Suspense, lazy } from 'react';
import GlobalLoader from './components/GlobalLoader';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Footer from './components/Footer';
import GlobalTicker from './components/GlobalTicker';
import Header from './components/Header';
import SystemBreadcrumb from './components/SystemBreadcrumb';
import BackgroundEffects from './components/BackgroundEffects';
import PageTransition from './components/PageTransition';
import CookieConsent from './components/CookieConsent';

import Chatbot from './components/Chatbot';
import { useAximStore } from './store/useAximStore';
import { logTelemetry } from './lib/telemetry';
import ScrollToTop from './components/ScrollToTop';


const Home = lazy(() => import('./pages/Home'));
const Articles = lazy(() => import('./pages/Articles'));
const Tools = lazy(() => import('./pages/Tools'));
const Consultation = lazy(() => import('./pages/Consultation'));
const Support = lazy(() => import('./pages/Support'));
const Partners = lazy(() => import('./pages/Partners'));
const EarlyAccess = lazy(() => import('./pages/EarlyAccess'));
const Profile = lazy(() => import('./pages/Profile'));
const AuthGateway = lazy(() => import('./pages/AuthGateway'));
const Status = lazy(() => import('./pages/Status'));
const NdaGeneratorLanding = lazy(() => import('./pages/tools/NdaGeneratorLanding'));
const Terms = lazy(() => import('./pages/Terms'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Article = lazy(() => import('./pages/Article'));
const PayStubLanding = lazy(() => import('./pages/tools/PayStubLanding'));
const MakeLanding = lazy(() => import('./pages/partners/MakeLanding'));
const PowurSolarLanding = lazy(() => import('./pages/partners/PowurSolarLanding'));
const PowurJoinLanding = lazy(() => import('./pages/partners/PowurJoinLanding'));
const ChatbaseLanding = lazy(() => import('./pages/partners/ChatbaseLanding'));



// --- NEW: Global Analytics Route Tracker ---
function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    if (typeof window.gtag === 'function') {
      window.gtag('config', 'G-620C96FBF3', {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);

  return null;
}

function App() {
  const location = useLocation();
  const startTelemetryPolling = useAximStore((state) => state.startTelemetryPolling);

  useEffect(() => {
    startTelemetryPolling();
  }, []);

  useEffect(() => {
    const clickRankAi = document.createElement("script");
    clickRankAi.src = "https://js.clickrank.ai/seo/a53a59e0-cc42-4ec5-995e-d44d7177f1b3/script?" + new Date().getTime();
    clickRankAi.async = true;
    logTelemetry("PAGE_VIEW", { path: location.pathname });

    document.head.appendChild(clickRankAi);

    return () => {
      if (document.head.contains(clickRankAi)) {
        document.head.removeChild(clickRankAi);
      }
    };
  }, [location.pathname]);

  return (
    <div className="w-full flex flex-col min-h-screen selection:bg-axim-gold/30 selection:text-white bg-bg-void overflow-x-hidden">
      <AnalyticsTracker />
      <BackgroundEffects />
      <CookieConsent />

      {/* CRITICAL FIX:
        <ProactiveBanner /> and <EngagementGuard /> have been PURGED from this global root.
        They must only load on page-level components to preserve the top-of-page visual hierarchy.
      */}

      <Chatbot />
      <ScrollToTop />
      <Header />
      <SystemBreadcrumb />
      <main className="flex-grow pt-8 pb-20 relative z-10">
        <AnimatePresence mode="wait">
          <Suspense fallback={<GlobalLoader />}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/articles" element={<PageTransition><Articles /></PageTransition>} />
            <Route path="/tools" element={<PageTransition><Tools /></PageTransition>} />
            <Route path="/tools/nda" element={<PageTransition><NdaGeneratorLanding /></PageTransition>} />
            <Route path="/tools/paystub" element={<PageTransition><PayStubLanding /></PageTransition>} />
            <Route path="/partners" element={<PageTransition><Partners /></PageTransition>} />
            <Route path="/partners/make" element={<PageTransition><MakeLanding /></PageTransition>} />
            <Route path="/partners/powur-solar" element={<PageTransition><PowurSolarLanding /></PageTransition>} />
            <Route path="/partners/powur-join" element={<PageTransition><PowurJoinLanding /></PageTransition>} />
            <Route path="/partners/chatbase" element={<PageTransition><ChatbaseLanding /></PageTransition>} />
            <Route path="/consultation" element={<PageTransition><Consultation /></PageTransition>} />
            <Route path="/support" element={<PageTransition><Support /></PageTransition>} />
            <Route path="/auth" element={<PageTransition><AuthGateway /></PageTransition>} />
            <Route path="/terms" element={<PageTransition><Terms /></PageTransition>} />
            <Route path="/early-access" element={<PageTransition><EarlyAccess /></PageTransition>} />
            <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
            <Route path="/status" element={<PageTransition><Status /></PageTransition>} />
            <Route path="/article/:slug" element={<PageTransition><Article /></PageTransition>} />
            <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
          </Routes>
          </Suspense>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

export default App;
