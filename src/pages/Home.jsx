import React from 'react';
import Hero from '../components/Hero';
import FeaturedArticles from '../components/FeaturedArticles';
import NewsFeed from '../components/NewsFeed';
import Ecosystem from '../components/Ecosystem';
import SEO from '../components/SEO';

export default function Home() {
  return (
    <>
      <SEO
        title="Smart Business Systems"
        description="AXiM Systems delivers smart protocol integrations, web3 interfaces, and intelligent business ecosystems."
      />
      <Hero />
      <FeaturedArticles categorySlug="featured" limit={3} />
      <NewsFeed categorySlug="article" limit={12} />
      <Ecosystem />
    </>
  );
}