import React from 'react';
import { HeroSection } from '../components/Home/HeroSection';
import { FeaturedItems } from '../components/Home/FeaturedItems';

export function HomePage() {
  return (
    <div>
      <HeroSection />
      <FeaturedItems />
    </div>
  );
}