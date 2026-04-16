import React from 'react';
import { Link } from 'react-router-dom';
import * as LuIcons from 'react-icons/lu';
import SafeIcon from '../common/SafeIcon';
import FeaturedArticles from '../components/FeaturedArticles';
import NewsFeed from '../components/NewsFeed';
import SEO from '../components/SEO';

export default function Articles() {
  return (
    <div className="w-full relative z-10">
      <SEO
        title="Intelligence Network"
        description="Comprehensive insights, updates, and research from the AXiM ecosystem."
      />
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

      {/* 4. Tools Widget */}
      <section className="py-16 relative z-10 border-t border-subtle mt-16 bg-glass">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <div className="w-16 h-16 bg-axim-gold/10 rounded-full flex items-center justify-center mx-auto mb-6 text-axim-gold border border-axim-gold/30">
            <SafeIcon icon={LuIcons.LuWrench} className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-black uppercase mb-4 text-white">Explore AXiM Tools</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto mb-8">
            Access our suite of powerful applications, document generators, and smart protocols designed to streamline your business operations.
          </p>
          <Link to="/tools" className="btn btn-primary inline-flex">
            View All Tools <SafeIcon icon={LuIcons.LuArrowRight} />
          </Link>
        </div>
      </section>
    </div>
  );
}
