import React from 'react';
import HeroSearch from '@/components/home/HeroSearch';
import PartnersSection from '@/components/home/PartnersSection';
import ServicesSection from '@/components/home/ServicesSection';
import PopularRoutes from '@/components/home/PopularRoutes';
import AboutSection from '@/components/home/AboutSection';
import MissionSection from '@/components/home/MissionSection';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Search with Bus Fleet background matching Image 1 */}
      <HeroSearch />

      {/* 2. Empowering Success Through Trusted Partnerships */}
      <PartnersSection />

      {/* 3. Our Services - What We Provide matching Image 2 */}
      <ServicesSection />

      {/* 4. Our Routes matching Image 2 */}
      <PopularRoutes />

      {/* 5. About Us - Simplifying Bus Ticket Booking matching Image 3 */}
      <AboutSection />

      {/* 6. Mission, Vision & Values matching Image 3 */}
      <MissionSection />
    </div>
  );
}
