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

      {/* Fibonacci Top Section: 1 Massive, 2 Medium */}
      <div className="grid grid-cols-1 lg:grid-cols-12 lg:grid-rows-2 gap-4 mb-4">
        {/* Article 1: Massive Hero */}
        {articles[0] && (
          <a href={`/article/${articles[0].slug}`} className="lg:col-span-8 lg:row-span-2 relative border border-white/10 bg-black overflow-hidden group min-h-[400px] flex flex-col justify-end p-8 hover:border-axim-purple/50 transition-colors">
            {articles[0]._embedded?.['wp:featuredmedia']?.[0]?.source_url && (
               <img src={articles[0]._embedded['wp:featuredmedia'][0].source_url} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-0" />
            <div className="relative z-10">
              <div className="text-[0.6rem] font-mono text-axim-gold mb-3 uppercase tracking-widest bg-black/50 inline-block px-2 py-1 rounded">Priority Briefing</div>
              <h3 className="text-3xl md:text-4xl font-black text-white mb-3 group-hover:text-axim-purple transition-colors leading-tight line-clamp-3" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(articles[0].title?.rendered || '')}} />
              <div className="text-sm text-zinc-400 line-clamp-2 max-w-2xl" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(articles[0].excerpt?.rendered || '')}} />
            </div>
          </a>
        )}

        {/* Article 2: Medium Top Right */}
        {articles[1] && (
          <a href={`/article/${articles[1].slug}`} className="lg:col-span-4 lg:row-span-1 relative border border-white/10 bg-black overflow-hidden group min-h-[200px] flex flex-col justify-end p-6 hover:border-axim-purple/50 transition-colors">
            {articles[1]._embedded?.['wp:featuredmedia']?.[0]?.source_url && (
               <img src={articles[1]._embedded['wp:featuredmedia'][0].source_url} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-40 transition-all duration-700" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-0" />
            <div className="relative z-10">
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-axim-purple transition-colors line-clamp-2 leading-snug" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(articles[1].title?.rendered || '')}} />
            </div>
          </a>
        )}

        {/* Article 3: Medium Bottom Right */}
        {articles[2] && (
           <a href={`/article/${articles[2].slug}`} className="lg:col-span-4 lg:row-span-1 relative border border-white/10 bg-black overflow-hidden group min-h-[200px] flex flex-col justify-end p-6 hover:border-axim-purple/50 transition-colors">
            {articles[2]._embedded?.['wp:featuredmedia']?.[0]?.source_url && (
               <img src={articles[2]._embedded['wp:featuredmedia'][0].source_url} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-40 transition-all duration-700" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-0" />
            <div className="relative z-10">
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-axim-purple transition-colors line-clamp-2 leading-snug" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(articles[2].title?.rendered || '')}} />
            </div>
          </a>
        )}
      </div>

      {/* Fibonacci Bottom Section: 3 Small Articles */}
      {articles.length > 3 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {articles.slice(3, 6).map(article => (
            <a key={article.id} href={`/article/${article.slug}`} className="block border border-white/10 bg-white/5 p-6 group hover:border-axim-purple/50 transition-colors flex flex-col justify-center min-h-[140px]">
              <h3 className="text-sm font-bold text-white mb-2 group-hover:text-axim-purple transition-colors line-clamp-2 leading-snug" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(article.title?.rendered || '')}} />
              <div className="text-xs text-zinc-500 line-clamp-2" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(article.excerpt?.rendered || '')}} />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
