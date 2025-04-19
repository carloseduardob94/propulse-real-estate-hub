
import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/navbar";
import { PricingCard } from "@/components/ui/pricing-card";
import { PlanDetails } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/auth";
import { useNavigate } from "react-router-dom";

const plans: PlanDetails[] = [
  {
    id: "free",
    name: "Gratuito",
    price: 0,
    period: "free",
    features: [
      {
        id: "free-1",
        title: "Até 3 imóveis",
        description: "Ideal para começar",
        includedIn: ["free", "monthly", "yearly"]
      },
      {
        id: "free-2",
        title: "Gestão de Leads",
        description: "Cadastre e gerencie seus contatos",
        includedIn: ["free", "monthly", "yearly"]
      },
      {
        id: "free-3",
        title: "Propostas Básicas",
        description: "Crie propostas simples em PDF",
        includedIn: ["free", "monthly", "yearly"]
      }
    ],
    maxProperties: 3,
    maxProposals: 10,
    supportsLeadScoring: false,
    supportsPdfExport: true
  },
  {
    id: "monthly",
    name: "Profissional",
    price: 97,
    period: "monthly",
    features: [
      {
        id: "pro-1",
        title: "Imóveis Ilimitados",
        description: "Cadastre todos seus imóveis",
        includedIn: ["monthly", "yearly"]
      },
      {
        id: "pro-2",
        title: "Lead Scoring Automático",
        description: "Qualificação automática de leads",
        includedIn: ["monthly", "yearly"]
      },
      {
        id: "pro-3",
        title: "Propostas Personalizadas",
        description: "Templates personalizados e marca própria",
        includedIn: ["monthly", "yearly"]
      },
      {
        id: "pro-4",
        title: "Automações via n8n",
        description: "Integre com outras ferramentas",
        includedIn: ["monthly", "yearly"]
      }
    ],
    highlightedFeature: "Mais Popular",
    maxProperties: -1,
    maxProposals: -1,
    supportsLeadScoring: true,
    supportsPdfExport: true
  },
  {
    id: "yearly",
    name: "Profissional Anual",
    price: 970,
    period: "yearly",
    features: [
      {
        id: "yearly-1",
        title: "Todos os recursos Pro",
        description: "Acesso completo à plataforma",
        includedIn: ["yearly"]
      },
      {
        id: "yearly-2",
        title: "2 Meses Grátis",
        description: "Economize pagando anualmente",
        includedIn: ["yearly"]
      }
    ],
    highlightedFeature: "Melhor Custo-Benefício",
    maxProperties: -1,
    maxProposals: -1,
    supportsLeadScoring: true,
    supportsPdfExport: true
  }
];

export default function PlansPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile>({ 
    id: "",
    name: "", 
    email: "", 
    plan: "free",
    avatar_url: null,
    company_name: null
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const userData = session.user;
          setIsAuthenticated(true);
          
          if (userData) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', userData.id)
              .single();
              
            setUser({
              id: userData.id,
              name: profile?.name || userData.user_metadata?.name || "Usuário",
              email: userData.email || "sem email",
              plan: (profile?.plan as "free" | "monthly" | "yearly") || "free",
              avatar_url: profile?.avatar_url || null,
              company_name: profile?.company_name || null
            });
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    
    getUserProfile();
  }, []);
  
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      navigate('/login');
    } catch (error: any) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar 
        isAuthenticated={isAuthenticated} 
        user={user}
        onLogout={handleLogout}
      />
      
      <main className="flex-1">
        <div className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              Escolha seu Plano
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Comece gratuitamente e faça upgrade conforme seu negócio cresce
            </p>
          </div>
          
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-3">
              {plans.map((plan) => (
                <PricingCard
                  key={plan.id}
                  plan={plan}
                  isPopular={plan.id === "monthly"}
                />
              ))}
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              Todos os planos incluem 14 dias de garantia. Cancele a qualquer momento.
            </p>
          </div>
        </div>
      </main>
      
      <footer className="py-6 bg-white border-t">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} MeuCorretorPRO. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
