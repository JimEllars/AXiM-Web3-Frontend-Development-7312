import React from 'react';
import Hero from '../components/Hero';
import FeaturedArticles from '../components/FeaturedArticles';
import SpotlightSection from '../components/SpotlightSection';
import CompanyOfferings from '../components/CompanyOfferings';

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedArticles categorySlug="featured" limit={2} />
      <SpotlightSection title="App Spotlight" categorySlug="apps" limit={4} subtitle="Software" />
      <CompanyOfferings />
      <SpotlightSection title="Service Spotlight" categorySlug="services" limit={4} subtitle="Professional" />
      <SpotlightSection title="Course Spotlight" categorySlug="courses" limit={4} subtitle="Education" />
      <SpotlightSection title="Recent Articles" categorySlug="article" limit={4} subtitle="Intelligence Hub" />
    </>
  );
}