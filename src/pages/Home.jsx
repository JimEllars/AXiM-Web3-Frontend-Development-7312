import React from 'react';
import Hero from '../components/Hero';
import Reviews from '../components/Reviews';
import FeaturedArticles from '../components/FeaturedArticles';
import NewsFeed from '../components/NewsFeed';
import Ecosystem from '../components/Ecosystem';
import SEO from '../components/SEO';

export default function Home() {
  return (
    <>
      <SEO title="Smart Systems | AXiM"
        description="Products and services built to make your life easier without breaking the bank."
       url="https://axim.us.com/"/>
      <div className="bg-void">
        <Hero />
      </div>
      <div className="bg-layered-purple">
        <FeaturedArticles categorySlug="featured" limit={3} />
      </div>
      <div className="bg-layered-purple">
        <NewsFeed categorySlug="article" limit={12} />
      </div>
      <div className="bg-void">
        <Reviews />
        <Ecosystem />
      </div>
    </>
  );
}
