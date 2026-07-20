import React, { useState, useEffect } from 'react';
import DOMPurify from 'isomorphic-dompurify';
import { fetchPosts, fetchCategoryBySlug } from '../lib/wp-fetch';
import SEO from '../components/SEO';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';
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
  const [leadStory, setLeadStory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All briefings');

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
      "name": "AXiM Systems",
      "logo": {
        "@type": "ImageObject",
        "url": "https://wp.axim.us.com/wp-content/uploads/2025/06/12.png"
      }
    }
  };

  return (
    <div className="w-full min-h-screen bg-bg-void relative z-10 pb-32">
      <SEO
        title="Intelligence Hub | AXiM Systems"
        description="Latest intelligence briefings, system architecture updates, and decentralized enterprise automation strategies."
        customSchema={[blogSchema]}
      />

      {/* Hub Hero */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:40px_40px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-center">
          <div className="absolute top-0 right-0 lg:right-8 flex items-center justify-center lg:justify-end w-full lg:w-auto -mt-12 lg:mt-0">
            <div className="inline-flex items-center px-2.5 py-1 bg-white/5 border border-white/5 text-[10px] font-mono tracking-widest text-zinc-500 uppercase rounded-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
              GATEWAY // ISOLATE_ACTIVE
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
      </section>

      {/* Filter Pill-Bar for Articles */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-12">
        <div className="flex flex-wrap gap-3 justify-center">
          {['All briefings', 'News & Articles', 'Featured', 'Software Spotlight'].map(filter => (
            <button
              key={filter}
              onClick={() => {
              setActiveFilter(filter);
              logTelemetry('article_filter_switch', { filter, origin: 'articles_page' });
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
        {(leadStory || catData.dailyNews.length > 0) && (activeFilter === 'All briefings' || activeFilter === 'News & Articles') && (
          <section>
            <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
              <SafeIcon icon={LuIcons.LuNewspaper} className="w-6 h-6 text-axim-purple" />
              <h2 className="text-2xl font-black uppercase tracking-tighter text-white">News & Articles</h2>
            </div>

            <div className="flex flex-col gap-6">
              {isLoading ? (
                 <>
                   <SkeletonCard isHero={true} />
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <SkeletonCard />
                     <SkeletonCard />
                   </div>
                 </>
              ) : (
                 <>
                   {leadStory && (
                     <ArticleCard key={leadStory.id} article={leadStory} isHero={true} priority={true} />
                   )}
                   {catData.dailyNews.length > 0 && (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       {catData.dailyNews.map((article) => (
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
        {(activeFilter === 'All briefings' || activeFilter === 'Featured') && (
        <section>
          <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
            <SafeIcon icon={LuIcons.LuStar} className="w-6 h-6 text-axim-gold" />
            <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Featured</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
               <>
                 <SkeletonCard isHero={true} />
                 <SkeletonCard />
                 <SkeletonCard />
               </>
            ) : (
               catData.featured.map((article, idx) => (
                 <ArticleCard key={article.id} article={article} isHero={idx === 0} />
               ))
            )}
          </div>
        </section>
        )}

        {/* Section 2: App Spotlight (Software Spotlight) */}
        {(!isLoading || catData.appSpotlight.length > 0) && (activeFilter === 'All briefings' || activeFilter === 'Software Spotlight') && (
          <motion.section
            onViewportEnter={() => {
              logTelemetry('articles_page_spotlight_impression', { count: catData.appSpotlight?.length || 0 });
            }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
              <SafeIcon icon={LuIcons.LuCpu} className="w-6 h-6 text-axim-purple" />
              <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Software Spotlight</h2>
            </div>
            <div className="flex flex-col lg:flex-row gap-8 relative z-10 w-full">
              {isLoading ? (
                <>
                  <div className="w-full lg:w-1/2 flex">
                    <SkeletonCard isHero={true} />
                  </div>
                  <div className="w-full lg:w-1/2 flex flex-col gap-4 justify-between">
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                  </div>
                </>
              ) : (
                <>
                  {/* Left Highlight Panel Column */}
                  {catData.appSpotlight[0] && (
                    <div className="w-full lg:w-1/2 flex">
                      <ArticleCard article={catData.appSpotlight[0]} index={0} isHero={true} priority={true}/>
                    </div>
                  )}

                  {/* Right Briefing Stack Column */}
                  <div className="w-full lg:w-1/2 flex flex-col gap-4 justify-between">
                    {catData.appSpotlight.slice(1, 4).map((article, index) => (
                      <ArticleCard index={index + 1} article={article} key={article.id || index} variant="row" />
                    ))}
                  </div>
                </>
              )}
            </div>
          </motion.section>
        )}
      </div>

      {/* Section 3: All Articles (The Catch-All Firehose) */}
      <div className="mt-12 bg-[#050505] border-t border-white/10 pt-8 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] relative z-20">
         <NewsFeed limit={9} title="All Articles" />
      </div>
    </div>
  );
}
