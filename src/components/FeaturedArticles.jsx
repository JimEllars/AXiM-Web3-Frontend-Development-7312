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

  const heroArticle = articles[0];
  const gridArticles = articles.slice(1);

  return (
    <div className="w-full max-w-7xl mx-auto py-12 px-6">
      <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter mb-8 flex items-center gap-3 border-b border-white/10 pb-4">
        <div className="w-2 h-2 bg-axim-purple rounded-full animate-pulse" />
        {title}
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Hero Article */}
        <a href={`/article/${heroArticle.slug}`} className="lg:col-span-8 block group relative overflow-hidden border border-white/10 bg-black min-h-[400px] flex flex-col justify-end p-8 md:p-12 hover:border-axim-purple/50 transition-colors">
          {heroArticle._embedded?.['wp:featuredmedia']?.[0]?.source_url && (
             <img src={heroArticle._embedded['wp:featuredmedia'][0].source_url} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-50 group-hover:scale-105 transition-all duration-700" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-0" />
          <div className="relative z-10">
            <div className="text-[0.65rem] font-mono text-axim-gold mb-4 uppercase tracking-widest">Priority Briefing</div>
            <h3 className="text-3xl md:text-5xl font-black text-white mb-4 group-hover:text-axim-purple transition-colors leading-tight" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(heroArticle.title?.rendered || '')}} />
            <div className="text-sm text-zinc-400 line-clamp-2 md:line-clamp-3 mb-6 max-w-2xl" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(heroArticle.excerpt?.rendered || '')}} />
            <span className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">Read Report <span className="group-hover:translate-x-2 transition-transform">→</span></span>
          </div>
        </a>

        {/* Secondary Grid */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {gridArticles.map(article => (
            <a key={article.id} href={`/article/${article.slug}`} className="block border border-white/10 bg-black/50 p-6 group hover:border-axim-purple/50 transition-colors flex-1 flex flex-col justify-center">
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-axim-purple transition-colors line-clamp-2 leading-snug" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(article.title?.rendered || '')}} />
              <div className="text-xs text-zinc-500 line-clamp-2" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(article.excerpt?.rendered || '')}} />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
