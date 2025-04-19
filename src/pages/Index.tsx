
import { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { PropertyCardWithSlider } from "@/components/ui/property-card-with-slider";
import { PricingCard } from "@/components/ui/pricing-card";
import { Button } from "@/components/ui/button";
import { LeadForm } from "@/components/ui/lead-form";
import { MOCK_PROPERTIES, PRICING_PLANS } from "@/data/mock-data";
import { Home, Users, FileText, ChevronRight, Check, ArrowRight } from "lucide-react";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({ name: "Usuário Demo", email: "demo@example.com", plan: "free" as const });

  const featuredProperties = MOCK_PROPERTIES.filter(property => property.featured).slice(0, 3);

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
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-propulse-900 to-propulse-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Transforme a gestão dos seus imóveis e leads
              </h1>
              <p className="text-xl text-propulse-100">
                Plataforma completa para corretores e imobiliárias organizarem imóveis, 
                qualificarem leads e gerarem propostas profissionais.
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
                    onClick={handleLoginDemo}
                  >
                    Começar agora
                  </Button>
                )}
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white/10 hover:border-white transition-colors"
                  asChild
                >
                  <a href="#features">Saiba mais</a>
                </Button>
              </div>
            </div>
            <div className="hidden md:block relative">
              <div className="absolute -bottom-16 -right-8 w-full max-w-lg">
                <img 
                  src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop" 
                  alt="Dashboard Preview" 
                  className="rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center p-6 rounded-lg border bg-card shadow-sm">
              <div className="rounded-full bg-propulse-100 p-3 mr-4">
                <Home className="h-6 w-6 text-propulse-600" />
              </div>
              <div>
                <p className="text-3xl font-bold">Imóveis</p>
                <p className="text-muted-foreground">Cadastro e gestão de imóveis com informações completas</p>
              </div>
            </div>
            <div className="flex items-center p-6 rounded-lg border bg-card shadow-sm">
              <div className="rounded-full bg-success-100 p-3 mr-4">
                <Users className="h-6 w-6 text-success-600" />
              </div>
              <div>
                <p className="text-3xl font-bold">Leads</p>
                <p className="text-muted-foreground">Qualificação automática e priorização de leads</p>
              </div>
            </div>
            <div className="flex items-center p-6 rounded-lg border bg-card shadow-sm">
              <div className="rounded-full bg-blue-100 p-3 mr-4">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-3xl font-bold">Propostas</p>
                <p className="text-muted-foreground">Geração de propostas personalizadas com sua marca</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Properties */}
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
      
      {/* Features Section */}
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
                <li className="flex items-start">
                  <div className="rounded-full bg-success-100 p-1 mr-3 mt-1">
                    <Check className="h-4 w-4 text-success-600" />
                  </div>
                  <div>
                    <p className="font-medium">Captura manual e automatizada</p>
                    <p className="text-muted-foreground">Registre leads diretamente ou capture via formulários no seu site</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="rounded-full bg-success-100 p-1 mr-3 mt-1">
                    <Check className="h-4 w-4 text-success-600" />
                  </div>
                  <div>
                    <p className="font-medium">Qualificação automática</p>
                    <p className="text-muted-foreground">Qualificação baseada em critérios como orçamento e localização</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="rounded-full bg-success-100 p-1 mr-3 mt-1">
                    <Check className="h-4 w-4 text-success-600" />
                  </div>
                  <div>
                    <p className="font-medium">Sistema de priorização (Lead Scoring)</p>
                    <p className="text-muted-foreground">Destaque automático para os leads mais promissores</p>
                  </div>
                </li>
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
                <li className="flex items-start">
                  <div className="rounded-full bg-success-100 p-1 mr-3 mt-1">
                    <Check className="h-4 w-4 text-success-600" />
                  </div>
                  <div>
                    <p className="font-medium">Propostas profissionais</p>
                    <p className="text-muted-foreground">Crie propostas visuais com imóveis recomendados</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="rounded-full bg-success-100 p-1 mr-3 mt-1">
                    <Check className="h-4 w-4 text-success-600" />
                  </div>
                  <div>
                    <p className="font-medium">Personalização da marca</p>
                    <p className="text-muted-foreground">Adicione seu nome, logo e informações de contato</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="rounded-full bg-success-100 p-1 mr-3 mt-1">
                    <Check className="h-4 w-4 text-success-600" />
                  </div>
                  <div>
                    <p className="font-medium">Exportação em PDF</p>
                    <p className="text-muted-foreground">Exporte as propostas em PDF ou compartilhe via link</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
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
      
      {/* Pricing Section */}
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
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">PropulseHub</h3>
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
            <p>&copy; {new Date().getFullYear()} PropulseHub. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
