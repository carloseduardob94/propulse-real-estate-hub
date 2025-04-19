
import React from 'react';
import { Check } from "lucide-react";

export const FeaturesSection = () => {
  return (
    <section id="features" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Funcionalidades</h2>
          <p className="text-muted-foreground mt-2">
            Tudo o que você precisa para gerenciar seus negócios imobiliários
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h3 className="text-2xl font-bold mb-4">Gestor de Leads com Qualificação Automática</h3>
            <ul className="space-y-4">
              <FeatureItem 
                title="Captura manual e automatizada"
                description="Registre leads diretamente ou capture via formulários no seu site"
              />
              <FeatureItem 
                title="Qualificação automática"
                description="Qualificação baseada em critérios como orçamento e localização"
              />
              <FeatureItem 
                title="Sistema de priorização (Lead Scoring)"
                description="Destaque automático para os leads mais promissores"
              />
            </ul>
          </div>
          <div>
            <img 
              src="https://images.unsplash.com/photo-1581092160607-a9d0decec9c8?w=800&auto=format&fit=crop" 
              alt="Leads management" 
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mt-20">
          <div className="order-2 md:order-1">
            <img 
              src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&auto=format&fit=crop" 
              alt="Proposal generation" 
              className="rounded-lg shadow-lg"
            />
          </div>
          <div className="order-1 md:order-2">
            <h3 className="text-2xl font-bold mb-4">Gerador de Propostas Personalizadas</h3>
            <ul className="space-y-4">
              <FeatureItem 
                title="Propostas profissionais"
                description="Crie propostas visuais com imóveis recomendados"
              />
              <FeatureItem 
                title="Personalização da marca"
                description="Adicione seu nome, logo e informações de contato"
              />
              <FeatureItem 
                title="Exportação em PDF"
                description="Exporte as propostas em PDF ou compartilhe via link"
              />
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

interface FeatureItemProps {
  title: string;
  description: string;
}

const FeatureItem = ({ title, description }: FeatureItemProps) => (
  <li className="flex items-start">
    <div className="rounded-full bg-success-100 p-1 mr-3 mt-1">
      <Check className="h-4 w-4 text-success-600" />
    </div>
    <div>
      <p className="font-medium">{title}</p>
      <p className="text-muted-foreground">{description}</p>
    </div>
  </li>
);
