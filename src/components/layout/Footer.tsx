
import React from 'react';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">MeuCorretorPRO</h3>
            <p className="text-gray-400">
              Transformando a gestão imobiliária com tecnologia e praticidade.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-4">Recursos</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Imóveis</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Leads</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Propostas</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Planos</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-4">Empresa</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Sobre nós</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Contato</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Carreiras</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Termos de Uso</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Privacidade</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Cookies</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} MeuCorretorPRO. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

