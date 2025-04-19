import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UserProfile } from "@/types/auth";
import { supabase } from "@/integrations/supabase/client";
import { ProposalList } from "@/components/proposals/ProposalList";
import { PageLayout } from "@/components/layout/PageLayout";

const MOCK_PROPOSALS = [
  {
    id: "1",
    title: "Proposta para Apartamento Centro",
    clientName: "João Silva",
    createdAt: "2023-05-10T10:30:00Z",
    propertyCount: 3,
    status: "sent",
  },
  {
    id: "2",
    title: "Proposta Comercial Zona Sul",
    clientName: "Maria Oliveira",
    createdAt: "2023-05-08T14:20:00Z",
    propertyCount: 2,
    status: "draft",
  },
  {
    id: "3",
    title: "Casas em Condomínio",
    clientName: "Carlos Ferreira",
    createdAt: "2023-05-05T09:15:00Z",
    propertyCount: 4,
    status: "viewed",
  },
  {
    id: "4",
    title: "Imóveis para Investimento",
    clientName: "Ana Costa",
    createdAt: "2023-05-02T11:45:00Z",
    propertyCount: 5,
    status: "accepted",
  },
];

export default function ProposalsPage() {
  const [proposals, setProposals] = useState(MOCK_PROPOSALS);
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
  
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-700";
      case "sent":
        return "bg-blue-100 text-blue-700";
      case "viewed":
        return "bg-yellow-100 text-yellow-700";
      case "accepted":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };
  
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "draft":
        return "Rascunho";
      case "sent":
        return "Enviada";
      case "viewed":
        return "Visualizada";
      case "accepted":
        return "Aceita";
      case "rejected":
        return "Recusada";
      default:
        return status;
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

  const indexOfLastProposal = currentPage * itemsPerPage;
  const indexOfFirstProposal = indexOfLastProposal - itemsPerPage;
  const currentProposals = proposals.slice(indexOfFirstProposal, indexOfLastProposal);
  const totalPages = Math.ceil(proposals.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
      />
    </PageLayout>
  );
}
