import React, { useState, useEffect } from 'react';
import DOMPurify from 'isomorphic-dompurify';
import { fetchPosts } from '../lib/wp-fetch';

export default function NewsFeed({ limit = 12, title = "All Articles" }) {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadArticles = async () => {
      try {
        // Explicitly requesting _embed: 1 ensures media and author nodes are included in the payload
        const data = await fetchPosts({ per_page: limit, _embed: 1 });
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, index) => {
          const fallbackImage = "https://wp.axim.us.com/wp-content/uploads/2026/05/AXiM-Solar-Powur-Image-Panels-tech.png";
          const imageUrl = article._embedded?.['wp:featuredmedia']?.[0]?.source_url || fallbackImage;
          const authorName = article._embedded?.author?.[0]?.name || "AXiM Intel";

          // Dynamic Colors
          const overlayColors = ["from-slate-800/80", "from-axim-purple/80", "from-zinc-800/80"];
          const overlayClass = overlayColors[index % overlayColors.length];

          return (
            <a key={article.id} href={`/article/${article.slug}`} className="relative block border border-white/10 bg-black overflow-hidden group hover:border-axim-purple/50 transition-colors flex flex-col justify-end p-8 min-h-[280px] shadow-lg rounded-sm">
              <img src={imageUrl} alt={article.title?.rendered || "Article"} className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700" />

              <div className={`absolute inset-0 bg-gradient-to-b ${overlayClass} to-[#050505]/95 z-0 group-hover:opacity-0 transition-opacity duration-700`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-0" />

              <div className="relative z-10 mt-auto">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-[0.55rem] font-mono text-axim-gold uppercase tracking-widest bg-axim-gold/10 border border-axim-gold/20 px-2 py-1 rounded-sm">
                    Latest Article
                  </div>
                  <div className="text-[0.55rem] font-mono text-zinc-400 uppercase tracking-widest bg-white/5 border border-white/10 px-2 py-1 rounded-sm">
                    {authorName}
                  </div>
                </div>
                <h3 className="text-base md:text-lg font-black text-white mb-3 group-hover:text-axim-purple transition-colors line-clamp-2 leading-snug" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(article.title?.rendered || 'Untitled Briefing')}} />
                <div className="text-sm text-zinc-400 line-clamp-2" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(article.excerpt?.rendered || '')}} />
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
