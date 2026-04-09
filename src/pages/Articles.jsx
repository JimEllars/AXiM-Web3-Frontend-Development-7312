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

      {/* 1. Main Featured Section */}
      <FeaturedArticles categorySlug="featured" limit={2} title="Featured Intelligence" />

      {/* 2. App Spotlight Section */}
      <NewsFeed categorySlug="app-spotlight" limit={6} title="App Spotlight" />

      {/* 3. Software Spotlight Section */}
      <NewsFeed categorySlug="software-spotlight" limit={6} title="Software Spotlight" />
    </div>
  );
}
