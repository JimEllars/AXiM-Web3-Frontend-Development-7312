import React, { useState, useEffect } from 'react';
import { fetchPosts } from '../lib/wp-fetch';
import ArticleCard from './ArticleCard';
import SafeIcon from '../common/SafeIcon';
import * as LuIcons from 'react-icons/lu';

export default function NewsFeed({ limit = null }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadArticles() {
      try {
        const data = await fetchPosts({ per_page: limit || 12, _embed: 1 });
        setArticles(data || []);
      } catch (err) {
        console.error("Error fetching articles:", err);
        setError("Failed to establish uplink with content database.");
      } finally {
        setLoading(false);
      }
    }
    loadArticles();
  }, [limit]);

  if (loading) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-24 space-y-4">
        <div className="w-8 h-8 border-2 border-axim-purple/30 border-t-axim-purple rounded-full animate-spin"></div>
        <span className="text-[0.65rem] font-mono uppercase tracking-widest text-zinc-500 animate-pulse">Syncing Database...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-12 text-center border border-red-500/20 bg-[#050505] rounded-sm">
        <SafeIcon icon={LuIcons.LuTriangleAlert} className="w-8 h-8 text-red-500 mx-auto mb-3" />
        <p className="text-xs font-mono text-zinc-400 uppercase tracking-widest">{error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article, index) => (
        <ArticleCard key={article.id} article={article} index={index} />
      ))}
    </div>
  );
}
