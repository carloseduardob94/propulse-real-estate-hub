import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/navbar";
import { LeadForm } from "@/components/ui/lead-form";
import { Check } from "lucide-react";
import { HeroSection } from "@/components/sections/HeroSection";
import { StatsSection } from "@/components/sections/StatsSection";
import { FeaturedProperties } from "@/components/sections/FeaturedProperties";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { PricingSection } from "@/components/sections/PricingSection";
import { Footer } from "@/components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/auth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (data.session) {
        setIsAuthenticated(true);
        
        // Get user profile data
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.session.user.id)
          .single();
          
        if (profile) {
          setUser({
            id: data.session.user.id,
            name: profile.name || data.session.user.user_metadata?.name || 'Usuário',
            email: data.session.user.email || '',
            avatar_url: profile.avatar_url,
            company_name: profile.company_name,
            plan: (profile.plan as "free" | "monthly" | "yearly") || "free"
          });
        } else {
          // Fallback if no profile exists
          setUser({
            id: data.session.user.id,
            name: data.session.user.user_metadata?.name || 'Usuário',
            email: data.session.user.email || '',
            avatar_url: null,
            company_name: null,
            plan: "free"
          });
        }
      }
    };
    
    checkSession();
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setIsAuthenticated(!!session);
        
        if (session) {
          // Get updated profile on auth change
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (profile) {
            setUser({
              id: session.user.id,
              name: profile.name || session.user.user_metadata?.name || 'Usuário',
              email: session.user.email || '',
              avatar_url: profile.avatar_url,
              company_name: profile.company_name,
              plan: (profile.plan as "free" | "monthly" | "yearly") || "free"
            });
          } else {
            setUser({
              id: session.user.id,
              name: session.user.user_metadata?.name || 'Usuário',
              email: session.user.email || '',
              avatar_url: null,
              company_name: null,
              plan: "free"
            });
          }
        } else {
          setUser(null);
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      setUser(null);
      
      toast({
        title: "Logout realizado com sucesso!",
        description: "Você foi desconectado da sua conta.",
      });
      
      navigate('/login');
    } catch (error: any) {
      console.error("Logout error:", error);
      toast({
        title: "Erro ao fazer logout",
        description: error.message || "Ocorreu um erro ao desconectar.",
        variant: "destructive",
      });
    }
  };

  const handleLoginDemo = () => {
    navigate('/login');
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
                Deixe seus dados e entraremos em contato para demonstrar como o MeuCorretorPRO 
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
