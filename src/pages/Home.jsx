import { Link } from "react-router-dom";
import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import ArticleCard from '../components/ArticleCard';
import { fetchPosts } from '../lib/wp-fetch';
import Hero from '../components/Hero';
import Reviews from '../components/Reviews';
import FeaturedArticles from '../components/FeaturedArticles';
import NewsFeed from '../components/NewsFeed';
import Ecosystem from '../components/Ecosystem';
import SEO from '../components/SEO';
import PartnerPromo from '../components/PartnerPromo';
import EngagementGuard from '../components/EngagementGuard';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';
import { logTelemetry } from '../lib/telemetry';

export default function Home() {
  const [dailyNews, setDailyNews] = useState([]);
  const [dailyNewsCategoryId, setDailyNewsCategoryId] = useState(null);
  const [isNewsLoading, setIsNewsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  const handleRetryFetch = () => setRetryCount(prev => prev + 1);

  useEffect(() => {
    let isMounted = true;
    const fetchDailyNews = async () => {
      try {
        if (isMounted) setDailyNewsCategoryId(707); // Step 1: Force Category ID

        const data = await fetchPosts({ categorySlug: 'daily-news', limit: 3 });
        if (isMounted) {
          setDailyNews(data || []);
          if (import.meta.env.DEV) {
            console.log('[WP_DEBUG] Raw Daily News Payload:', data);
          }
        }
      } catch (err) {
        console.error("Failed to load daily news", err);
      } finally {
        if (isMounted) setIsNewsLoading(false);
      }
    };
    fetchDailyNews();
    return () => { isMounted = false; };
  }, []);

  // Isolate arrays dynamically to ensure strict bleed prevention
  const excludeDailyNewsIds = dailyNews.map(dn => dn.id);
  const strictCategoryExclusions = dailyNewsCategoryId ? [dailyNewsCategoryId] : [];

  const homeSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "AXiM Systems",
    "url": "https://axim.us.com/",
    "description": "Articles, AXiM Apps & Tools, & Learning Systems for enterprise operations.",
    "publisher": {
      "@type": "Organization",
      "name": "AXiM Systems",
      "logo": {
        "@type": "ImageObject",
        "url": "https://wp.axim.us.com/wp-content/uploads/2025/06/12.png"
      }
    }
  };

  return (
    <div className="w-full min-h-screen bg-bg-void relative overflow-x-hidden selection:bg-axim-purple selection:text-white">
      <SEO
        title="AXiM Hub | Enterprise Web3 Infrastructure"
        description="AXiM Systems provides enterprise Web3 infrastructure, powerful decentralized tools, and critical intelligence to scale your operations securely."
        image="https://axim-web3.com/og-home.jpg"
        customSchema={[homeSchema]}
      />
      <div className="w-full">
        <Hero />

        {/* 1. Daily News Feed */}
        <section className="py-16 relative overflow-hidden bg-bg-void">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
              <div className="flex items-center gap-3 mb-10 border-b border-white/10 pb-4">
                <SafeIcon icon={LuIcons.LuNewspaper} className="w-6 h-6 text-axim-purple" />
                <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Daily News</h2>
              </div>
              <div className="flex flex-col gap-6">
                {isNewsLoading ? (
                  [1,2,3].map(i => <div key={i} className="min-h-[300px] bg-[#050505] border border-white/5 rounded-sm animate-pulse" />)
                ) : dailyNews.length === 0 ? (
                  <div className="col-span-1 md:col-span-3 bg-[#050505] border border-white/5 p-8 text-center text-zinc-500 font-mono text-xs uppercase tracking-widest">[ INTELLIGENCE FEED SYNCHRONIZING WITH EDGE NODE ]
                    <button onClick={handleRetryFetch} className="mt-4 px-4 py-1 text-xs border border-onyx-600 text-onyx-400 hover:text-white transition-colors block mx-auto">Retry Connection</button></div>
                ) : (
                  dailyNews.map((post) => <ArticleCard article={post} key={post.id} variant="row" />)
                )}
              </div>
            </div>
          </section>


        {/* 3. Partner Break: Make */}
        <PartnerPromo
          partnerName="Make.com"
          title="Scale Your Systems With Visual Automation"
          description="Connect your apps and automate your workflows without writing a single line of code. Leverage the backend engine that powers AXiM."
          learnMorePath="/partners/make"
          startNowUrl="/partners/make"
          theme="purple"
          onClick={() => logTelemetry('partner_click', { partner: 'make', zone: 'homepage_promo' })}
        />

        {/* 4. Spotlight Category (Strictly Isolated) */}
        <motion.div initial={{opacity: 0, y: 20}} whileInView={{opacity: 1, y: 0}} viewport={{once: true}} transition={{duration: 0.5}} className="py-24 relative z-10 w-full">
          <FeaturedArticles
            title="Software Spotlight"
            categorySlug="software-spotlight"
            limit={6}
            excludeIds={excludeDailyNewsIds}
            excludeCategories={strictCategoryExclusions}
          />
        </motion.div>

        {/* 5. Partner Break: Powur */}
        <PartnerPromo
          partnerName="Powur Solar"
          title="Decentralize Your Home's Energy Grid"
          description="Stop overpaying for grid power. Transition to clean, Tier-1 residential solar with zero-down financing and take ownership of your energy production."
          learnMorePath="/partners/powur-solar"
          startNowUrl="/partners/powur-solar"
          theme="gold"
          onClick={() => logTelemetry('partner_click', { partner: 'powur_solar', zone: 'homepage_promo' })}
        />

        {/* 6. Featured Application Spotlight */}
        <section className="py-24 relative overflow-hidden bg-[#0F172A] border-y border-white/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,234,0,0.05),transparent_50%)] pointer-events-none" />
          <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-axim-gold/10 border border-axim-gold/30 text-[0.65rem] font-mono uppercase tracking-widest text-axim-gold mb-6 rounded-sm">
                <SafeIcon icon={LuIcons.LuSparkles} className="w-3 h-3" />
                <span>Featured Application</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-6 leading-tight">
                Quick Demand <br/><span className="text-axim-gold">Letter Engine.</span>
              </h2>
              <p className="text-zinc-400 text-base leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
                Skip the legal retainer. Generate a structurally optimized, formal demand letter in seconds using our autonomous legal intake AI. Perfect for freelance disputes, property damage, and breach of contract.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                 <Link to="/tools" className="inline-flex items-center justify-center px-8 py-4 bg-axim-gold text-black font-black uppercase tracking-widest text-xs hover:bg-white transition-colors shadow-[0_0_20px_rgba(255,234,0,0.2)] rounded-sm">
                    Generate Letter - $4.00 <SafeIcon icon={LuIcons.LuArrowRight} className="ml-2 w-4 h-4" />
                 </Link>
              </div>
            </div>
            <div className="flex-1 w-full flex justify-center lg:justify-end">
               <div className="w-full max-w-md bg-black border border-white/10 rounded-xl p-8 shadow-2xl relative overflow-hidden group hover:border-axim-gold/30 transition-colors">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-axim-gold/10 blur-[50px] pointer-events-none group-hover:bg-axim-gold/20 transition-colors" />
                  <SafeIcon icon={LuIcons.LuScale} className="w-10 h-10 text-axim-gold mb-8 relative z-10" />
                  <div className="space-y-4 font-mono text-xs text-zinc-400 relative z-10">
                     <div className="flex justify-between border-b border-white/5 pb-3"><span>Jurisdiction</span> <span className="text-white">All 50 States</span></div>
                     <div className="flex justify-between border-b border-white/5 pb-3"><span>Format</span> <span className="text-white">PDF / Print-Ready</span></div>
                     <div className="flex justify-between border-b border-white/5 pb-3"><span>Delivery</span> <span className="text-white">Instant Download</span></div>
                     <div className="flex justify-between pt-1"><span>Standard Cost</span> <span className="text-axim-gold font-bold">$4.00</span></div>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* 7. The Firehose */}
        <section className="py-24 relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-10 border-b border-white/10 pb-4">
            <SafeIcon icon={LuIcons.LuNewspaper} className="w-6 h-6 text-axim-purple" />
            <h2 className="text-3xl font-black uppercase tracking-tighter text-white">All Articles</h2>
          </div>
          <NewsFeed limit={12} />
        </section>

        <EngagementGuard />
        <Ecosystem />
        <Reviews />
      </div>
    </div>
  );
}
