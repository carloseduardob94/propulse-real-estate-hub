
import React from 'react';
import { PricingPlans } from "@/components/ui/pricing-plans";

export const PricingSection = () => {
  return (
    <section id="pricing" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Planos & Preços</h2>
          <p className="text-muted-foreground mt-2">
            Escolha o plano ideal para suas necessidades
          </p>
        </div>
        
        <PricingPlans />
      </div>
    </section>
  );
};
