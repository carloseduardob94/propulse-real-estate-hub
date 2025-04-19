
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HeroSectionProps {
  isAuthenticated: boolean;
  onLoginDemo?: () => void;
}

export const HeroSection = ({ isAuthenticated, onLoginDemo }: HeroSectionProps) => {
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else if (onLoginDemo) {
      onLoginDemo();
    }
  };
  
  return (
    <section className="relative bg-gradient-to-br from-propulse-900 via-propulse-800 to-propulse-700 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="space-y-4">
            <h1 className="text-2xl md:text-3xl font-bold leading-tight">
              Transforme a gestão dos seus imóveis e leads com uma plataforma completa e{' '}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-accent to-accent/70 bg-clip-text text-transparent">
                  inteligente
                </span>
                <Star className="absolute -right-4 -top-2 h-3 w-3 text-accent animate-pulse" />
              </span>
            </h1>
            <p className="text-sm text-propulse-100 leading-relaxed">
              Aumente sua produtividade, organize imóveis, qualifique leads e gere propostas 
              profissionais com agilidade e precisão — tudo isso com a aliada ideal dos 
              corretores e imobiliárias.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              {isAuthenticated ? (
                <Button 
                  size="sm" 
                  className="bg-white text-propulse-700 hover:bg-propulse-50 group"
                  onClick={() => navigate('/dashboard')}
                >
                  Acessar Dashboard
                  <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                </Button>
              ) : (
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-accent via-accent/90 to-accent/80 text-white hover:opacity-90 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-accent/20 font-semibold tracking-wide"
                  onClick={handleGetStarted}
                >
                  Começar agora
                </Button>
              )}
            </div>
          </div>
          <div className="relative md:flex items-center justify-center">
            <div className="relative w-full max-w-md mx-auto">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-propulse-900/30 to-transparent rounded-lg" />
                <img 
                  src="/lovable-uploads/7ece2f19-0cb5-498c-9b2a-6c04541f8182.png"
                  alt="Yzze, seu assistente virtual" 
                  className="w-full h-auto object-contain rounded-lg transform hover:scale-105 transition-transform duration-300 max-h-[300px]"
                />
              </div>
              <div className="absolute -bottom-2 -left-2 bg-white/15 backdrop-blur-lg rounded-lg p-3 border border-white/20">
                <p className="text-sm font-semibold tracking-wide">
                  Conheça Yzze, sua parceira inteligente
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-propulse-600/10 rounded-full blur-3xl" />
      </div>
    </section>
  );
};
