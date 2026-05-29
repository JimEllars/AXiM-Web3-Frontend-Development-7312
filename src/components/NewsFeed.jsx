import React, { useState, useEffect } from 'react';
import DOMPurify from 'isomorphic-dompurify';
import { fetchPosts } from '../lib/wp-fetch';
import WPImage from './WPImage';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';

export default function NewsFeed({ limit = 12, title = "All Articles", hidePagination = false }) {
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadInitialArticles = async () => {
      try {
        const data = await fetchPosts({ per_page: limit, page: 1, _embed: 1 });
        if (isMounted) {
          setArticles(data || []);
          setHasMore(data?.length === limit);
          setIsLoading(false);
        }
      } catch (error) {
        if (isMounted) setIsLoading(false);
      }
    };
    loadInitialArticles();
    return () => { isMounted = false; };
  }, [limit]);

  const loadMore = async () => {
    if (isFetchingMore || !hasMore) return;
    setIsFetchingMore(true);
    try {
      const nextPage = page + 1;
      const nextData = await fetchPosts({ per_page: limit, page: nextPage, _embed: 1 });

      if (nextData && nextData.length > 0) {
        setArticles(prev => [...prev, ...nextData]);
        setPage(nextPage);
        setHasMore(nextData.length === limit);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to load more articles.");
    } finally {
      setIsFetchingMore(false);
    }
  };

  if (isLoading || !articles || articles.length === 0) return null;

  return (
    <div className="w-full max-w-7xl mx-auto py-16 px-6">
      <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter mb-8 border-b border-white/10 pb-4 flex items-center gap-3">
        <SafeIcon icon={LuIcons.LuDatabase} className="w-5 h-5 text-axim-purple" />
        {title}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {articles.map((article) => {
          const fallbackImage = "https://wp.axim.us.com/wp-content/uploads/2026/05/AXiM-Systems-1200x628-layout683-axim-infrastructure-axim-axim-1l1j8ci.webp";
          const imageUrl = article._embedded?.['wp:featuredmedia']?.[0]?.source_url || fallbackImage;
          const authorName = article._embedded?.author?.[0]?.name || "AXiM Intel";

          return (
            <a key={article.id} href={`/article/${article.slug}`} className="relative block border border-white/10 bg-black overflow-hidden group hover:border-axim-purple/50 transition-colors flex flex-col justify-end p-8 min-h-[280px] shadow-lg rounded-sm">
              <WPImage src={imageUrl} alt={article.title?.rendered || "Article"} className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700" />
              <div className="absolute inset-0 bg-gradient-to-b from-axim-purple/80 to-[#050505]/95 z-0 group-hover:opacity-0 transition-opacity duration-700" />
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
                <h3 className="text-base md:text-lg font-black text-white mb-3 group-hover:text-axim-purple transition-colors line-clamp-2 leading-snug" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(article.title?.rendered || 'Untitled Article')}} />
                <div className="text-sm text-zinc-400 line-clamp-2" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(article.excerpt?.rendered || '')}} />
              </div>
            </a>
          );
        })}
      </div>

      {hasMore && !hidePagination && (
        <div className="text-center">
          <button
            onClick={loadMore}
            disabled={isFetchingMore}
            className="inline-flex items-center justify-center px-8 py-4 border border-white/20 bg-white/5 text-white font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-colors disabled:opacity-50"
          >
            {isFetchingMore ? (
              <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"/> Processing...</span>
            ) : (
              <span className="flex items-center gap-2">Load Previous Articles <SafeIcon icon={LuIcons.LuChevronDown} className="w-4 h-4"/></span>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
