import React, { useState, useEffect } from 'react';
import DOMPurify from 'isomorphic-dompurify';
import WPImage from './WPImage';
import { fetchPosts, fetchCategoryBySlug } from '../lib/wp-fetch';
import ArticleCard from './ArticleCard';

export default function FeaturedArticles({ title = "Featured Articles", categorySlug = "featured", limit = 6, excludeIds = [] }) {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadArticles = async () => {
      setIsLoading(true);
      try {
        const categoryId = await fetchCategoryBySlug(categorySlug);
        const params = { per_page: limit };
        if (categoryId) params.categories = categoryId;

        // API-Level Exclusion: If IDs are supplied to prevent overlap, append them to the request parameters
        if (excludeIds && excludeIds.length > 0) {
          params.exclude = excludeIds.join(',');
        }

        const data = await fetchPosts(params);
        if (isMounted) {
          setArticles(data || []);
          setIsLoading(false);
        }
      } catch (error) {
        console.error(`[WP_FEATURED] Query failed for slug: ${categorySlug}`, error);
        if (isMounted) setIsLoading(false);
      }
    };

    loadArticles();
    return () => { isMounted = false; };
  }, [categorySlug, limit, JSON.stringify(excludeIds)]);

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto py-16 px-6">
        <div className="w-48 h-8 bg-white/5 rounded animate-pulse mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="min-h-[300px] bg-[#050505] border border-white/5 rounded animate-pulse" />
          <div className="min-h-[300px] bg-[#050505] border border-white/5 rounded animate-pulse" />
          <div className="min-h-[300px] bg-[#050505] border border-white/5 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (!articles || articles.length === 0) return null;

  return (
    <div className="w-full max-w-7xl mx-auto py-16 px-6">
      <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter mb-8 flex items-center gap-3 border-b border-white/10 pb-4">
        <div className="w-2 h-2 bg-axim-purple rounded-full animate-pulse" />
        {title}
      </h2>

      {/* Primary Fibonacci 1+2 Layout Matrix Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 lg:grid-rows-2 gap-4 mb-4">
        {articles[0] && (
          <div className="lg:col-span-7 lg:row-span-2 w-full">
            <ArticleCard article={articles[0]} isHero={true} />
          </div>
        )}
        {articles[1] && (
          <div className="lg:col-span-5 lg:row-span-1 w-full">
            <ArticleCard article={articles[1]} />
          </div>
        )}
        {articles[2] && (
          <div className="lg:col-span-5 lg:row-span-1 w-full">
            <ArticleCard article={articles[2]} />
          </div>
        )}
      </div>

      {/* Secondary Companion Row */}
      {articles.length > 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {articles.slice(3, 6).map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
