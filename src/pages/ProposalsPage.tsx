
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/types/auth";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PageLayout } from "@/components/layout/PageLayout";
import { useToast } from "@/hooks/use-toast";
import { ProposalList } from "@/components/proposals/ProposalList";

export default function ProposalsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [proposals, setProposals] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
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

            fetchProposals(userData.id);
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

  const fetchProposals = async (userId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('proposals')
        .select('*, leads(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      const formattedProposals = data.map(proposal => ({
        id: proposal.id,
        title: proposal.title,
        clientName: proposal.leads?.name || "Cliente sem nome",
        createdAt: proposal.created_at,
        propertyCount: (proposal.property_ids?.length || 0),
        status: proposal.status || "draft"
      }));
      
      setProposals(formattedProposals);
    } catch (error) {
      console.error("Error fetching proposals:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar suas propostas",
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
  
  const handleAddProposal = async (data: any) => {
    try {
      const { error } = await supabase
        .from('proposals')
        .insert({
          user_id: user.id,
          title: data.title,
          lead_id: data.leadId,
          property_ids: data.propertyIds,
          status: 'draft'
        });
        
      if (error) throw error;
      
      toast({
        title: "Sucesso!",
        description: "Proposta criada com sucesso"
      });
      
      // Reload proposals
      fetchProposals(user.id);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error adding proposal:", error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a proposta",
        variant: "destructive"
      });
    }
  };

  const AddProposalForm = () => (
    <div className="space-y-4 py-4">
      <p className="text-center text-muted-foreground">
        Formulário de criação de proposta será implementado aqui.
      </p>
      <div className="flex justify-center">
        <Button onClick={() => setIsDialogOpen(false)}>Fechar</Button>
      </div>
    </div>
  );

  const actionButton = (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="mt-4 md:mt-0">
          <Plus className="h-4 w-4 mr-2" />
          Nova Proposta
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Criar nova proposta</DialogTitle>
          <DialogDescription>
            Selecione um cliente e imóveis para criar uma proposta personalizada.
          </DialogDescription>
        </DialogHeader>
        <AddProposalForm />
      </DialogContent>
    </Dialog>
  );

  return (
    <PageLayout
      isAuthenticated={isAuthenticated}
      user={user}
      onLogout={handleLogout}
      title="Propostas"
      description="Gerencie suas propostas para clientes"
      actionButton={actionButton}
    >
      <ProposalList
        proposals={proposals}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        isLoading={isLoading}
      />
    </PageLayout>
  );
}
