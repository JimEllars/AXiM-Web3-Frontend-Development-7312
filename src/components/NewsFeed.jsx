import React, { useState, useEffect } from 'react';
import DOMPurify from 'isomorphic-dompurify';
import { fetchPostsByCategory as fetchPosts } from '../lib/wp-fetch';

export default function NewsFeed({ limit = 12, title = "All Articles" }) {
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

  if (isLoading || !articles || articles.length === 0) return null;

  return (
    <div className="w-full max-w-7xl mx-auto py-16 px-6">
      <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter mb-8 border-b border-white/10 pb-4">
        {title}
      </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.map((article) => {
          const fallbackImage = "https://wp.axim.us.com/wp-content/uploads/2026/05/AXiM-Solar-Powur-Image-Panels-tech.png";
          const imageUrl = article._embedded?.['wp:featuredmedia']?.[0]?.source_url || fallbackImage;

          return (
            <a key={article.id} href={`/article/${article.slug}`} className="relative block border border-white/10 bg-black overflow-hidden group hover:border-axim-purple/50 transition-colors flex flex-col justify-end p-6 min-h-[220px]">
              {/* Image Layer with Fallback */}
              <img src={imageUrl} alt={article.title?.rendered || "Article"} className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700" />

              {/* Highly Saturated Thematic Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-axim-purple/60 to-[#0F172A] z-0 group-hover:opacity-0 transition-opacity duration-700 mix-blend-hard-light" />

              {/* Text Protector (Never fades) */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-0" />

              <div className="relative z-10 mt-auto">
                <div className="text-[0.55rem] font-mono text-zinc-500 uppercase tracking-widest mb-2 border-l-2 border-axim-purple pl-2">
                  {new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
                <h3 className="text-sm md:text-base font-bold text-white mb-2 group-hover:text-axim-purple transition-colors line-clamp-2 leading-snug" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(article.title?.rendered || 'Untitled Briefing')}} />
                <div className="text-xs text-zinc-400 line-clamp-2" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(article.excerpt?.rendered || '')}} />
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
