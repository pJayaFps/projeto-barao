import React, { useState } from 'react';
import { X } from 'lucide-react';

const images = [
  {
    src: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    alt: 'Fachada da Escola',
    category: 'exterior'
  },
  {
    src: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    alt: 'Sala de Aula Moderna',
    category: 'interior'
  },
  {
    src: 'https://images.unsplash.com/photo-1570975640108-5b13a5c3f919?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    alt: 'Laboratório de Ciências',
    category: 'laboratorios'
  },
  {
    src: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    alt: 'Biblioteca',
    category: 'interior'
  },
  {
    src: 'https://images.unsplash.com/photo-1533956071364-c8d8b8ff3694?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    alt: 'Quadra Poliesportiva',
    category: 'esporte'
  },
  {
    src: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    alt: 'Laboratório de Informática',
    category: 'laboratorios'
  },
  {
    src: 'https://images.unsplash.com/photo-1588072432836-e10032774350?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    alt: 'Área de Convivência',
    category: 'exterior'
  },
  {
    src: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    alt: 'Refeitório',
    category: 'interior'
  },
];

const categories = [
  { id: 'all', name: 'Todas' },
  { id: 'interior', name: 'Interiores' },
  { id: 'exterior', name: 'Exteriores' },
  { id: 'laboratorios', name: 'Laboratórios' },
  { id: 'esporte', name: 'Esportes' },
];

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [modal, setModal] = useState({ isOpen: false, imgIndex: 0 });

  const filteredImages = selectedCategory === 'all' 
    ? images 
    : images.filter(img => img.category === selectedCategory);

  const openModal = (index: number) => {
    setModal({ isOpen: true, imgIndex: index });
  };

  const closeModal = () => {
    setModal({ isOpen: false, imgIndex: 0 });
  
  };

  const nextImage = () => {
    setModal(prev => ({
      ...prev,
      imgIndex: (prev.imgIndex + 1) % filteredImages.length
    }));
  };

  const prevImage = () => {
    setModal(prev => ({
      ...prev,
      imgIndex: (prev.imgIndex - 1 + filteredImages.length) % filteredImages.length
    }));
  };

  return (
    <section id="gallery" className="py-20 bg-bloco">
      <div className="section-container">
        <h2 className="section-title">Galeria de Fotos</h2>
        
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mt-8">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full transition-colors ${
                selectedCategory === category.id
                  ? 'bg-home text-white'
                  : 'bg-white hover:bg-gray-100'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
        
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredImages.map((img, index) => (
            <div 
              key={index} 
              className="overflow-hidden rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => openModal(index)}
            >
              <div className="aspect-w-4 aspect-h-3 relative">
                <img 
                  src={img.src} 
                  alt={img.alt}
                  className="object-cover w-full h-56 hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity flex items-end">
                  <p className="text-white m-3 text-sm">{img.alt}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Image Modal */}
        {modal.isOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 text-white hover:text-gray-300 focus:outline-none"
            >
              <X size={24} />
            </button>
            
            <div className="relative max-w-4xl max-h-[90vh] w-full">
              <img 
                src={filteredImages[modal.imgIndex].src} 
                alt={filteredImages[modal.imgIndex].alt}
                className="w-full h-auto max-h-[90vh] object-contain"
              />
              
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
                <p className="text-center">{filteredImages[modal.imgIndex].alt}</p>
              </div>
              
              <button 
                onClick={prevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
              >
                <ArrowLeft />
              </button>
              
              <button 
                onClick={nextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
              >
                <ArrowRight />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

// Arrow SVG components
const ArrowLeft = () => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

const ArrowRight = () => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

export default Gallery;