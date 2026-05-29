import React, { useState, useEffect } from 'react';
import DOMPurify from 'isomorphic-dompurify';
import { fetchPosts } from '../lib/wp-fetch';
import SEO from '../components/SEO';
import GlobalLoader from '../components/GlobalLoader';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';
import NewsFeed from '../components/NewsFeed';
import WPImage from '../components/WPImage';
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
  const [catData, setCatData] = useState({ dailyNews: [], featured: [], appSpotlight: [], serviceSpotlight: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadCategories = async () => {
      try {
        // Helper to resolve slugs to IDs and fetch posts
        const fetchCat = async (slug, limit) => {
          const res = await fetch(`https://wp.axim.us.com/wp-json/wp/v2/categories?slug=${slug}`);
          const cats = await res.json();
          if (cats && cats.length > 0) {
            return await fetchPosts({ categories: cats[0].id, per_page: limit, _embed: 1 });
          }
          return [];
        };

        // Parallel fetch for maximum performance
        const [dn, feat, app, svc] = await Promise.all([
          fetchCat('daily-news', 3),
          fetchCat('featured', 3),
          fetchCat('app-software', 3),
          fetchCat('service-spotlight', 3)
        ]);

        if (isMounted) {
          setCatData({ dailyNews: dn || [], featured: feat || [], appSpotlight: app || [], serviceSpotlight: svc || [] });
          setIsLoading(false);
        }
      } catch (error) {
        if (isMounted) setIsLoading(false);
      }
    };
    loadCategories();
    return () => { isMounted = false; };
  }, []);

  // Removed GlobalLoader blocking return

  return (
    <div className="w-full min-h-screen bg-bg-void relative z-10 pb-32">
      <SEO title="Articles | AXiM Systems" description="Strategic insights, software spotlights, and decentralized infrastructure updates." />

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

      <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-24">

        {/* Section 0: Daily News */}
        {catData.dailyNews.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
              <SafeIcon icon={LuIcons.LuNewspaper} className="w-6 h-6 text-axim-purple" />
              <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Daily News</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {isLoading ? (
                 <>
                   <SkeletonCard />
                   <SkeletonCard />
                   <SkeletonCard />
                 </>
              ) : (
                 catData.dailyNews.map((article) => (
                   <ArticleCard key={article.id} article={article} />
                 ))
              )}
            </div>
          </section>
        )}

        {/* Section 1: Featured Articles */}
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

        {/* Section 2: App Spotlight */}
        {(!isLoading || catData.appSpotlight.length > 0) && (
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

        {/* Section 3: Service Spotlight */}
        {(!isLoading || catData.serviceSpotlight.length > 0) && (
          <section>
            <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
              <SafeIcon icon={LuIcons.LuNetwork} className="w-6 h-6 text-[#DB2777]" />
              <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Service Spotlight</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {isLoading ? (
                 <>
                   <SkeletonCard />
                   <SkeletonCard />
                   <SkeletonCard />
                 </>
              ) : (
                 catData.serviceSpotlight.map((article) => (
                   <ArticleCard key={article.id} article={article} />
                 ))
              )}
            </div>
          </section>
        )}

      </div>

      {/* Section 4: All Articles (The Catch-All Firehose) */}
      <div className="mt-12 bg-[#050505] border-t border-white/10 pt-8 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] relative z-20">
         <NewsFeed limit={9} title="All Articles" />
      </div>

    </div>
  );
}
