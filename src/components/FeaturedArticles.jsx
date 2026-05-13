import React, { useState, useEffect } from 'react';
import DOMPurify from 'isomorphic-dompurify';
import { fetchPosts, fetchCategoryBySlug } from '../lib/wp-fetch';

export default function FeaturedArticles({ title = "Featured Intelligence", categorySlug = "featured", limit = 6 }) {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadArticles = async () => {
      try {
        const categoryId = await fetchCategoryBySlug(categorySlug);
        const params = { per_page: limit };
        if (categoryId) params.categories = categoryId;

        const data = await fetchPosts(params);
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
  }, [categorySlug, limit]);

  if (isLoading || !articles || articles.length === 0) return null;

  return (
    <div className="w-full max-w-7xl mx-auto py-16 px-6">
      <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter mb-8 flex items-center gap-3 border-b border-white/10 pb-4">
        <div className="w-2 h-2 bg-axim-purple rounded-full animate-pulse" />
        {title}
      </h2>

      {/* Fibonacci Top Section: 7/5 Grid Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 lg:grid-rows-2 gap-4 mb-4">
        {/* Article 1: Massive Hero */}
        {articles[0] && (
          <a href={`/article/${articles[0].slug}`} className="lg:col-span-7 lg:row-span-2 relative border border-white/10 bg-black overflow-hidden group min-h-[400px] flex flex-col justify-end p-8 hover:border-axim-purple/50 transition-colors">
            {articles[0]._embedded?.['wp:featuredmedia']?.[0]?.source_url && (
               <img src={articles[0]._embedded['wp:featuredmedia'][0].source_url} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700" />
            )}
            {/* Thematic Gradient Reveal */}
            <div className="absolute inset-0 bg-gradient-to-br from-axim-purple/80 via-axim-purple/20 to-transparent z-0 group-hover:opacity-0 transition-opacity duration-700" />
            {/* Persistent Text Protector */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-0" />

            <div className="relative z-10">
              <div className="text-[0.6rem] font-mono text-axim-gold mb-3 uppercase tracking-widest bg-black/50 inline-block px-2 py-1 rounded border border-white/5">Priority Briefing</div>
              <h3 className="text-3xl md:text-4xl font-black text-white mb-3 group-hover:text-axim-purple transition-colors leading-tight line-clamp-3" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(articles[0].title?.rendered || '')}} />
              <div className="text-sm text-zinc-300 line-clamp-2 max-w-xl" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(articles[0].excerpt?.rendered || '')}} />
            </div>
          </a>
        )}

        {/* Article 2: Medium Top Right */}
        {articles[1] && (
          <a href={`/article/${articles[1].slug}`} className="lg:col-span-5 lg:row-span-1 relative border border-white/10 bg-black overflow-hidden group min-h-[220px] flex flex-col justify-end p-6 hover:border-axim-purple/50 transition-colors">
            {articles[1]._embedded?.['wp:featuredmedia']?.[0]?.source_url && (
               <img src={articles[1]._embedded['wp:featuredmedia'][0].source_url} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-80 transition-all duration-700" />
            )}
            <div className="absolute inset-0 bg-gradient-to-bl from-axim-purple/60 via-axim-purple/10 to-transparent z-0 group-hover:opacity-0 transition-opacity duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-0" />

            <div className="relative z-10">
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-axim-purple transition-colors line-clamp-2 leading-snug" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(articles[1].title?.rendered || '')}} />
            </div>
          </a>
        )}

        {/* Article 3: Medium Bottom Right */}
        {articles[2] && (
           <a href={`/article/${articles[2].slug}`} className="lg:col-span-5 lg:row-span-1 relative border border-white/10 bg-black overflow-hidden group min-h-[220px] flex flex-col justify-end p-6 hover:border-axim-purple/50 transition-colors">
            {articles[2]._embedded?.['wp:featuredmedia']?.[0]?.source_url && (
               <img src={articles[2]._embedded['wp:featuredmedia'][0].source_url} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-80 transition-all duration-700" />
            )}
            <div className="absolute inset-0 bg-gradient-to-tl from-axim-purple/60 via-axim-purple/10 to-transparent z-0 group-hover:opacity-0 transition-opacity duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-0" />

            <div className="relative z-10">
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-axim-purple transition-colors line-clamp-2 leading-snug" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(articles[2].title?.rendered || '')}} />
            </div>
          </a>
        )}
      </div>

      {/* Fibonacci Bottom Section */}
      {articles.length > 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {articles.slice(3, 6).map(article => (
            <a key={article.id} href={`/article/${article.slug}`} className="relative block border border-white/10 bg-black overflow-hidden group hover:border-axim-purple/50 transition-colors flex flex-col justify-end p-6 min-h-[180px]">
              {article._embedded?.['wp:featuredmedia']?.[0]?.source_url && (
                 <img src={article._embedded['wp:featuredmedia'][0].source_url} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-60 transition-all duration-700" />
              )}
              <div className="absolute inset-0 bg-axim-purple/40 z-0 group-hover:opacity-0 transition-opacity duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-transparent z-0" />

              <div className="relative z-10">
                <h3 className="text-sm font-bold text-white mb-2 group-hover:text-axim-purple transition-colors line-clamp-2 leading-snug" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(article.title?.rendered || '')}} />
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
