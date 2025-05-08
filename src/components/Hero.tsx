import React from 'react';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center bg-principal pt-16">
      <div 
        className="absolute inset-0 bg-gradient-to-r from-home/10 to-home/5 z-0"
      />
      
      <div className="section-container relative z-10 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-main mb-4 md:mb-6 leading-tight">
            Conheça a Infraestrutura da <span className="text-home">PEI Barão de Jundiaí</span>
          </h1>
          <p className="text-lg md:text-xl text-body-color mb-8 max-w-lg">
            Uma escola de referência com instalações modernas e ambiente propício para aprendizagem e desenvolvimento integral dos alunos.
          </p>
          <div className="flex flex-wrap gap-4">
          </div>
        </div>
        
        <div className="md:w-1/2 md:pl-8">
          <div className="rounded-lg overflow-hidden shadow-xl w-full h-80 md:h-96">
            <img 
              src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="Fachada da Escola PEI Barão de Jundiaí"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 hidden md:block animate-bounce">
      </div>
    </section>
  );
};

// Arrow Down SVG component
const ArrowDown = () => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className="feather feather-chevron-down"
  >
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

export default Hero;