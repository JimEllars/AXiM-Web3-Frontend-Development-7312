import React, { useState, useEffect } from 'react';
import DOMPurify from 'isomorphic-dompurify';
import WPImage from './WPImage';
import { fetchPosts, fetchCategoryBySlug } from '../lib/wp-fetch';
import ArticleCard from './ArticleCard';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';

export default function FeaturedArticles({ title = "Featured Articles", categorySlug = "featured", limit = 6, excludeIds = [], excludeCategories = [] }) {
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

        // Post ID Exclusion
        if (excludeIds && excludeIds.length > 0) {
          params.exclude = excludeIds.join(',');
        }

        // Strict Category Exclusion (Prevents Feed Bleed)
        if (excludeCategories && excludeCategories.length > 0) {
          params.categories_exclude = excludeCategories.join(',');
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
  }, [categorySlug, limit, JSON.stringify(excludeIds), JSON.stringify(excludeCategories)]);

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

      {/* Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {articles
          .filter(article => article && article.title && article.title.rendered) // Defensive Null Check
          .slice(0, 3) // Ensure max of 3 are rendered
          .map((article, index) => (
            <ArticleCard key={article.id || index} article={article} index={index} priority={index === 0} />
        ))}
      </div>
    </div>
  );
}
