import React, { useState, useEffect } from 'react';
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

  const filters = [
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

  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;

    try {
        let params = { per_page: limit || 12, _embed: 1, page: nextPage };

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

        if (filteredNewData.length > 0) {
           setArticles(prev => {
             const uniqueBatch = filteredNewData.filter(item => !prev.some(p => p.id === item.id));
             return [...prev, ...uniqueBatch];
           });
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
              <div key={i} className="bg-[#050505] border border-white/5 h-80 rounded-sm p-6 flex flex-col justify-between">
                <div className="w-1/3 h-4 bg-white/5 rounded-sm" />
                <div className="w-full h-8 bg-white/10 rounded-sm my-4" />
                <div className="w-2/3 h-4 bg-white/5 rounded-sm mt-auto" />
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
            onClick={() => { setActiveCategory(filter.id); logTelemetry('feed_filter_switch', { category: filter.id }); }}
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, index) => (
          <ArticleCard key={article.id} article={article} index={index} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-12 flex justify-center">
          <button
            onClick={handleLoadMore}
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
