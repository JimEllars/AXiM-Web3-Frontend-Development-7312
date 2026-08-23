import React, { useState, useEffect } from 'react';
import DOMPurify from 'isomorphic-dompurify';
import { fetchPosts, fetchCategoryBySlug } from '../lib/wp-fetch';
import SEO from '../components/SEO';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';
import HubNavigator from "../components/HubNavigator";
import NewsFeed from '../components/NewsFeed';
import ArticleCard from '../components/ArticleCard';
import { logTelemetry } from '../lib/telemetry';
import { motion } from 'framer-motion';
import { useAximStore } from '../store/useAximStore';

const SkeletonCard = ({ isHero = false }) => (
  <div className={`flex flex-col justify-between p-5 bg-[#050505] border border-white/5 shadow-2xl rounded-sm animate-pulse ${isHero ? 'min-h-[450px] lg:col-span-2' : 'min-h-[320px]'}`}>
    <div className="w-full h-48 bg-white/5 rounded-sm mb-4" />
    <div className="flex-1 flex flex-col justify-between">
      <div>
        <div className="w-16 h-3 bg-white/10 rounded-sm mb-4" />
        <div className="w-3/4 h-6 bg-white/10 rounded-sm mb-3" />
        <div className="w-full h-4 bg-white/10 rounded-sm mb-1" />
        <div className="w-5/6 h-4 bg-white/10 rounded-sm" />
      </div>
      <div className="w-24 h-4 bg-white/10 rounded-sm mt-6" />
    </div>
  </div>
);

export default function Articles() {
  const { isWeb3Authenticated, walletAddress } = useAximStore();
  const [catData, setCatData] = useState({ dailyNews: [], featured: [], appSpotlight: [] });
  const [activeFilter, setActiveFilter] = useState('All Articles');
  const [leadStory, setLeadStory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  // Helper to filter articles by category pill
  const filterArticles = (articles) => {
    if (activeFilter === 'All Articles') return articles;
    return articles.filter(article => {
      const title = (article?.title?.rendered || article?.title || '').toLowerCase();
      const tags = (article?.tags || []).join(' ').toLowerCase();
      const term = activeFilter.toLowerCase();

      if (term.includes('business')) return title.includes('business') || tags.includes('business') || article?.category_slug === 'business-development';
      if (term.includes('personal')) return title.includes('personal') || tags.includes('personal') || article?.category_slug === 'personal-development';
      if (term.includes('tech')) return title.includes('tech') || tags.includes('tech') || article?.category_slug === 'tech-development';
      return false;
    });
  };

  const filteredDailyNews = filterArticles(catData.dailyNews);
  const filteredFeatured = filterArticles(catData.featured);
  const filteredAppSpotlight = filterArticles(catData.appSpotlight);
  const filteredLeadStory = leadStory && filterArticles([leadStory]).length > 0 ? leadStory : null;



  useEffect(() => {
    let isMounted = true;
    const loadCategories = async () => {
      try {
        const dailyNewsId = await fetchCategoryBySlug('daily-news');
        const featuredId = await fetchCategoryBySlug('featured');
        const appSpotlightId = await fetchCategoryBySlug('app-software');

        const [dn, feat, app] = await Promise.all([
          fetchPosts({ categories: dailyNewsId, per_page: 3, _embed: 1 }),
          fetchPosts({ categories: featuredId, per_page: 6, _embed: 1 }),
          fetchPosts({ categories: appSpotlightId, per_page: 6, _embed: 1 })
        ]);

        if (isMounted) {
          const dailyNewsIds = new Set((dn || []).map(post => post.id));


          const targetDailyNewsIntId = parseInt(dailyNewsId);
          const targetFeaturedIntId = parseInt(featuredId);
          const targetAppSpotlightIntId = parseInt(appSpotlightId);

          const dailyNewsArray = (dn || []).filter(post =>
            (post.category_slug === 'daily-news' || (Array.isArray(post.categories) && post.categories.includes(targetDailyNewsIntId))) &&
            (!Array.isArray(post.categories) || !post.categories.includes(targetAppSpotlightIntId)) &&
            post.category_slug !== 'software-spotlight' &&
            post.category_slug !== 'app-software'
          );
          if (dailyNewsArray.length > 0) {
            setLeadStory(dailyNewsArray[0]);
          } else {
            setLeadStory(null);
          }
          const cleanFeat = (feat || []).filter(post => !dailyNewsIds.has(post.id) && (
              post.category_slug === 'featured' ||
              (Array.isArray(post.categories) && post.categories.includes(targetFeaturedIntId))
          ));
          const cleanApp = (app || []).filter(post => !dailyNewsIds.has(post.id) && (
              post.category_slug === 'app-software' ||
              (Array.isArray(post.categories) && post.categories.includes(targetAppSpotlightIntId))
          ));
          setCatData({
            dailyNews: dailyNewsArray.slice(1),

            // Prevent content contamination across grids by isolating collections via explicit Sets
            featured: cleanFeat.slice(0, 6),
            appSpotlight: cleanApp.slice(0, 6)
          });
          setIsLoading(false);
        }
      } catch (error) {
        console.error("[WP_HUB] Fetch architecture error:", error);
        if (isMounted) setIsLoading(false);
      }
    };
    loadCategories();
    return () => { isMounted = false; };
  }, []);

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "AXiM Intelligence Hub",
    "description": "Latest intelligence briefings, system architecture updates, and decentralized enterprise automation strategies.",
    "url": "https://axim.us.com/articles",
    "publisher": {
      "@type": "Organization",
      "name": "AXiM Development",
      "logo": {
        "@type": "ImageObject",
        "url": "https://wp.axim.us.com/wp-content/uploads/2026/08/AXiM-Business-Development-cropped.png"
      }
    ,
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
  };

  return (
    <div className="w-full min-h-screen bg-bg-void relative z-10 pb-32">
      <SEO
        title="Intelligence Hub | AXiM Development"
        description="Latest intelligence briefings, system architecture updates, and decentralized enterprise automation strategies."
        customSchema={[blogSchema]}
      />

      {/* Hub Hero */}
      <motion.section
        className="pt-32 pb-16 relative overflow-hidden"
        onViewportEnter={() => {
          logTelemetry('articles_directory_viewed', { initialFilter: activeFilter });
        }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:40px_40px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-center">
          <div className="absolute top-0 right-0 lg:right-8 flex items-center justify-center lg:justify-end w-full lg:w-auto -mt-12 lg:mt-0">
            <div className="inline-flex items-center px-2.5 py-1 bg-white/5 border border-white/5 text-[10px] font-mono tracking-widest text-zinc-500 uppercase rounded-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
              GATEWAY // ISOLATE_ACTIVE
              {isWeb3Authenticated && (
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 font-mono text-[8px] text-emerald-400 uppercase tracking-widest rounded-sm select-none pointer-events-none ml-2">
                  <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                  [AiO_INDEX: KNOWLEDGE_GRAPH_VERIFIED]
                </span>
              )}
              {isWeb3Authenticated && (
                <span className="ml-2 pl-2 border-l border-white/10 font-mono text-[9px] text-axim-purple tracking-widest uppercase select-none inline-flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-axim-purple animate-pulse" />
                  [DIRECTORY_INDEX: ARBITRUM_SYNCED // LEVEL_1_READ]
                </span>
              )}
              {isWeb3Authenticated && walletAddress && (
                <span className="ml-2 pl-2 border-l border-white/10 font-mono text-[9px] text-axim-purple tracking-widest uppercase">
                  [HASH: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}]
                </span>
              )}
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white leading-tight mb-4 mt-6">
            AXiM <span className="text-axim-purple">Articles.</span>
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Strategic insights, partner integrations, and tactical blueprints for scaling your decentralized architecture.
          </p>
        </div>
      </motion.section>

      {/* Filter Pill-Bar for Articles */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-12">
        <div className="flex flex-wrap gap-3 justify-center">
          {['All Articles', 'Business Development', 'Personal Development', 'Tech Development'].map(filter => (
            <button
              key={filter}
              onClick={() => {
              setActiveFilter(filter);
              logTelemetry('article_category_filter_selected', { filter, origin: 'articles_directory' });
            }}
              className={`px-5 py-2.5 rounded-sm text-[0.7rem] font-mono uppercase tracking-widest transition-all border ${
                activeFilter === filter
                  ? 'bg-axim-purple/20 border-axim-purple text-white shadow-[0_0_15px_rgba(147,51,234,0.3)]'
                  : 'bg-[#050505]/80 border-white/10 text-zinc-400 hover:text-white hover:border-white/30 backdrop-blur-md'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-24">

        {/* Section 0: Daily News */}
        {(filteredLeadStory || filteredDailyNews.length > 0) && (
          <section>
            <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2 font-mono text-[10px] text-axim-purple uppercase tracking-widest mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-axim-purple animate-pulse" />
                  // INTEL_STREAM: ARBITRUM_SYNCED
                </div>
                <div className="flex items-center gap-3">
                  <SafeIcon icon={LuIcons.LuNewspaper} className="w-6 h-6 text-axim-purple" />
                  <h2 className="text-2xl font-black uppercase tracking-tighter text-white">News & Articles</h2>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              {isLoading ? (
                 <>
                   <SkeletonCard isHero={true} />
                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                     <SkeletonCard />
                     <SkeletonCard />
                   </div>
                 </>
              ) : (
                 <>
                   {filteredLeadStory && (
                     <ArticleCard key={leadStory.id} article={filteredLeadStory} isHero={true} priority={true} />
                   )}
                   {filteredDailyNews.length > 0 && (
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                       {filteredDailyNews.map((article) => (
                         <ArticleCard key={article.id} article={article} />
                       ))}
                     </div>
                   )}
                 </>
              )}
            </div>
          </section>
        )}

        {/* Section 1: Featured Articles */}
        {(!isLoading && filteredFeatured.length > 0) && (
        <section>
          <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2 font-mono text-[10px] text-axim-purple uppercase tracking-widest mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-axim-purple animate-pulse" />
                // INTEL_STREAM: ARBITRUM_SYNCED
              </div>
              <div className="flex items-center gap-3">
                <SafeIcon icon={LuIcons.LuStar} className="w-6 h-6 text-axim-gold" />
                <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Featured</h2>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {isLoading ? (
               <>
                 <SkeletonCard isHero={true} />
                 <SkeletonCard />
                 <SkeletonCard />
               </>
            ) : (
               filteredFeatured.map((article, idx) => (
                 <ArticleCard key={article.id} article={article} isHero={idx === 0} />
               ))
            )}
          </div>
        </section>
        )}

        {/* Section 2: App Spotlight (Software Spotlight) */}
        {(!isLoading && filteredAppSpotlight.length > 0) && (
          <motion.section
            onViewportEnter={() => {
              logTelemetry('articles_page_spotlight_impression', { count: filteredAppSpotlight?.length || 0 });
            }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2 font-mono text-[10px] text-axim-purple uppercase tracking-widest mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-axim-purple animate-pulse" />
                  // INTEL_STREAM: ARBITRUM_SYNCED
                </div>
                <div className="flex items-center gap-3">
                  <SafeIcon icon={LuIcons.LuCpu} className="w-6 h-6 text-axim-purple" />
                  <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Software Spotlight</h2>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10 w-full">
              {isLoading ? (
                <>
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                </>
              ) : (
                <>
                  {filteredAppSpotlight.slice(0, 4).map((article, index) => (
                    <ArticleCard article={article} index={index} key={article.id || index} />
                  ))}
                </>
              )}
            </div>
          </motion.section>
        )}
      </div>

      {/* Section 3: All Articles (The Catch-All Firehose) */}
      <div className="mt-12 bg-[#050505] border-t border-white/10 pt-8 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] relative z-20">
         <HubNavigator title="Explore AXiM Development" />
         <NewsFeed limit={9} title="All Articles" />
      </div>
    </div>
  );
}
