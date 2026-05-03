import React, { useState, useEffect } from 'react';
import DOMPurify from 'isomorphic-dompurify';
import { fetchPostsByCategory as fetchPosts } from '../lib/wp-fetch';

export default function FeaturedArticles({ categorySlug = 'featured', limit = 3 }) {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadArticles = async () => {
      try {
        const data = await fetchPosts(categorySlug, limit);
        if (isMounted) {
          setArticles(data || []);
          setIsLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          console.log("[FEATURED_ARTICLES] Uplink degraded, utilizing local buffer rules.");
          setIsLoading(false);
        }
      }
    };

    loadArticles();
    return () => { isMounted = false; };
  }, [limit, categorySlug]);

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto py-12 px-6 mt-8 flex justify-center">
        <span className="text-axim-purple font-mono text-xs uppercase animate-pulse">ESTABLISHING_SECURE_UPLINK...</span>
      </div>
    );
  }

  if (!articles || articles.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto py-12 px-6 border border-axim-purple/20 bg-axim-purple/5 text-center font-mono text-axim-purple text-xs uppercase tracking-widest rounded-sm mt-8">
        [INTELLIGENCE_FEED_PENDING] // AWAITING_NETWORK_SYNC
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto py-12 px-6 mt-8">
      <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-6 flex items-center gap-3">
        <div className="w-2 h-2 bg-axim-purple rounded-full animate-pulse" />
        Featured
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.slice(0, limit).map(article => (
          <a key={article.id} href={`/article/${article.slug}`} className="block border border-white/10 bg-black hover:border-axim-purple/50 transition-colors p-6 group">
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-axim-purple transition-colors line-clamp-2" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(article.title?.rendered || article.title || '')}}></h3>
            <div className="text-sm text-zinc-400 line-clamp-3 mb-4" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(article.excerpt?.rendered || article.excerpt || '')}}></div>
            <span className="text-xs font-mono text-axim-gold uppercase tracking-widest flex items-center gap-2">
              Read Report <span className="group-hover:translate-x-1 transition-transform">→</span>
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
