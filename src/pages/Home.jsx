import React from 'react';
import Hero from '../components/Hero';
import Reviews from '../components/Reviews';
import FeaturedArticles from '../components/FeaturedArticles';
import NewsFeed from '../components/NewsFeed';
import Ecosystem from '../components/Ecosystem';
import SEO from '../components/SEO';
import PartnerPromo from '../components/PartnerPromo';
import ProactiveBanner from '../components/ProactiveBanner';
import EngagementGuard from '../components/EngagementGuard';

export default function Home() {
  return (
    <>
      <SEO title="Smart Systems | AXiM"
        description="Products and services built to make your life easier without breaking the bank."
       url="https://axim.us.com/"/>
      <div className="w-full">
        <Hero />

        {/* 1. Featured Category */}
        <FeaturedArticles title="Featured" categorySlug="featured" limit={6} />

        {/* 2. Partner Break: Make */}
        <PartnerPromo
          partnerName="Make.com"
          title="Scale Your Systems With Visual Automation"
          description="Connect your apps and automate your workflows without writing a single line of code. Leverage the backend engine that powers AXiM."
          learnMorePath="/partners/make"
          startNowUrl="https://www.make.com/en/register?pc=aximpartner"
          theme="purple"
        />

        {/* 3. Spotlight Category */}
        <FeaturedArticles title="Software Spotlight" categorySlug="app-spotlight" limit={6} />

        {/* 4. Partner Break: Powur */}
        <PartnerPromo
          partnerName="Powur Solar"
          title="Decentralize Your Home's Energy Grid"
          description="Stop overpaying for grid power. Transition to clean, Tier-1 residential solar with zero-down financing and take ownership of your energy production."
          learnMorePath="/partners/powur-solar"
          startNowUrl="https://powur.com/axim/solar"
          theme="gold"
        />

        {/* 5. The Firehose */}
        <NewsFeed limit={12} />

        <ProactiveBanner />
        <EngagementGuard />
        <Ecosystem />
        <Reviews />
      </div>
    </>
  );
}
