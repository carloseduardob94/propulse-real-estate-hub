
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";

interface HeroSectionProps {
  isAuthenticated: boolean;
  onLoginDemo: () => void;
}

export const HeroSection = ({ isAuthenticated, onLoginDemo }: HeroSectionProps) => {
  return (
    <section className="relative bg-gradient-to-br from-propulse-900 via-propulse-800 to-propulse-700 text-white py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Transforme a gestão dos seus imóveis e leads com uma plataforma completa e{' '}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-accent to-accent/70 bg-clip-text text-transparent">
                  inteligente
                </span>
                <Star className="absolute -right-7 -top-4 h-5 w-5 text-accent animate-pulse" />
              </span>
            </h1>
            <p className="text-xl text-propulse-100 leading-relaxed">
              Aumente sua produtividade, organize imóveis, qualifique leads e gere propostas 
              profissionais com agilidade e precisão — tudo isso com a aliada ideal dos 
              corretores e imobiliárias.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {isAuthenticated ? (
                <Button 
                  size="lg" 
                  className="bg-white text-propulse-700 hover:bg-propulse-50 group"
                  asChild
                >
                  <a href="/dashboard">
                    Acessar Dashboard
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </a>
                </Button>
              ) : (
                <Button 
                  size="lg" 
                  className="bg-white text-propulse-700 hover:bg-propulse-50"
                  onClick={onLoginDemo}
                >
                  Começar agora
                </Button>
              )}
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10"
                asChild
              >
                <a href="#features">Saiba mais</a>
              </Button>
            </div>
          </div>
          <div className="relative hidden md:block">
            <div className="absolute -right-8 w-full max-w-xl">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-propulse-900/30 to-transparent rounded-lg" />
                <img 
                  src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80" 
                  alt="Yzze, seu assistente virtual" 
                  className="w-full h-auto rounded-lg shadow-2xl transform hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20">
                <p className="text-sm font-medium">
                  Conheça Yzze, sua parceira inteligente na gestão imobiliária
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-propulse-600/10 rounded-full blur-3xl" />
      </div>
    </section>
  );
};
