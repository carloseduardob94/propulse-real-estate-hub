
import { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { LeadForm } from "@/components/ui/lead-form";
import { Check } from "lucide-react";
import { HeroSection } from "@/components/sections/HeroSection";
import { StatsSection } from "@/components/sections/StatsSection";
import { FeaturedProperties } from "@/components/sections/FeaturedProperties";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { PricingSection } from "@/components/sections/PricingSection";
import { Footer } from "@/components/layout/Footer";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({ name: "Usuário Demo", email: "demo@example.com", plan: "free" as const });

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleLoginDemo = () => {
    setIsAuthenticated(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar 
        isAuthenticated={isAuthenticated} 
        user={user} 
        onLogout={handleLogout} 
      />
      
      <HeroSection isAuthenticated={isAuthenticated} onLoginDemo={handleLoginDemo} />
      <StatsSection />
      <FeaturedProperties />
      <FeaturesSection />
      
      {/* Capture Lead Form */}
      <section className="py-16 bg-propulse-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Interessado em conhecer mais?</h2>
              <p className="text-lg mb-6">
                Deixe seus dados e entraremos em contato para demonstrar como o PropulseHub 
                pode transformar a gestão dos seus negócios imobiliários.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-propulse-600 mr-2" />
                  <span>Demonstração personalizada</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-propulse-600 mr-2" />
                  <span>Suporte dedicado na implementação</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-propulse-600 mr-2" />
                  <span>Consultoria para migração de dados</span>
                </li>
              </ul>
            </div>
            <LeadForm />
          </div>
        </div>
      </section>
      
      <PricingSection />
      <Footer />
    </div>
  );
};

export default Index;
