import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchPosts, fetchCategoryBySlug } from '../lib/wp-fetch';
import ArticleCard from './ArticleCard';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';
import { logTelemetry } from '../lib/telemetry';

export default function NewsFeed({ limit = null, title = null }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All Intelligence');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isPrimed, setIsPrimed] = useState(false);

  const filters = [
    { id: 'Daily News', label: 'News & Articles' },
    { id: 'All Intelligence', label: 'All Intelligence' },
    { id: 'Web3 Systems', label: 'Web3 Systems' },
    { id: 'Automation', label: 'Automation' },
    { id: 'Company Bulletins', label: 'Company Bulletins' }
  ];

  useEffect(() => {
    async function loadArticles() {
      setLoading(true);
      setError(null);
      setPage(1);
      setHasMore(true);
      try {
        let params = { per_page: limit || 12, _embed: 1, page: 1 };

        let spotlightCategoryId = null;
        let appSoftwareCategoryId = null;
        if (activeCategory === 'Daily News' || activeCategory === 'News & Articles') {
           spotlightCategoryId = await fetchCategoryBySlug('software-spotlight');
           appSoftwareCategoryId = await fetchCategoryBySlug('app-software');
           if (spotlightCategoryId) params.categories_exclude = spotlightCategoryId;
        }

        if (activeCategory !== 'All Intelligence') {
          const categoryId = await fetchCategoryBySlug(activeCategory);
          if (categoryId) {
            params.categories = categoryId;
          }
        }

        const data = await fetchPosts(params);

        let filteredData = data || [];
        if (activeCategory !== 'All Intelligence') {
          const categoryId = await fetchCategoryBySlug(activeCategory);
          const targetCategoryIntId = parseInt(categoryId);
          if (categoryId) {
            filteredData = filteredData.filter(item =>
              item.category_slug === activeCategory ||
              (Array.isArray(item.categories) && item.categories.includes(targetCategoryIntId))
            );
          }
        }

        if (activeCategory === 'Daily News' || activeCategory === 'News & Articles') {
           const preFilterCount = filteredData.length;
           const spotlightId = parseInt(spotlightCategoryId);
           const appSoftwareId = parseInt(appSoftwareCategoryId);
           filteredData = filteredData.filter(item =>
              item.category_slug !== 'software-spotlight' &&
              item.category_slug !== 'app-software' &&
              (!Array.isArray(item.categories) || (!item.categories.includes(spotlightId) && !item.categories.includes(appSoftwareId)))
           );
           if (filteredData.length < preFilterCount) {
             logTelemetry('category_bleed_filtered', { count: preFilterCount - filteredData.length, origin: 'NewsFeed.jsx (initial load)' });
           }
        }

        setArticles(filteredData);
        if (!data || filteredData.length < (limit || 12)) {
          setHasMore(false);
        }
      } catch (err) {
        console.error("Error fetching articles:", err);
        setError("Failed to establish uplink with content database.");
      } finally {
        setLoading(false);
      }
    }
    loadArticles();
  }, [limit, activeCategory]);


  const handleSpeculativeWarmup = () => {
    if (!isPrimed) {
      setIsPrimed(true);
      fetchPosts({ forceWarmup: true }).catch(err => console.error("Prefetch failed", err));
    }
  };

  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;

    try {
        let params = { per_page: limit || 12, _embed: 1, page: nextPage };

        let spotlightCategoryId = null;
        let appSoftwareCategoryId = null;
        if (activeCategory === 'Daily News' || activeCategory === 'News & Articles') {
           spotlightCategoryId = await fetchCategoryBySlug('software-spotlight');
           appSoftwareCategoryId = await fetchCategoryBySlug('app-software');
           if (spotlightCategoryId) params.categories_exclude = spotlightCategoryId;
        }

        if (activeCategory !== 'All Intelligence') {
          const categoryId = await fetchCategoryBySlug(activeCategory);
          if (categoryId) {
            params.categories = categoryId;
          }
        }

        const newData = await fetchPosts(params);
        let filteredNewData = newData || [];
        if (activeCategory !== 'All Intelligence') {
          const categoryId = await fetchCategoryBySlug(activeCategory);
          const targetCategoryIntId = parseInt(categoryId);
          if (categoryId) {
            filteredNewData = filteredNewData.filter(item =>
              item.category_slug === activeCategory ||
              (Array.isArray(item.categories) && item.categories.includes(targetCategoryIntId))
            );
          }
        }

        if (activeCategory === 'Daily News' || activeCategory === 'News & Articles') {
           const preFilterCount = filteredNewData.length;
           const spotlightId = parseInt(spotlightCategoryId);
           const appSoftwareId = parseInt(appSoftwareCategoryId);
           filteredNewData = filteredNewData.filter(item =>
              item.category_slug !== 'software-spotlight' &&
              item.category_slug !== 'app-software' &&
              (!Array.isArray(item.categories) || (!item.categories.includes(spotlightId) && !item.categories.includes(appSoftwareId)))
           );
           if (filteredNewData.length < preFilterCount) {
             logTelemetry('category_bleed_filtered', { count: preFilterCount - filteredNewData.length, origin: 'NewsFeed.jsx (load more)' });
           }
        }

        if (filteredNewData.length > 0) {
           setArticles(prev => {
             const uniqueBatch = filteredNewData.filter(item => !prev.some(p => p.id === item.id));
             return [...prev, ...uniqueBatch];
           });
           logTelemetry("feed_load_more_triggered", { category: activeCategory, page: nextPage });
           setPage(nextPage);

           if (filteredNewData.length < (limit || 12)) {
               setHasMore(false);
           }
        } else {
           setHasMore(false);
        }
    } catch (err) {
        console.error("Error fetching more articles:", err);
    } finally {
        setLoadingMore(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full">
        {title && (
          <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4 px-6 lg:px-8 max-w-7xl mx-auto mt-8">
            <SafeIcon icon={LuIcons.LuNewspaper} className="w-6 h-6 text-axim-purple" />
            <h2 className="text-2xl font-black uppercase tracking-tighter text-white">{title}</h2>
          </div>
        )}
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex flex-col justify-between p-5 bg-[#050505] border border-white/5 shadow-2xl rounded-sm min-h-[320px]">
                <div className="w-full aspect-video h-48 bg-white/5 rounded-sm mb-4" />
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
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-12 text-center border border-red-500/20 bg-[#050505] rounded-sm max-w-7xl mx-auto px-6 lg:px-8 mt-8">
        <SafeIcon icon={LuIcons.LuTriangleAlert} className="w-8 h-8 text-red-500 mx-auto mb-3" />
        <p className="text-xs font-mono text-zinc-400 uppercase tracking-widest">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 py-8">
      {title && (
        <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
          <SafeIcon icon={LuIcons.LuNewspaper} className="w-6 h-6 text-axim-purple" />
          <h2 className="text-2xl font-black uppercase tracking-tighter text-white">{title}</h2>
        </div>
      )}

      {/* Filter Pill-Bar */}
      <div className="flex flex-wrap gap-2 mb-8">
        {filters.map(filter => (
          <button
            key={filter.id}
            onClick={() => { setActiveCategory(filter.id); logTelemetry('feed_filter_switch', { category: filter.id }); logTelemetry('newsfeed_category_switched', { category: filter.id, label: filter.label }); }}
            className={`px-4 py-2 rounded-sm text-[0.65rem] font-mono uppercase tracking-widest transition-colors border ${
              activeCategory === filter.id
                ? 'bg-axim-purple/20 border-axim-purple text-white shadow-[0_0_15px_rgba(147,51,234,0.3)]'
                : 'bg-black/50 border-white/10 text-zinc-400 hover:text-white hover:border-white/30'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
        {(() => {
           try {
             const rawArticles = Array.isArray(articles) ? articles : [];
             const truncatedBriefings = rawArticles.slice(0, 5);
             const visibleBriefings = activeCategory === 'Daily News' ? truncatedBriefings : rawArticles;
             return visibleBriefings.map((article, index) => {
               if (!article || typeof article !== 'object') {
                 return (
                   <div key={`empty-${index}`} className="flex flex-col justify-center items-center p-5 bg-[#050505] border border-white/5 shadow-2xl rounded-sm min-h-[320px]">
                     <span className="text-zinc-600 font-mono text-xs uppercase tracking-widest">Content Unavailable</span>
                   </div>
                 );
               }
               return <ArticleCard key={article.id || `fallback-${index}`} article={article} index={index} />;
             });
           } catch (error) {
             console.error("Layout Exception Blocked:", error);
             return (
               <div className="col-span-full py-12 text-center border border-red-500/20 bg-[#050505] rounded-sm flex flex-col items-center justify-center min-h-[320px]">
                 <SafeIcon icon={LuIcons.LuTriangleAlert} className="w-8 h-8 text-red-500/50 mb-3" />
                 <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Feed Synchronization Fault</p>
               </div>
             );
           }
        })()}
      </div>


      {activeCategory === 'Daily News' && (
          <div className="mt-12 flex justify-center w-full">
            <Link to="/articles" onMouseEnter={handleSpeculativeWarmup} onClick={() => logTelemetry('see_all_briefings_click', { origin: 'home_daily_news' })} className="group inline-flex items-center gap-3 px-6 py-3 bg-[#090909] hover:bg-[#0f0f0f] border border-white/5 hover:border-axim-purple/40 text-xs font-mono tracking-widest text-zinc-400 hover:text-white uppercase transition-all duration-300 rounded-sm">
              See All Intelligence
              <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
            </Link>
          </div>
      )}

      {hasMore && activeCategory !== 'Daily News' && (
        <div className="mt-12 flex justify-center">
          <button
            onClick={() => {
              handleLoadMore();
              logTelemetry('newsfeed_page_advanced', { newPage: page + 1, activeCategory });
            }}
            disabled={loadingMore}
            className="flex items-center space-x-3 px-8 py-4 bg-transparent border border-axim-purple/50 text-white font-mono text-xs uppercase tracking-widest hover:bg-axim-purple/10 hover:border-axim-purple transition-all rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingMore ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Loading...</span>
              </>
            ) : (
              <>
                <span>LOAD MORE INTELLIGENCE</span>
                <SafeIcon icon={LuIcons.LuChevronDown} className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
