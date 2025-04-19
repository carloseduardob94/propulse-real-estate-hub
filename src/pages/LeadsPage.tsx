import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lead } from "@/types";
import { Plus, User, MailIcon, Phone, DollarSign, MapPin, Clock, ChevronRight } from "lucide-react";
import { MOCK_LEADS } from "@/data/mock-data";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/auth";
import { useNavigate } from "react-router-dom";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

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
  
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-700";
      case "contacted":
        return "bg-yellow-100 text-yellow-700";
      case "qualified":
        return "bg-green-100 text-green-700";
      case "unqualified":
        return "bg-red-100 text-red-700";
      case "converted":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };
  
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "new":
        return "Novo";
      case "contacted":
        return "Contatado";
      case "qualified":
        return "Qualificado";
      case "unqualified":
        return "Desqualificado";
      case "converted":
        return "Convertido";
      default:
        return status;
    }
  };
  
  const getLeadScoreClass = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-700";
    if (score >= 50) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
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
  
  const indexOfLastLead = currentPage * itemsPerPage;
  const indexOfFirstLead = indexOfLastLead - itemsPerPage;
  const currentLeads = leads.slice(indexOfFirstLead, indexOfLastLead);
  const totalPages = Math.ceil(leads.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
            <h1 className="text-3xl font-bold">Leads</h1>
            <p className="text-muted-foreground">
              Gerenciamento e qualificação dos seus contatos
            </p>
          </div>
          
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
        </div>
        
        {/* Leads grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {currentLeads.map((lead) => (
            <Card key={lead.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-100 p-2 rounded-full">
                      <User className="h-6 w-6 text-propulse-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{lead.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusBadgeClass(lead.status)}`}>
                          {getStatusLabel(lead.status)}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${getLeadScoreClass(lead.leadScore)}`}>
                          Score: {lead.leadScore}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="rounded-full" asChild>
                    <a href={`/leads/${lead.id}`}>
                      <ChevronRight className="h-5 w-5" />
                    </a>
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <MailIcon className="h-4 w-4 text-muted-foreground" />
                    <span>{lead.email}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{lead.phone}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span>Orçamento: R$ {lead.budget.toLocaleString('pt-BR')}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>Região: {lead.preferredLocation}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Cadastrado em: {new Date(lead.createdAt).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <Pagination>
              <PaginationContent>
                {currentPage > 1 && (
                  <PaginationItem>
                    <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} />
                  </PaginationItem>
                )}

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => handlePageChange(page)}
                      isActive={currentPage === page}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                {currentPage < totalPages && (
                  <PaginationItem>
                    <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </main>
      
      <footer className="py-6 bg-white border-t">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} MeuCorretorPRO. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
