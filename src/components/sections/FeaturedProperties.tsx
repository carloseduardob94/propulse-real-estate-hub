
import React from 'react';
import { Button } from "@/components/ui/button";
import { PropertyCardWithSlider } from "@/components/ui/property-card-with-slider";
import { ChevronRight } from "lucide-react";
import { MOCK_PROPERTIES } from "@/data/mock-data";

export const FeaturedProperties = () => {
  const featuredProperties = MOCK_PROPERTIES.filter(property => property.featured).slice(0, 3);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Imóveis em Destaque</h2>
          <p className="text-muted-foreground mt-2">
            Explore nossos imóveis em destaque ou cadastre os seus
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProperties.map((property) => (
            <PropertyCardWithSlider key={property.id} property={property} />
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Button asChild className="group">
            <a href="/properties" className="inline-flex items-center">
              Ver todos os imóveis
              <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};
