
import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Plus, User, CalendarIcon, ArrowUpRight, Download } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/auth";
import { useNavigate } from "react-router-dom";

// Mock proposals data
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
  
  // Placeholder for the Add Proposal functionality
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
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar 
        isAuthenticated={isAuthenticated} 
        user={user}
        onLogout={handleLogout}
      />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Propostas</h1>
            <p className="text-muted-foreground">
              Gerencie suas propostas para clientes
            </p>
          </div>
          
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
        </div>
        
        {/* Proposals grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {proposals.map((proposal) => (
            <Card key={proposal.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="bg-propulse-100 p-2 rounded-full">
                      <FileText className="h-6 w-6 text-propulse-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{proposal.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusBadgeClass(proposal.status)}`}>
                          {getStatusLabel(proposal.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>Cliente: {proposal.clientName}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <span>Criada em: {new Date(proposal.createdAt).toLocaleDateString('pt-BR')}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>{proposal.propertyCount} imóveis incluídos</span>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1">
                      <ArrowUpRight className="h-4 w-4 mr-2" />
                      Visualizar
                    </Button>
                    <Button size="sm" className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Baixar PDF
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
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
