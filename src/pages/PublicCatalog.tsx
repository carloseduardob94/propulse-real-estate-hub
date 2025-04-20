
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PropertyGrid } from "@/components/property/property-grid";
import { supabase } from "@/integrations/supabase/client";
import { Property } from "@/types";
import { PropertyFilterProvider } from "@/components/property/property-filter-context";
import { PropertyFilters } from "@/components/property/property-filters";
import { usePropertyFilters } from "@/components/property/property-filter-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

function PublicCatalogContent({ properties, isLoading, profileData }: { 
  properties: Property[], 
  isLoading: boolean,
  profileData: any
}) {
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

export default function PublicCatalog() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);

  useEffect(() => {
    const fetchProfileBySlug = async () => {
      setIsLoading(true);
      try {
        // First, find the user profile that matches this slug
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('slug', slug)
          .single();
        
        if (profileError || !profile) {
          console.error("Profile not found:", profileError);
          // Redirect to 404 if slug doesn't exist
          navigate('/not-found');
          return;
        }

        setProfileData(profile);

        // Then fetch properties for that user
        const { data: propertiesData, error: propertiesError } = await supabase
          .from('properties')
          .select('*')
          .eq('user_id', profile.id);
          
        if (propertiesError) {
          console.error("Error fetching properties:", propertiesError);
          return;
        }
        
        const typedProperties = propertiesData.map(p => ({
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
      } catch (error) {
        console.error("Error:", error);
        navigate('/not-found');
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchProfileBySlug();
    }
  }, [slug, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Carregando catálogo...</span>
      </div>
    );
  }

  if (!profileData) {
    return null; // This should rarely happen as we navigate to not-found in case of errors
  }

  const profileName = profileData.company_name || profileData.name || "Catálogo de Imóveis";

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold">{profileName}</h1>
          <p className="text-muted-foreground">Catálogo de Imóveis</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Imóveis disponíveis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Confira nossa seleção de {properties.length} imóveis disponíveis
            </p>
          </CardContent>
        </Card>

        <PropertyFilterProvider properties={properties}>
          <PublicCatalogContent 
            properties={properties} 
            isLoading={isLoading} 
            profileData={profileData}
          />
        </PropertyFilterProvider>
      </main>

      <footer className="bg-white border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {profileName}. Todos os direitos reservados.</p>
          <p className="mt-1">Powered by MeuCorretorPRO</p>
        </div>
      </footer>
    </div>
  );
}
