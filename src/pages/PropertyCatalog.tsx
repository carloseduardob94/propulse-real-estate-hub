
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Share2, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UserProfile } from "@/types/auth";
import { supabase } from "@/integrations/supabase/client";
import { Property } from "@/types";
import { PropertyFilters } from "@/components/property/property-filters";
import { PropertyGrid } from "@/components/property/property-grid";
import { PageLayout } from "@/components/layout/PageLayout";
import { useToast } from "@/hooks/use-toast";

export default function PropertyCatalog() {
  const { toast } = useToast();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [propertyType, setPropertyType] = useState<string>("all");
  const [bedrooms, setBedrooms] = useState<number[]>([0]);
  const [bathrooms, setBathrooms] = useState<number[]>([0]);
  const [priceRange, setPriceRange] = useState<number[]>([0, 10000000]);
  const [status, setStatus] = useState<string>("all");

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

            fetchProperties(userData.id);
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

  const fetchProperties = async (userId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('user_id', userId);
        
      if (error) throw error;
      
      const typedProperties = data.map(p => ({
        id: p.id,
        title: p.title,
        description: p.description || "",
        price: p.price,
        address: p.address,
        city: p.city,
        state: p.state,
        zipCode: p.zip_code || "",
        bedrooms: p.bedrooms,
        bathrooms: p.bathrooms,
        area: p.area,
        parkingSpaces: p.parking_spaces || 0,
        type: p.type as any,
        status: p.status as any,
        images: p.images || [],
        featured: p.featured || false,
        createdAt: p.created_at,
        updatedAt: p.updated_at
      }));
      
      setProperties(typedProperties);
      setFilteredProperties(typedProperties);
      
      const prices = typedProperties.map(p => p.price);
      const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
      const maxPrice = prices.length > 0 ? Math.max(...prices) : 10000000;
      setPriceRange([minPrice, maxPrice]);
    } catch (error) {
      console.error("Error fetching properties:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar seus imóveis",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    let result = [...properties];
    
    if (searchTerm) {
      result = result.filter(property => 
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.state.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (propertyType !== "all") {
      result = result.filter(property => property.type === propertyType);
    }
    
    if (bedrooms[0] > 0) {
      result = result.filter(property => property.bedrooms >= bedrooms[0]);
    }
    
    if (bathrooms[0] > 0) {
      result = result.filter(property => property.bathrooms >= bathrooms[0]);
    }
    
    result = result.filter(property => 
      property.price >= priceRange[0] && property.price <= priceRange[1]
    );
    
    if (status !== "all") {
      result = result.filter(property => property.status === status);
    }
    
    setFilteredProperties(result);
  }, [properties, searchTerm, propertyType, bedrooms, bathrooms, priceRange, status]);

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

  const handleShareCatalog = () => {
    const url = window.location.href;
    
    if (navigator.share) {
      navigator.share({
        title: "Catálogo de Imóveis - MeuCorretorPRO",
        text: "Confira nosso catálogo de imóveis:",
        url: url,
      }).catch((error) => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(url).then(() => {
        toast({
          title: "Link copiado!",
          description: "Link do catálogo copiado para a área de transferência."
        });
      }).catch(err => {
        console.error('Failed to copy: ', err);
      });
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setPropertyType("all");
    setBedrooms([0]);
    setBathrooms([0]);
    
    const prices = properties.map(p => p.price);
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 10000000;
    setPriceRange([minPrice, maxPrice]);
    
    setStatus("all");
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const AddPropertyForm = () => (
    <div className="space-y-4 py-4">
      <p className="text-center text-muted-foreground">
        Formulário de cadastro de imóveis será implementado aqui.
      </p>
      <div className="flex justify-center">
        <Button onClick={() => setIsDialogOpen(false)}>Fechar</Button>
      </div>
    </div>
  );

  const catalogHeader = (
    <div className="bg-propulse-700 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Catálogo de Imóveis</h1>
            <p className="text-propulse-100">Encontre o imóvel ideal para você</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              className="bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white"
              onClick={handleShareCatalog}
            >
              <Share2 className="mr-2 h-4 w-4" />
              Compartilhar
            </Button>
            
            <Button 
              variant={showFilters ? "secondary" : "outline"}
              className={`${!showFilters ? "bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white" : ""}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? <X className="mr-2 h-4 w-4" /> : <Filter className="mr-2 h-4 w-4" />}
              {showFilters ? "Fechar Filtros" : "Filtros"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const actionButton = (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="mt-4 md:mt-0">
          <Plus className="h-4 w-4 mr-2" />
          Novo Imóvel
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Cadastrar novo imóvel</DialogTitle>
          <DialogDescription>
            Preencha as informações do imóvel para adicioná-lo ao sistema.
          </DialogDescription>
        </DialogHeader>
        <AddPropertyForm />
      </DialogContent>
    </Dialog>
  );

  return (
    <>
      <PageLayout
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={handleLogout}
        title="Imóveis"
        description="Gerenciamento do seu portfólio de imóveis"
        actionButton={actionButton}
      >
        {showFilters && (
          <PropertyFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            propertyType={propertyType}
            setPropertyType={setPropertyType}
            bedrooms={bedrooms}
            setBedrooms={setBedrooms}
            bathrooms={bathrooms}
            setBathrooms={setBathrooms}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            status={status}
            setStatus={setStatus}
            onResetFilters={resetFilters}
          />
        )}
        
        <PropertyGrid
          properties={filteredProperties}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onResetFilters={resetFilters}
          isLoading={isLoading}
        />
      </PageLayout>
    </>
  );
}
