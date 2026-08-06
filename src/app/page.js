'use client';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import OffersSection from '@/components/OffersSection';
import SolarWaterSection from '@/components/SolarWaterSection';
import HomeRenovationSection from '@/components/HomeRenovationSection';
import EssentialServicesSection from '@/components/EssentialServicesSection';
import MostBookedSection from '@/components/MostBookedSection';
import ServiceBanners from '@/components/ServiceBanners';
import WhyChoose from '@/components/WhyChoose';
import Footer from '@/components/Footer';
import { useState } from 'react';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="app">
      <Header />
      <Hero searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <OffersSection />
      <SolarWaterSection />
      <HomeRenovationSection />
      <EssentialServicesSection />
      <MostBookedSection />
      <ServiceBanners />
      <WhyChoose />
      <Footer />
    </div>
  );
}