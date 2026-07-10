import React, { useState, useEffect } from 'react';
import DOMPurify from 'isomorphic-dompurify';
import { fetchPosts, fetchCategoryBySlug } from '../lib/wp-fetch';
import SEO from '../components/SEO';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';
import NewsFeed from '../components/NewsFeed';
import ArticleCard from '../components/ArticleCard';

const SkeletonCard = ({ isHero = false }) => (
  <div className={`relative block border border-white/5 bg-[#050505] overflow-hidden flex flex-col justify-end p-8 shadow-lg rounded-sm animate-pulse ${isHero ? 'min-h-[450px] lg:col-span-2' : 'min-h-[300px]'}`}>
    <div className="relative z-10 mt-auto w-full">
      <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-3">
        <div className="w-16 h-3 bg-white/10 rounded-sm" />
        <div className="w-20 h-4 bg-white/10 rounded-sm" />
      </div>
      <div className="w-3/4 h-6 bg-white/10 rounded-sm mb-3" />
      <div className="w-full h-4 bg-white/10 rounded-sm mb-1" />
      <div className="w-5/6 h-4 bg-white/10 rounded-sm" />
    </div>
  </div>
);

export default function Articles() {
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
              post.category_slug === 'daily-news' ||
              (Array.isArray(post.categories) && post.categories.includes(targetDailyNewsIntId))
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
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white leading-tight mb-4">
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
          {['All briefings', 'Daily News', 'Featured', 'Software Spotlight'].map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
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
        {(leadStory || catData.dailyNews.length > 0) && (activeFilter === 'All briefings' || activeFilter === 'Daily News') && (
          <section>
            <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
              <SafeIcon icon={LuIcons.LuNewspaper} className="w-6 h-6 text-axim-purple" />
              <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Daily News</h2>
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
          <section>
            <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
              <SafeIcon icon={LuIcons.LuCpu} className="w-6 h-6 text-axim-purple" />
              <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Software Spotlight</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {isLoading ? (
                 <>
                   <SkeletonCard />
                   <SkeletonCard />
                   <SkeletonCard />
                 </>
              ) : (
                 catData.appSpotlight.map((article) => (
                   <ArticleCard key={article.id} article={article} />
                 ))
              )}
            </div>
          </section>
        )}
      </div>

      {/* Section 3: All Articles (The Catch-All Firehose) */}
      <div className="mt-12 bg-[#050505] border-t border-white/10 pt-8 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] relative z-20">
         <NewsFeed limit={9} title="All Articles" />
      </div>
    </div>
  );
}
