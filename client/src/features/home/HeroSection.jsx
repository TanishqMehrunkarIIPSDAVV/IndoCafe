import React from 'react';
import { Button } from '../../components/ui/button';

const HeroSection = () => {
  return (
    <div className="relative h-screen min-h-[600px] flex items-center justify-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop"
          alt="Restaurant Interior"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Authentic Indonesian Flavors <br />
          <span className="text-primary">Modern Dining Experience</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
          Experience the rich heritage of Indonesian cuisine with our exquisite menu selection.
        </p>
        <div className="flex justify-center">
          <Button variant="primary" className="text-lg px-8 py-3">
            Order Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
