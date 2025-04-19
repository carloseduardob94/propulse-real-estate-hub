import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/navbar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Property, Lead } from "@/types";
import { PropertyForm } from "@/components/ui/property-form";
import { LeadForm } from "@/components/ui/lead-form";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { PropertySection } from "@/components/dashboard/property-section";
import { LeadSection } from "@/components/dashboard/lead-section";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { PremiumPromotion } from "@/components/dashboard/premium-promotion";
import { useQuery } from "@tanstack/react-query";

const transformPropertyFromDB = (property: any): Property => ({
  id: property.id,
  title: property.title,
  description: property.description || "",
  price: property.price,
  address: property.address,
  city: property.city,
  state: property.state,
  zipCode: property.zip_code || "",
  bedrooms: property.bedrooms,
  bathrooms: property.bathrooms,
  area: property.area,
  parkingSpaces: property.parking_spaces || 0,
  type: property.type as 'apartment' | 'house' | 'commercial' | 'land',
  status: property.status as 'forSale' | 'forRent' | 'sold' | 'rented',
  images: property.images || [],
  featured: property.featured || false,
  createdAt: property.created_at,
  updatedAt: property.updated_at,
});

const transformLeadFromDB = (lead: any): Lead => ({
  id: lead.id,
  name: lead.name,
  email: lead.email,
  phone: lead.phone || "",
  message: lead.message || "",
  budget: lead.budget || 0,
  preferredLocation: lead.preferred_location || "",
  propertyType: lead.property_type || [],
  leadScore: lead.lead_score || 0,
  status: lead.status as 'new' | 'contacted' | 'qualified' | 'unqualified' | 'converted',
  createdAt: lead.created_at,
  updatedAt: lead.updated_at,
});

const Dashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [user, setUser] = useState({ 
    id: "",
    name: "Usuário Demo", 
    email: "demo@example.com", 
    plan: "free" as const 
  });
  
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);

  const { data: properties = [], isLoading: propertiesLoading } = useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data.map(transformPropertyFromDB) as Property[];
    }
  });

  const { data: leads = [], isLoading: leadsLoading } = useQuery({
    queryKey: ['leads'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('lead_score', { ascending: false });
      
      if (error) throw error;
      return data.map(transformLeadFromDB) as Lead[];
    }
  });

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          return;
        }
        
        const userData = session.user;
        
        if (userData) {
          setUser({
            id: userData.id,
            name: userData.user_metadata?.name || "Usuário",
            email: userData.email || "sem email",
            plan: "free" as const
          });
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    
    getUserProfile();
  }, [navigate]);
  
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Logout realizado com sucesso!",
        description: "Você foi desconectado da sua conta.",
      });
    } catch (error: any) {
      console.error("Logout error:", error);
      toast({
        title: "Erro ao fazer logout",
        description: error.message || "Ocorreu um erro ao desconectar.",
        variant: "destructive",
      });
    }
  };

  const onLeadSubmit = async (data: any) => {
    try {
      const dbData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.notes,
        budget: parseFloat(data.budget),
        preferred_location: data.preferredLocation,
        property_type: ["apartment"],
        status: data.status,
        lead_score: 0,
        user_id: user.id
      };

      const { error } = await supabase
        .from('leads')
        .insert([dbData]);

      if (error) throw error;

      toast({
        title: "Lead cadastrado com sucesso!",
        description: "O lead foi adicionado à sua lista.",
      });
      setShowLeadForm(false);
    } catch (error: any) {
      toast({
        title: "Erro ao cadastrar lead",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const onPropertySubmit = async (data: any) => {
    try {
      const dbData = {
        title: data.title,
        description: data.description,
        price: parseFloat(data.price),
        address: data.address,
        city: data.city,
        state: data.state,
        zip_code: data.zipCode,
        bedrooms: parseInt(data.bedrooms),
        bathrooms: parseInt(data.bathrooms),
        area: parseFloat(data.area),
        parking_spaces: parseInt(data.parkingSpaces || 0),
        type: data.type,
        status: data.status,
        images: data.images || [],
        user_id: user.id
      };

      const { error } = await supabase
        .from('properties')
        .insert([dbData]);

      if (error) throw error;

      toast({
        title: "Imóvel cadastrado com sucesso!",
        description: "O imóvel foi adicionado ao seu catálogo.",
      });
      setShowPropertyForm(false);
    } catch (error: any) {
      toast({
        title: "Erro ao cadastrar imóvel",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar 
        isAuthenticated={true} 
        user={user} 
        onLogout={handleLogout} 
      />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <DashboardHeader 
          user={user}
          onNewProperty={() => setShowPropertyForm(true)}
          onNewLead={() => setShowLeadForm(true)}
        />
        
        <DashboardStats 
          properties={properties}
          leads={leads}
          plan={user.plan}
        />
        
        <Tabs defaultValue="properties" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="properties">Imóveis Recentes</TabsTrigger>
            <TabsTrigger value="leads">Leads Prioritários</TabsTrigger>
          </TabsList>
          
          <TabsContent value="properties">
            <PropertySection 
              properties={properties}
              isLoading={propertiesLoading}
              onNewProperty={() => setShowPropertyForm(true)}
            />
          </TabsContent>
          
          <TabsContent value="leads">
            <LeadSection 
              leads={leads}
              isLoading={leadsLoading}
              onNewLead={() => setShowLeadForm(true)}
            />
          </TabsContent>
        </Tabs>
        
        <QuickActions />
        
        <PremiumPromotion show={user.plan === 'free'} />

        <Sheet open={showPropertyForm} onOpenChange={setShowPropertyForm}>
          <SheetContent className="w-full sm:max-w-[800px] overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Cadastrar Novo Imóvel</SheetTitle>
              <SheetDescription>
                Preencha os dados do imóvel para cadastrá-lo em seu portfólio.
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6">
              <PropertyForm onSubmit={onPropertySubmit} />
            </div>
          </SheetContent>
        </Sheet>

        <Drawer open={showLeadForm} onOpenChange={setShowLeadForm}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Cadastrar Novo Lead</DrawerTitle>
              <DrawerDescription>
                Adicione as informações do novo lead.
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4">
              <LeadForm onSubmit={onLeadSubmit} />
            </div>
          </DrawerContent>
        </Drawer>
      </main>
      
      <footer className="py-6 bg-white border-t">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} PropulseHub. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
