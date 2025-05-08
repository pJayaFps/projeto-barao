import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';

const MapSection = () => {
  return (
    <section id="map" className="py-20 bg-principal">
      <div className="section-container">
        <h2 className="section-title">Localização</h2>
        
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold mb-4 text-main">Informações de Contato</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="p-2 bg-home/10 text-home rounded-md mr-4 mt-1">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-main">Endereço</h4>
                    <p className="mt-1 text-body-color">
                      Rua João Batista Curado, 1250<br />
                      Centro, Jundiaí - SP<br />
                      CEP: 13201-560
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="p-2 bg-home/10 text-home rounded-md mr-4 mt-1">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-main">Telefone</h4>
                    <p className="mt-1 text-body-color">
                      (11) 4587-1245<br />
                      (11) 4587-1246
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="p-2 bg-home/10 text-home rounded-md mr-4 mt-1">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-main">Email</h4>
                    <p className="mt-1 text-body-color">
                      contato@eebaraojundiai.sp.gov.br<br />
                      secretaria@eebaraojundiai.sp.gov.br
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-bloco rounded-lg">
                <h4 className="font-medium text-main mb-2">Horário de Funcionamento</h4>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span>Segunda a Sexta:</span>
                    <span>7:00 - 17:00</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Secretaria:</span>
                    <span>8:00 - 16:00</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Sábados e Domingos:</span>
                    <span>Fechado</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden h-full">
              <div className="aspect-w-16 aspect-h-9 h-full">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3669.7325572250374!2d-46.88329!3d-23.1095!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cf2a9f05c10461%3A0x3d6a61b4240de1c7!2sEscola%20Estadual%20Bar%C3%A3o%20de%20Jundia%C3%AD!5e0!3m2!1spt-BR!2sbr!4v1588527755071!5m2!1spt-BR!2sbr"
                  className="w-full h-full border-0" 
                  allowFullScreen={true} 
                  loading="lazy"
                  title="Mapa da localização da Escola PEI Barão de Jundiaí"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-4 text-main">Como Chegar</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-main mb-2">De Ônibus</h4>
              <p className="text-body-color">
                A escola é atendida por diversas linhas de ônibus municipais. 
                Os pontos mais próximos estão localizados na Av. Principal e na Rua João Batista Curado.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-main mb-2">De Carro</h4>
              <p className="text-body-color">
                Acesso fácil pela Rodovia Anhanguera e pela Via Expressa. 
                A escola possui estacionamento para professores e área de embarque/desembarque para alunos.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-main mb-2">A Pé</h4>
              <p className="text-body-color">
                A escola está localizada a 10 minutos a pé do centro da cidade e a 15 minutos 
                da estação de trem, oferecendo fácil acesso para pedestres.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapSection;