import React, { useState } from 'react';
import { Check } from 'lucide-react';

const facilities = [
  {
    id: 'classrooms',
    title: 'Salas de Aula',
    description: 'Nossas salas de aula são equipadas com projetores, ar-condicionado e mobiliário ergonômico para garantir o conforto e aprendizado dos alunos.',
    features: [
      'Equipadas com tecnologia audiovisual',
      'Iluminação natural ampla',
      'Capacidade para 35 alunos',
      'Climatizadas e ventiladas'
    ],
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'library',
    title: 'Biblioteca',
    description: 'Nossa biblioteca possui um acervo com mais de 10 mil títulos, espaço para estudos individuais e em grupo, além de computadores para pesquisa.',
    features: [
      'Acervo digital e físico',
      'Salas de estudo em grupo',
      'Ambiente tranquilo para leitura',
      'Wi-Fi de alta velocidade'
    ],
    image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'lab',
    title: 'Laboratórios',
    description: 'Contamos com laboratórios de ciências, física, química e biologia, todos equipados com materiais necessários para aulas práticas e experimentos.',
    features: [
      'Equipamentos modernos',
      'Bancadas para trabalho em grupo',
      'Materiais para experimentos',
      'Supervisão especializada'
    ],
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'tech',
    title: 'Lab. de Informática',
    description: 'Nosso laboratório de informática possui computadores de última geração, softwares educacionais e acesso à internet para atividades pedagógicas.',
    features: [
      'Computadores modernos',
      'Softwares educacionais',
      'Internet de alta velocidade',
      'Suporte técnico disponível'
    ],
    image: 'https://images.unsplash.com/photo-1581472723648-909f4851d4ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'sports',
    title: 'Área Esportiva',
    description: 'Nossa infraestrutura esportiva inclui quadra poliesportiva coberta, campo de futebol, vestiários e materiais para diversas modalidades esportivas.',
    features: [
      'Quadra poliesportiva coberta',
      'Campo de futebol',
      'Vestiários completos',
      'Equipamentos esportivos diversos'
    ],
    image: 'https://images.unsplash.com/photo-1527871369852-eb58cb2b54e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'refectory',
    title: 'Refeitório',
    description: 'Nosso refeitório amplo e arejado oferece alimentação balanceada e nutritiva para todos os estudantes durante o período integral.',
    features: [
      'Refeições balanceadas e nutritivas',
      'Ambiente amplo e arejado',
      'Capacidade para 200 alunos',
      'Equipe de nutrição especializada'
    ],
    image: 'https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
];

const Facilities = () => {
  const [selectedFacility, setSelectedFacility] = useState(facilities[0].id);

  const currentFacility = facilities.find(f => f.id === selectedFacility) || facilities[0];

  return (
    <section id="facilities" className="py-20 bg-principal">
      <div className="section-container">
        <h2 className="section-title">Nossas Instalações</h2>
        
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold mb-4">Explore Nossa Estrutura</h3>
              <p className="text-body-color mb-6">
                A PEI Barão de Jundiaí oferece instalações modernas e completas para proporcionar o melhor ambiente 
                de aprendizagem aos nossos estudantes.
              </p>
              
              <div className="space-y-2">
                {facilities.map((facility) => (
                  <button
                    key={facility.id}
                    onClick={() => setSelectedFacility(facility.id)}
                    className={`w-full text-left p-3 rounded transition-colors ${
                      selectedFacility === facility.id
                        ? 'bg-home text-white'
                        : 'hover:bg-bloco'
                    }`}
                  >
                    {facility.title}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden h-full">
              <div className="h-64 relative">
                <img
                  src={currentFacility.image}
                  alt={currentFacility.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                  <h3 className="text-2xl font-bold text-white p-6">
                    {currentFacility.title}
                  </h3>
                </div>
              </div>
              
              <div className="p-6">
                <p className="text-body-color mb-6">
                  {currentFacility.description}
                </p>
                
                <h4 className="text-lg font-semibold mb-3">Características:</h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {currentFacility.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check size={16} className="text-home mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Facilities;