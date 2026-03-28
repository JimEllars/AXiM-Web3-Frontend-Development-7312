import React from 'react';
import Hero from '../components/Hero';
import Pillars from '../components/Pillars';
import Deployment from '../components/Deployment';
import Marquee from '../components/Marquee';
import IntelligenceHub from '../components/IntelligenceHub';

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <Pillars />
      <Deployment />
      <IntelligenceHub />
    </>
  );
}