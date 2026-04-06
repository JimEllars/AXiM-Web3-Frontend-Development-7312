import React from 'react';
import FeaturedArticles from '../components/FeaturedArticles';
import NewsFeed from '../components/NewsFeed';

export default function Articles() {
  return (
    <div className="w-full relative z-10">
      <div className="max-w-[1200px] mx-auto px-6 pt-20 pb-10">
        <span className="section-label">Intelligence Network</span>
        <h1 className="text-6xl font-black uppercase tracking-tighter mb-6">AXiM Articles</h1>
        <p className="text-zinc-500 max-w-2xl text-lg leading-relaxed">
          Comprehensive insights, updates, and research from the AXiM ecosystem. Explore top stories and deep dives into our core protocols and infrastructure.
        </p>
      </div>

      <FeaturedArticles categorySlug="featured" limit={2} />

      {/* We can use a different slug like 'news' or 'article' here depending on WP setup */}
      <NewsFeed categorySlug="article" limit={24} />
    </div>
  );
}
