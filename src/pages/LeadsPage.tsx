import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UserProfile } from "@/types/auth";
import { supabase } from "@/integrations/supabase/client";
import { Lead } from "@/types";
import { LeadList } from "@/components/leads/LeadList";
import { PageLayout } from "@/components/layout/PageLayout";
import { useToast } from "@/hooks/use-toast";
import { LeadForm } from "@/components/ui/lead-form";
import { useQueryClient } from "react-query";

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [user, setUser] = useState<UserProfile>({
    id: "",
    name: "", 
    email: "", 
    plan: "free",
    avatar_url: null,
    company_name: null,
    whatsapp: null
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

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
              company_name: profile?.company_name || null,
              whatsapp: profile?.whatsapp || null
            });

            fetchLeads(userData.id);
          }
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar seu perfil",
          variant: "destructive"
        });
      }
    };
    
    getUserProfile();
  }, [navigate, toast]);

  const fetchLeads = async (userId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      const typedLeads = data.map(lead => ({
        id: lead.id,
        name: lead.name,
        email: lead.email,
        phone: lead.phone || "",
        message: lead.message || "",
        budget: lead.budget || 0,
        preferredLocation: lead.preferred_location || "",
        propertyType: lead.property_type || [],
        leadScore: lead.lead_score || 0,
        status: lead.status as any || "new",
        createdAt: lead.created_at,
        updatedAt: lead.updated_at
      }));
      
      setLeads(typedLeads);
    } catch (error) {
      console.error("Error fetching leads:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar seus leads",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      navigate('/login');
    } catch (error: any) {
      console.error("Logout error:", error);
      toast({
        title: "Erro",
        description: "Falha ao fazer logout",
        variant: "destructive"
      });
    }
  };
  
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddLead = async (data: any) => {
    try {
      const { error } = await supabase
        .from('leads')
        .insert({
          user_id: user.id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          message: data.notes,
          budget: data.budget ? parseFloat(data.budget) : null,
          preferred_location: data.preferredLocation,
          status: data.status,
        });
        
      if (error) throw error;
      
      toast({
        title: "Sucesso!",
        description: "Lead cadastrado com sucesso"
      });
      
      await queryClient.invalidateQueries({ queryKey: ['leads', user.id] });
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error adding lead:", error);
      toast({
        title: "Erro",
        description: "Não foi possível cadastrar o lead",
        variant: "destructive"
      });
    }
  };

  const actionButton = (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="mt-4 md:mt-0">
          <Plus className="h-4 w-4 mr-2" />
          Novo Lead
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Cadastrar novo lead</DialogTitle>
          <DialogDescription>
            Preencha as informações do lead para adicioná-lo ao sistema.
          </DialogDescription>
        </DialogHeader>
        <LeadForm onSubmit={handleAddLead} />
      </DialogContent>
    </Dialog>
  );

  return (
    <PageLayout
      isAuthenticated={isAuthenticated}
      user={user}
      onLogout={handleLogout}
      title="Leads"
      description="Gerenciamento e qualificação dos seus contatos"
      actionButton={actionButton}
    >
      <LeadList
        leads={leads}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        isLoading={isLoading}
      />
    </PageLayout>
  );
}
