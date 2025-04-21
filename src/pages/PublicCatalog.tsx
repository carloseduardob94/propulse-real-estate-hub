
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { PropertyFilterProvider } from "@/components/property/property-filter-context";
import { PropertyFilters } from "@/components/property/property-filters";
import { PropertyGrid } from "@/components/property/property-grid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Property } from "@/types";
import { usePropertyFilters } from "@/components/property/property-filter-context";

interface ProfileData {
  id: string;
  name: string | null;
  company_name: string | null;
}

function PublicCatalogContent({ 
  properties, 
  isLoading, 
  profileData,
  slug
}: { 
  properties: Property[];
  isLoading: boolean;
  profileData: ProfileData;
  slug: string;
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

  // Custom property grid renderer that uses links to property details
  const renderPropertyGrid = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((property) => (
          <Link 
            key={property.id} 
            to={`/catalogo/${slug}/${property.id}`}
            className="block hover:no-underline transition-transform hover:translate-y-[-4px]"
          >
            <Card className="overflow-hidden h-full flex flex-col">
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={property.images[0] || '/placeholder.svg'}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader className="p-4 pb-0">
                <CardTitle className="text-lg">{property.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {property.city}, {property.state}
                </p>
              </CardHeader>
              <CardContent className="p-4 flex-grow">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{property.bedrooms} quartos</span>
                  <span>{property.bathrooms} banheiros</span>
                  <span>{property.area} m²</span>
                </div>
                <p className="mt-4 text-lg font-bold text-propulse-600">
                  R$ {property.price.toLocaleString('pt-BR')}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    );
  };

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
      
      {renderPropertyGrid()}
      
      {/* Pagination */}
      {filteredProperties.length > itemsPerPage && (
        <div className="flex justify-center mt-8">
          <div className="flex gap-2">
            {Array.from({ length: Math.ceil(filteredProperties.length / itemsPerPage) }).map((_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`h-10 w-10 rounded-md flex items-center justify-center ${
                  currentPage === i + 1
                    ? "bg-propulse-600 text-white"
                    : "bg-white text-gray-600 border hover:bg-gray-50"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default function PublicCatalog() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  useEffect(() => {
    const fetchProfileBySlug = async () => {
      setIsLoading(true);
      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('slug', slug)
          .single();
        
        if (profileError || !profile) {
          console.error("Profile not found:", profileError);
          navigate('/not-found');
          return;
        }

        setProfileData(profile);

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
    return null;
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
            slug={slug || ""}
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
