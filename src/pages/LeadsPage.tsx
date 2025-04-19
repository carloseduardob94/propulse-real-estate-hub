import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UserProfile } from "@/types/auth";
import { supabase } from "@/integrations/supabase/client";
import { Lead } from "@/types";
import { MOCK_LEADS } from "@/data/mock-data";
import { LeadList } from "@/components/leads/LeadList";
import { PageLayout } from "@/components/layout/PageLayout";

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
              company_name: profile?.company_name || null
            });
          }
        } else {
          navigate('/login');
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
      
      navigate('/login');
    } catch (error: any) {
      console.error("Logout error:", error);
    }
  };
  
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const AddLeadForm = () => (
    <div className="space-y-4 py-4">
      <p className="text-center text-muted-foreground">
        Formulário de cadastro de lead será implementado aqui.
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
        <AddLeadForm />
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
      />
    </PageLayout>
  );
}
