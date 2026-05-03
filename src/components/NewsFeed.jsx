import React, { useState, useEffect } from 'react';
import DOMPurify from 'isomorphic-dompurify';
import { fetchPostsByCategory as fetchPosts } from '../lib/wp-fetch';

export default function NewsFeed({ limit = 9 }) {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadArticles = async () => {
      try {
        const data = await fetchPosts(null, limit);
        if (isMounted) {
          setArticles(data || []);
          setIsLoading(false);
        }
      } catch (error) {
        if (isMounted) setIsLoading(false);
      }
    };

    loadArticles();
    return () => { isMounted = false; };
  }, [limit]);

  if (isLoading) return null; // Let FeaturedArticles handle the loading UI to avoid double-spinners

  if (!articles || articles.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto pb-12 px-6 text-center font-mono text-axim-deep text-xs uppercase">
        [GLOBAL_FEED_UNAVAILABLE]
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto pb-20 px-6 mt-8">
      <h2 className="text-xl font-black text-white uppercase tracking-tighter mb-6 border-b border-white/10 pb-4">
        Global Ecosystem Feed
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10">
        {articles.slice(0, limit).map(article => (
          <a key={article.id} href={`/article/${article.slug}`} className="block group">
            <div className="text-[0.65rem] font-mono text-axim-purple mb-2 uppercase tracking-widest flex items-center gap-2">
              <div className="w-1 h-1 bg-axim-gold rounded-full" />
              Intelligence Brief
            </div>
            <h3 className="text-md font-bold text-white mb-2 group-hover:text-axim-gold transition-colors line-clamp-2" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(article.title?.rendered || article.title || '')}}></h3>
            <div className="text-xs text-zinc-500 line-clamp-2" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(article.excerpt?.rendered || article.excerpt || '')}}></div>
          </a>
        ))}
      </div>
    </div>
  );
}
