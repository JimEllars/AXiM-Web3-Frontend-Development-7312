import React, { useState, useEffect } from 'react';
import DOMPurify from 'isomorphic-dompurify';
import { fetchPosts } from '../lib/wp-fetch';
import SEO from '../components/SEO';
import GlobalLoader from '../components/GlobalLoader';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';
import NewsFeed from '../components/NewsFeed';
import WPImage from '../components/WPImage';

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

// DRY Sub-Component for visual parity across sections
const ArticleCard = ({ article, isHero = false }) => {
  const fallbackImage = "https://wp.axim.us.com/wp-content/uploads/2026/05/AXiM-Solar-Powur-Image-Panels-tech.png";
  const imageUrl = article._embedded?.['wp:featuredmedia']?.[0]?.source_url || fallbackImage;
  const authorName = article._embedded?.author?.[0]?.name || "AXiM Intel";

  return (
    <a href={`/article/${article.slug}`} className={`relative block border border-white/10 bg-black overflow-hidden group hover:border-axim-purple/50 transition-colors flex flex-col justify-end p-8 shadow-lg rounded-sm ${isHero ? 'min-h-[450px] lg:col-span-2' : 'min-h-[300px]'}`}>
      <WPImage src={imageUrl} alt={article.title?.rendered || "Article"} className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700" />

      {/* Saturated Frosted Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-axim-purple/80 to-[#050505]/95 z-0 group-hover:opacity-0 transition-opacity duration-700" />

      {/* Text Protector */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-0" />

      <div className="relative z-10 mt-auto">
        <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-3">
          <div className="text-[0.6rem] font-mono text-zinc-400 uppercase tracking-widest border-l-2 border-axim-purple pl-2">
            {new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
          <div className="text-[0.55rem] font-mono text-axim-gold uppercase tracking-widest bg-white/5 border border-white/10 px-2 py-1 rounded-sm">
            {authorName}
          </div>
        </div>
        <h3 className={`${isHero ? 'text-3xl md:text-4xl' : 'text-xl md:text-2xl'} font-black text-white mb-3 group-hover:text-axim-purple transition-colors leading-tight line-clamp-2`} dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(article.title?.rendered || 'Untitled Article')}} />
        <div className="text-sm text-zinc-400 line-clamp-2" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(article.excerpt?.rendered || '')}} />
      </div>
    </a>
  );
};

export default function Articles() {
  const [catData, setCatData] = useState({ featured: [], appSpotlight: [], serviceSpotlight: [] });
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
        const [feat, app, svc] = await Promise.all([
          fetchCat('featured', 3),
          fetchCat('app-software', 3),
          fetchCat('service-spotlight', 3)
        ]);

        if (isMounted) {
          setCatData({ featured: feat || [], appSpotlight: app || [], serviceSpotlight: svc || [] });
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
