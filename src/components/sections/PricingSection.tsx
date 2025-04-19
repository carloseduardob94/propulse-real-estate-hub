
import React from 'react';
import { PricingCard } from "@/components/ui/pricing-card";
import { PRICING_PLANS } from "@/data/mock-data";

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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <PricingCard plan={PRICING_PLANS[0]} />
          <PricingCard plan={PRICING_PLANS[1]} isPopular />
          <PricingCard plan={PRICING_PLANS[2]} />
        </div>
      </div>
    </section>
  );
};
