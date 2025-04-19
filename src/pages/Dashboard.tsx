
import { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { PropertyCard } from "@/components/ui/property-card";
import { LeadCard } from "@/components/ui/lead-card";
import { Button } from "@/components/ui/button";
import { MOCK_PROPERTIES, MOCK_LEADS } from "@/data/mock-data";
import { Plus, Home, Users, FileText, Settings, ChevronRight, Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { toast } = useToast();
  const [user, setUser] = useState({ 
    name: "Usuário Demo", 
    email: "demo@example.com", 
    plan: "free" as const 
  });
  
  const [properties, setProperties] = useState(MOCK_PROPERTIES);
  const [leads, setLeads] = useState(MOCK_LEADS);
  
  const recentProperties = properties.slice(0, 3);
  const topLeads = leads
    .sort((a, b) => b.leadScore - a.leadScore)
    .slice(0, 3);
  
  const handleLogout = () => {
    toast({
      title: "Logout realizado com sucesso!",
      description: "Você foi desconectado da sua conta.",
    });
    // In a real app, would redirect to login page
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar 
        isAuthenticated={true} 
        user={user} 
        onLogout={handleLogout} 
      />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Bem-vindo de volta, {user.name}!
            </p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <Button asChild>
              <a href="/properties/new">
                <Plus className="h-4 w-4 mr-2" />
                Novo Imóvel
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/leads/new">
                <Plus className="h-4 w-4 mr-2" />
                Novo Lead
              </a>
            </Button>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Imóveis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Home className="h-5 w-5 text-propulse-600 mr-2" />
                <div className="text-2xl font-bold">{properties.length}</div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {user.plan === 'free' ? `${properties.length}/3 imóveis (Plano Free)` : 'Ilimitado'}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Leads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="h-5 w-5 text-propulse-600 mr-2" />
                <div className="text-2xl font-bold">{leads.length}</div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {leads.filter(l => l.leadScore >= 80).length} leads qualificados
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Propostas Geradas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-propulse-600 mr-2" />
                <div className="text-2xl font-bold">0</div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {user.plan === 'free' ? '0/1 propostas mensais' : 'Ilimitado'}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Seu Plano
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Settings className="h-5 w-5 text-propulse-600 mr-2" />
                <div className="text-2xl font-bold capitalize">
                  {user.plan === 'free' ? 'Free' : user.plan === 'monthly' ? 'Mensal' : 'Anual'}
                </div>
              </div>
              {user.plan === 'free' && (
                <Button variant="link" className="text-xs p-0 h-6 mt-1" asChild>
                  <a href="/plans">Fazer upgrade</a>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Tabs for Properties and Leads */}
        <Tabs defaultValue="properties" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="properties">Imóveis Recentes</TabsTrigger>
            <TabsTrigger value="leads">Leads Prioritários</TabsTrigger>
          </TabsList>
          
          <TabsContent value="properties">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentProperties.length > 0 ? (
                recentProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))
              ) : (
                <div className="col-span-full py-10 text-center text-muted-foreground">
                  Nenhum imóvel cadastrado ainda.
                </div>
              )}
            </div>
            
            {properties.length > 3 && (
              <div className="text-center mt-6">
                <Button variant="outline" asChild>
                  <a href="/properties" className="inline-flex items-center">
                    Ver todos os imóveis
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="leads">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topLeads.length > 0 ? (
                topLeads.map((lead) => (
                  <LeadCard key={lead.id} lead={lead} />
                ))
              ) : (
                <div className="col-span-full py-10 text-center text-muted-foreground">
                  Nenhum lead cadastrado ainda.
                </div>
              )}
            </div>
            
            {leads.length > 3 && (
              <div className="text-center mt-6">
                <Button variant="outline" asChild>
                  <a href="/leads" className="inline-flex items-center">
                    Ver todos os leads
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto py-6 justify-start" asChild>
              <a href="/properties/new" className="inline-flex items-center">
                <div className="rounded-full bg-propulse-100 p-3 mr-4">
                  <Home className="h-5 w-5 text-propulse-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Cadastrar Imóvel</p>
                  <p className="text-sm text-muted-foreground">Adicione um novo imóvel</p>
                </div>
              </a>
            </Button>
            
            <Button variant="outline" className="h-auto py-6 justify-start" asChild>
              <a href="/leads/new" className="inline-flex items-center">
                <div className="rounded-full bg-success-100 p-3 mr-4">
                  <Users className="h-5 w-5 text-success-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Registrar Lead</p>
                  <p className="text-sm text-muted-foreground">Cadastre um novo lead</p>
                </div>
              </a>
            </Button>
            
            <Button variant="outline" className="h-auto py-6 justify-start" asChild>
              <a href="/proposals/new" className="inline-flex items-center">
                <div className="rounded-full bg-blue-100 p-3 mr-4">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Gerar Proposta</p>
                  <p className="text-sm text-muted-foreground">Crie uma nova proposta</p>
                </div>
              </a>
            </Button>
          </div>
        </div>
        
        {/* Plan Upgrade Card (show only for free plan) */}
        {user.plan === 'free' && (
          <Card className="bg-propulse-50 border-propulse-200">
            <CardHeader>
              <CardTitle>Aumente sua produtividade com o Plano Premium</CardTitle>
              <CardDescription>
                Desbloqueie recursos avançados para potencializar seus resultados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-start gap-2">
                  <div className="rounded-full bg-propulse-100 p-1 mt-0.5">
                    <Check className="h-4 w-4 text-propulse-600" />
                  </div>
                  <p className="text-sm">Cadastro ilimitado de imóveis</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="rounded-full bg-propulse-100 p-1 mt-0.5">
                    <Check className="h-4 w-4 text-propulse-600" />
                  </div>
                  <p className="text-sm">Qualificação automática de leads</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="rounded-full bg-propulse-100 p-1 mt-0.5">
                    <Check className="h-4 w-4 text-propulse-600" />
                  </div>
                  <p className="text-sm">Propostas ilimitadas com exportação em PDF</p>
                </div>
              </div>
              <Button asChild>
                <a href="/plans">Ver Planos</a>
              </Button>
            </CardContent>
          </Card>
        )}
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
