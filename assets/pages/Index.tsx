import React from 'react';
import Hero from '../../src/components/Hero';
import About from '../../src/components/about';
import Facilities from '../../src/components/Facilities';
import MapSection from '../../src/components/MapSection';
import Gallery from '../../src/components/Gallery';


const Index = () => {
  return (
    <div className="min-h-screen bg-principal">
      <Hero />
      <About />
      <Facilities />
      <Gallery />
      <MapSection />
    </div>
  );
};

export default Index;