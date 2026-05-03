import ProtectedRoute from './components/ProtectedRoute';
import React, { useEffect, Suspense } from 'react';
import GlobalLoader from './components/GlobalLoader';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Footer from './components/Footer';
import GlobalTicker from './components/GlobalTicker';
import Header from './components/Header';
import SystemBreadcrumb from './components/SystemBreadcrumb';
import BackgroundEffects from './components/BackgroundEffects';
import PageTransition from './components/PageTransition';













import Chatbot from './components/Chatbot';
import ProactiveBanner from './components/ProactiveBanner';
import EngagementGuard from './components/EngagementGuard';
import { useAximStore } from './store/useAximStore';
import { logTelemetry } from './lib/telemetry';

const Home = React.lazy(() => import('./pages/Home'));
const Articles = React.lazy(() => import('./pages/Articles'));
const Tools = React.lazy(() => import('./pages/Tools'));
const Consultation = React.lazy(() => import('./pages/Consultation'));
const Partners = React.lazy(() => import('./pages/Partners'));
const EarlyAccess = React.lazy(() => import('./pages/EarlyAccess'));
const Profile = React.lazy(() => import('./pages/Profile'));
const Status = React.lazy(() => import('./pages/Status'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const NdaGeneratorLanding = React.lazy(() => import('./pages/tools/NdaGeneratorLanding'));
const NotFound = React.lazy(() => import('./pages/NotFound'));
const PayStubLanding = React.lazy(() => import('./pages/tools/PayStubLanding'));

function App() {
  const location = useLocation();
  const startTelemetryPolling = useAximStore((state) => state.startTelemetryPolling);

  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <div className="w-full flex flex-col min-h-screen selection:bg-axim-gold/30 selection:text-white bg-bg-void">
      <BackgroundEffects />
      <ProactiveBanner />
      <EngagementGuard />
      <Chatbot />
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
            <Route path="/consultation" element={<PageTransition><Consultation /></PageTransition>} />
            <Route path="/early-access" element={<PageTransition><EarlyAccess /></PageTransition>} />
            <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
            <Route path="/status" element={<PageTransition><Status /></PageTransition>} />
            <Route path="/dashboard" element={<ProtectedRoute><PageTransition><Dashboard /></PageTransition></ProtectedRoute>} />
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
