
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PropertyFilterProvider } from "@/components/property/property-filter-context";
import { supabase } from "@/integrations/supabase/client";
import { PublicCatalogHeader } from "@/components/public-catalog/public-catalog-header";
import { PublicCatalogContent } from "@/components/public-catalog/public-catalog-content";
import { Loader2 } from "lucide-react";

interface ProfileData {
  id: string;
  name: string | null;
  company_name: string | null;
  avatar_url?: string | null;
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <Loader2 className="h-12 w-12 animate-spin text-propulse-600 mb-4" />
        <span className="text-lg text-propulse-800 font-medium">Carregando catálogo...</span>
      </div>
    );
  }

  if (!profileData) {
    return null;
  }

  const profileName = profileData.company_name || profileData.name || "Catálogo de Imóveis";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <PublicCatalogHeader 
        profileName={profileName} 
        avatarUrl={profileData.avatar_url} 
      />
      
      <main className="container mx-auto px-4 py-8">
        <PropertyFilterProvider properties={properties}>
          <PublicCatalogContent
            properties={properties}
            isLoading={isLoading}
            profileData={profileData}
            slug={slug || ""}
          />
        </PropertyFilterProvider>
      </main>

      <footer className="bg-white border-t py-6 shadow-inner">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} {profileName}. Todos os direitos reservados.
          </p>
          <div className="flex items-center justify-center mt-2">
            <span className="text-xs text-propulse-600 font-medium">Powered by</span>
            <span className="text-xs font-bold text-propulse-800 ml-1">MeuCorretorPRO</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
