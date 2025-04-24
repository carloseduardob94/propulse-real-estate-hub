import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { UserProfile } from "@/types/auth";
import { supabase } from "@/integrations/supabase/client";
import { PropertyFilters } from "@/components/property/property-filters";
import { PropertyGrid } from "@/components/property/property-grid";
import { PageLayout } from "@/components/layout/PageLayout";
import { useToast } from "@/hooks/use-toast";
import { PropertyDialog } from "@/components/property/property-dialog";
import { useProperties } from "@/hooks/use-properties";
import { PropertyFilterProvider, usePropertyFilters } from "@/components/property/property-filter-context";
import { PropertyCatalogHeader } from "@/components/property/property-catalog-header";

function PropertyContent({ properties, isLoading }: { properties: any[], isLoading: boolean }) {
  const [currentPage, setCurrentPage] = useState(1);
  const {
    filteredProperties,
    searchTerm,
    setSearchTerm,
    propertyType,
    setPropertyType,
    bedrooms,
    setBedrooms,
    bathrooms,
    setBathrooms,
    priceRange,
    setPriceRange,
    status,
    setStatus,
    resetFilters
  } = usePropertyFilters();

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const itemsPerPage = 9;

  return (
    <>
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
      
      <PropertyGrid
        properties={filteredProperties}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        onResetFilters={resetFilters}
        isLoading={isLoading}
      />
    </>
  );
}

export default function PropertyCatalog() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

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

  const { properties, isLoading, fetchProperties } = useProperties(user.id);

  const [userProfile, setUserProfile] = useState<{
    id: string;
    name: string | null;
    slug: string | null;
  }>({
    id: "",
    name: "",
    slug: null
  });

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

            setUserProfile({
              id: userData.id,
              name: profile?.name || userData.user_metadata?.name || "Usuário",
              slug: profile?.slug || null
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

  const toggleFilters = () => {
    setShowFilters(prev => !prev);
  };

  const actionButton = (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Imóvel
        </Button>
      </DialogTrigger>
      <PropertyDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </Dialog>
  );

  return (
    <PageLayout
      isAuthenticated={isAuthenticated}
      user={user}
      onLogout={handleLogout}
      title="Imóveis"
      description="Gerenciamento do seu portfólio de imóveis"
      actionButton={actionButton}
    >
      <PropertyCatalogHeader 
        showFilters={showFilters}
        onToggleFilters={toggleFilters}
        userSlug={userProfile.slug || ""}
      />
      
      <PropertyFilterProvider properties={properties}>
        <div className="container mx-auto px-4 py-6">
          {showFilters && <PropertyContent properties={properties} isLoading={isLoading} />}
          {!showFilters && (
            <div className="mt-4">
              <PropertyGrid
                properties={properties}
                currentPage={1}
                itemsPerPage={9}
                onPageChange={() => {}}
                onResetFilters={() => {}}
                isLoading={isLoading}
              />
            </div>
          )}
        </div>
      </PropertyFilterProvider>
    </PageLayout>
  );
}
