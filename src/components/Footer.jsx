import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';
import { logTelemetry } from '../lib/telemetry';

import { useLocation } from 'react-router-dom';

export default function Footer() {

  const [clickCount, setClickCount] = React.useState(0);
  const [latencyMs, setLatencyMs] = React.useState(null);
  const [history, setHistory] = React.useState([20, 25, 22]);
  const [isOffline, setIsOffline] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;
    const measureLatency = async () => {
      const start = performance.now();
      try {
        const response = await fetch('/wp-json/wp/v2/posts?per_page=1');
        const end = performance.now();
        const delta = Math.round(end - start);

        if (!response.ok || response.status >= 500 || delta > 3000) {
          logTelemetry('edge_node_latency_warning', {
            id: crypto.randomUUID(),
            endpoint: 'wp_proxy_worker',
            measured_latency: delta,
            status: 'TIMEOUT_EXCEEDED'
          });
        }

        if (isMounted) {
          setLatencyMs(delta);
          setHistory(prev => {
            const newHistory = [...prev, delta];
            if (newHistory.length > 3) return newHistory.slice(-3);
            return newHistory;
          });
          setIsOffline(false);
        }
      } catch (err) {
        const end = performance.now();
        const delta = Math.round(end - start);
        logTelemetry('edge_node_latency_warning', {
          endpoint: 'wp_proxy_worker',
          measured_latency: delta,
          status: 'TIMEOUT_EXCEEDED'
        });
        if (isMounted) {
          setIsOffline(true);
        }
      }
    };

    measureLatency();
    const interval = setInterval(measureLatency, 45000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const generateGraphPath = () => {
    if (history.length === 0) return '';
    const max = Math.max(100, ...history);
    return history.map((val, i) => {
      let x = (i / Math.max(1, history.length - 1)) * 48;
      if (history.length === 1) x = 24;
      const y = 16 - (Math.min(val, max) / max) * 16;
      return `${x},${y}`;
    }).join(' ');
  };

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const isExternalTrackingActive = queryParams.has('via') || queryParams.has('utm_source');

  if (isExternalTrackingActive) return null;
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
         className="bg-[#050505] border-t border-white/10 pt-20 pb-10 relative z-10 overflow-hidden"
         onViewportEnter={() => {
           logTelemetry('footer_viewed', { path: location.pathname });
         }}
         viewport={{ once: true, amount: 0.2 }}
       >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(147,51,234,0.05),transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-6 group">
               <img
                 src="https://wp.axim.us.com/wp-content/uploads/2025/06/12.png"
                 alt="AXiM Systems"
                 className="h-8 w-auto object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                 loading="lazy"
                 width="120" height="32"
               />
            </Link>
            <p className="text-zinc-500 text-xs leading-relaxed mb-6 font-mono uppercase tracking-widest">
              Builders of a new era. Integrating decentralized energy, logical connectivity, and autonomous intelligence.
            </p>
            <div className="flex gap-4">
               <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-axim-purple transition-colors" onClick={() => logTelemetry('footer_social_click', { platform: 'twitter' })}>
                 <SafeIcon icon={LuIcons.LuTwitter} className="w-4 h-4" />
               </a>
               <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-axim-purple transition-colors" onClick={() => logTelemetry('footer_social_click', { platform: 'linkedin' })}>
                 <SafeIcon icon={LuIcons.LuLinkedin} className="w-4 h-4" />
               </a>
            </div>
          </div>

          {/* Partner Funnels */}
          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
              <SafeIcon icon={LuIcons.LuNetwork} className="w-4 h-4 text-axim-purple" /> Partner Grid
            </h4>
            <ul className="space-y-4">
              <li><Link to="/partners/make" className="text-zinc-400 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors">Make.com Automation</Link></li>
              <li><Link to="/partners/chatbase" className="text-zinc-400 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors">Chatbase AI</Link></li>
              <li><Link to="/partners/powur-solar" className="text-zinc-400 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors">Powur Solar</Link></li>
              <li><Link to="/partners" className="text-axim-purple hover:text-white text-xs font-bold uppercase tracking-wider transition-colors">View All Partners →</Link></li>
            </ul>
          </div>

          {/* Apps & Tools */}
          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
              <SafeIcon icon={LuIcons.LuWrench} className="w-4 h-4 text-[#DB2777]" /> Infrastructure
            </h4>
            <ul className="space-y-4">
              <li><a href="https://quickdemandletter.com/start?via=axim_hub" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1">Demand Letter Engine <SafeIcon icon={LuIcons.LuArrowUpRight} className="w-3 h-3"/></a></li>
              <li><Link to="/tools/nda-generator" className="text-zinc-400 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors">Mutual NDA Generator</Link></li>
              <li><Link to="/tools/pay-stub" className="text-zinc-400 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors">Pay Stub System</Link></li>
              <li><Link to="/tools" className="text-[#DB2777] hover:text-white text-xs font-bold uppercase tracking-wider transition-colors">View All Apps & Tools →</Link></li>
            </ul>
          </div>

          {/* Intelligence Hub */}
          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
              <SafeIcon icon={LuIcons.LuDatabase} className="w-4 h-4 text-axim-gold" /> Intelligence
            </h4>
            <ul className="space-y-4">
              <li><Link to="/articles" className="text-zinc-400 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors">Latest Articles</Link></li>
              <li><Link to="/support" className="text-zinc-400 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors">System Support Wiki</Link></li>
              <li><Link to="/consultation" className="text-zinc-400 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors">Book Consultation</Link></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-600 font-mono text-[0.6rem] uppercase tracking-widest">
            <span onClick={() => setClickCount(prev => prev + 1)} className="cursor-pointer">&copy; {currentYear} AXiM Systems. All rights reserved.</span>
          </p>
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-2 text-zinc-600 font-mono text-[0.6rem] uppercase tracking-widest">
               <span>LATENCY // {latencyMs ? `${latencyMs}ms` : 'CONNECTING...'}</span>
               <svg className="w-12 h-4" viewBox="0 0 48 16">
                 {isOffline ? (
                   <polyline points="0,8 24,8 48,8" fill="none" stroke="#f97316" strokeWidth="2" strokeDasharray="4 2" />
                 ) : (
                   <polyline points={generateGraphPath()} fill="none" stroke="#7D00FF" strokeWidth="1.5" />
                 )}
               </svg>
             </div>
             <Link to="/terms" className="text-zinc-600 hover:text-zinc-300 font-mono text-[0.6rem] uppercase tracking-widest transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
      {clickCount >= 5 && (
        <div className="fixed bottom-0 left-0 w-full p-4 bg-red-900 text-white font-mono text-xs z-[9999] overflow-auto max-h-64 border-t border-red-500">
          <strong>[ DIAGNOSTIC PAYLOAD ERROR ]</strong>
          <pre className="mt-2 whitespace-pre-wrap">
            {window.axim_debug_last_error ? JSON.stringify(window.axim_debug_last_error, null, 2) : "No error payloads found in window.axim_debug_last_error."}
          </pre>
        </div>
      )}
    </motion.footer>
  );
}
