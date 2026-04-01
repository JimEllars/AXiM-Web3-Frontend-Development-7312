import React from 'react';
import FeaturedArticles from '../components/FeaturedArticles';
import NewsFeed from '../components/NewsFeed';
import { Feedback } from '@questlabs/react-sdk';

const FEEDBACK_THEME = {
  Form: {
    backgroundColor: '#0a0a0a',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '2px',
    padding: '24px'
  },
  Heading: {
    color: '#ffffff',
    fontSize: '18px',
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  Description: {
    color: '#a1a1aa',
    fontSize: '13px'
  },
  PrimaryButton: {
    backgroundColor: '#FFEA00',
    color: '#000000',
    fontWeight: 'bold',
    borderRadius: '2px',
    textTransform: 'uppercase'
  },
  listHover: {
    background: 'rgba(255, 255, 255, 0.05)',
    iconBackground: '#FFEA00',
    iconColor: '#000000',
    Heading: '#ffffff',
    Description: '#a1a1aa',
    Icon: { color: '#FFEA00' },
    defaultIconBackground: 'rgba(255, 255, 255, 0.03)'
  }
};

export default function Articles() {
  // Use import.meta.env in Vite, fallback to process.env for Node.js tests
  const token = import.meta.env ? import.meta.env.VITE_QUEST_TOKEN : process.env.VITE_QUEST_TOKEN;

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

      {/* User Feedback Section */}
      <div className="max-w-[1200px] mx-auto px-6 pb-20">
        <div className="pt-12 border-t border-white/5">
          <Feedback
            questId="axim-intelligence-feedback"
            userId="user_123"
            token={token || ''}
            styleConfig={FEEDBACK_THEME}
          />
        </div>
      </div>
    </div>
  );
}
