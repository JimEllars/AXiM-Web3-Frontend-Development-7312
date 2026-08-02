import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { logTelemetry } from '../lib/telemetry';
import { generateCrossAppHandoffUrl } from '../lib/auth-handoff.js';
import { useAximAuth } from '../hooks/useAximAuth.js';
import { useAximStore } from '../store/useAximStore.js';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';
import SEO from '../components/SEO';

export default function Games() {
  const { session } = useAximAuth();
  const walletAddress = useAximStore((state) => state.walletAddress);
  const isWeb3Authenticated = useAximStore((state) => state.isWeb3Authenticated);
  const [isHandoffActive, setIsHandoffActive] = useState(false);

  const handleLaunchGame = (gameId, gameUrl) => {
    logTelemetry('game_launch_intent', { game: gameId });
    setIsHandoffActive(true);

    setTimeout(() => {
      setIsHandoffActive(false);
    }, 3000);

    const token = session?.access_token || walletAddress;
    const ssoUrl = generateCrossAppHandoffUrl(gameUrl, { token, walletAddress });
    window.open(ssoUrl, '_blank');
  };

  const gamesSchema = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "AXiM Daily Word Cipher",
      "applicationCategory": "GameApplication",
      "operatingSystem": "Web",
      "provider": { "@type": "Organization", "name": "AXiM Systems",
      "knowsAbout": [
        "Business Automation",
        "Make.com",
        "Integromat",
        "Workflow scaling",
        "Decentralized Energy",
        "Home Solar",
        "Powur Solar"
      ]
 }
    }
  ];

  return (
    <div className="w-full min-h-screen bg-bg-void relative z-10 pb-32">
      <SEO
        title="AXiM Games Hub | Web3 Interactive Directory"
        description="Access our suite of enterprise Web3 games and earn digital assets."
        customSchema={gamesSchema}
      />

      <motion.section
        className="pt-32 pb-16 relative overflow-hidden"
        onViewportEnter={() => {
          logTelemetry('games_directory_viewed', { isWeb3Authenticated });
        }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:40px_40px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-center">
          <div className="mb-12">
            <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-4 flex items-center justify-center gap-4">
              Web3 <span className="text-axim-green">Games Directory</span>
              {isHandoffActive && (
                 <span className="ml-3 inline-flex items-center gap-1.5 px-2.5 py-1 bg-axim-gold/10 border border-axim-gold/30 font-mono text-[8px] text-axim-gold uppercase tracking-widest rounded-sm select-none">
                   <span className="w-1 h-1 rounded-full bg-axim-gold animate-pulse" />
                   [SSO_TICKET: GENERATED // SECURE]
                 </span>
               )}
            </h1>
            <p className="text-zinc-400 max-w-2xl mx-auto text-sm leading-relaxed">
              Play native Web3 games integrated directly into the AXiM Ecosystem. Secure your score on-chain and earn digital assets.
            </p>
          </div>
        </div>
      </motion.section>

      <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-24 overflow-x-hidden md:overflow-visible">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true, margin: "-50px" }} className="h-full">
            <div className="group block h-full bg-[#050505] border border-white/10 p-8 rounded-sm transition-colors shadow-2xl relative overflow-hidden hover:border-axim-green/30">
              <div className="w-12 h-12 rounded flex items-center justify-center mb-6 shadow-lg group-hover:scale-105 transition-transform duration-500 bg-gradient-to-br from-axim-green to-emerald-600">
                <SafeIcon icon={LuIcons.LuGamepad2} className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-black text-white uppercase tracking-tight mb-2 flex items-center justify-between transition-colors group-hover:text-axim-green">
                Daily Word Cipher
              </h3>
              <p className="text-[0.65rem] font-mono text-zinc-500 uppercase tracking-widest leading-relaxed line-clamp-3 mb-6">
                Crack the daily cryptographic hash. Earn Cipher Keys.
              </p>

              <button
                onClick={() => handleLaunchGame('daily_word_cipher', 'https://axim.us.com/games/daily-word-cipher/')}
                className="relative z-10 inline-flex items-center px-6 py-3 font-black uppercase tracking-widest text-[0.65rem] transition-colors rounded-sm shadow-lg bg-axim-green text-black hover:bg-white hover:text-black w-full justify-center"
              >
                Play Now <SafeIcon icon={LuIcons.LuArrowUpRight} className="ml-2 w-3 h-3" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
