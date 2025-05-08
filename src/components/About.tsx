import React from 'react';
import { Building, Info, MapPin } from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="py-20 bg-bloco">
      <div className="section-container">
        <h2 className="section-title">Sobre a Escola</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-home/10 text-home rounded-md">
                <Building size={24} />
              </div>
              <h3 className="text-xl font-semibold ml-4">Nossa História</h3>
            </div>
            <p className="text-body-color">
              Fundada em 1953, a Escola Estadual Barão de Jundiaí tem uma longa trajetória de excelência no ensino. Em 2021, 
              passou a integrar o Programa de Ensino Integral (PEI), oferecendo educação em tempo integral para nossos alunos.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-home/10 text-home rounded-md">
                <Info size={24} />
              </div>
              <h3 className="text-xl font-semibold ml-4">Nossa Missão</h3>
            </div>
            <p className="text-body-color">
              A PEI Barão de Jundiaí tem como missão formar cidadãos críticos e preparados para os desafios do século XXI, 
              por meio de uma educação integral que valoriza tanto o conhecimento acadêmico como o desenvolvimento socioemocional.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-home/10 text-home rounded-md">
                <MapPin size={24} />
              </div>
              <h3 className="text-xl font-semibold ml-4">Localização</h3>
            </div>
            <p className="text-body-color">
              Estrategicamente localizada na região central de Jundiaí, nossa escola é de fácil acesso por transporte 
              público e oferece uma estrutura completa para atender as necessidades pedagógicas dos alunos.
            </p>
          </div>
        </div>
        
        <div className="mt-12 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-bold mb-4 text-main">Programa de Ensino Integral (PEI)</h3>
          <p className="mb-4">
            O Programa de Ensino Integral (PEI) representa uma importante política educacional do Estado de São Paulo, 
            oferecendo aos estudantes uma jornada ampliada com currículo integrado, permitindo:
          </p>
          
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {[
              "Jornada de estudos completa, das 7h30 às 16h30",
              "Disciplinas da Base Nacional Comum Curricular",
              "Projeto de Vida como centro da proposta pedagógica",
              "Tutoria para acompanhamento individualizado",
              "Clubes Juvenis e eletivas diversificadas",
              "Tecnologia e Inovação como componente curricular",
              "Protagonismo estudantil e desenvolvimento socioemocional",
              "Infraestrutura adaptada para permanência em tempo integral"
            ].map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="text-home mr-2 mt-1 flex-shrink-0">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default About;