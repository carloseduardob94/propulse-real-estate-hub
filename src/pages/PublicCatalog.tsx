
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PropertyFilterProvider } from "@/components/property/property-filter-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { PublicCatalogHeader } from "@/components/public-catalog/public-catalog-header";
import { PublicCatalogContent } from "@/components/public-catalog/public-catalog-content";

interface ProfileData {
  id: string;
  name: string | null;
  company_name: string | null;
}

export default function PublicCatalog() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [properties, setProperties] = useState<any[]>([]);
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
      <PublicCatalogHeader profileName={profileName} />
      
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
