import React, { useState } from 'react';
// import { useParams } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import HeroSection from '../../features/home/HeroSection';
import FeaturedItems from '../../features/home/FeaturedItems';
import OutletSelector from '../../components/layout/OutletSelector';
import { useOutlet } from '../../context/OutletContextValues';

const Home = () => {
  const { selectedOutlet, isLoading } = useOutlet();

  const [showSelector, setShowSelector] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-primary">Loading menu...</div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {(!selectedOutlet || showSelector) && <OutletSelector onClose={() => setShowSelector(false)} />}

      <Navbar onOpenOutletSelector={() => setShowSelector(true)} />
      <main className="grow">
        <HeroSection />
        <FeaturedItems outletId={selectedOutlet?._id} />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
