import React from "react";
import HeroSection from "../components/HeroSection";
import DealsAndOffers from "../components/DealsAndOffers";
import ConsumerElectronicsSection from "../components/ConsumerElectronicsSection";
import HomeOutdoorSection from "../components/HomeOutdoorSection";
import SupplierInquirySection from "../components/SupplierInquirySection";
import RecommendedItems from "../components/RecommendedItems";
import ExtraServices from "../components/ExtraServices";


const HomePage = () => {
  return (
    <div>
      <HeroSection />
      <DealsAndOffers />
      <ConsumerElectronicsSection />
      <HomeOutdoorSection/>
      <SupplierInquirySection />
      <RecommendedItems />
      <ExtraServices />
    </div>
  );
};

export default HomePage;
