import React, { useState, useEffect } from 'react';
import { fetchPosts } from '../lib/wp-fetch';
import ArticleCard from './ArticleCard';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';

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
        const data = await fetchPosts({ per_page: limit || 12, _embed: 1, page: 1 });
        setArticles(data || []);
        if (!data || data.length < (limit || 12)) {
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
  }, [limit]);

  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;

    try {
        const newData = await fetchPosts({ per_page: limit || 12, _embed: 1, page: nextPage });

        if (newData && newData.length > 0) {
           const existingIds = new Set(articles.map(a => a.id));
           const filteredNewData = newData.filter(a => !existingIds.has(a.id));

           setArticles(prev => [...prev, ...filteredNewData]);
           setPage(nextPage);

           if (newData.length < (limit || 12)) {
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
        <div className="w-full flex flex-col items-center justify-center py-24 space-y-4">
          <div className="w-8 h-8 border-2 border-axim-purple/30 border-t-axim-purple rounded-full animate-spin"></div>
          <span className="text-[0.65rem] font-mono uppercase tracking-widest text-zinc-500 animate-pulse">Syncing Database...</span>
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
            onClick={() => setActiveCategory(filter.id)}
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
        {articles.filter(article => {
          if (activeCategory === 'All Intelligence') return true;
          // check if activeCategory matches any of the article's embedded categories
          const categories = article._embedded?.['wp:term']?.[0] || [];
          return categories.some(cat => cat.name === activeCategory);
        }).map((article, index) => (
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
