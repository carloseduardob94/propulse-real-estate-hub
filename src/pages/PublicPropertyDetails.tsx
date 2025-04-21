
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom"; // Added Link import
import { supabase } from "@/integrations/supabase/client";
import { Property } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"; // Added missing Card components
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PropertyImageGallery } from "@/components/property/property-image-gallery";
import { PublicPropertyHeader } from "@/components/property/public-property-header";
import { PublicPropertyFooter } from "@/components/property/public-property-footer";
import { PropertyDetailsContent } from "@/components/property/property-details-content";
import { PropertyContactSidebar } from "@/components/property/property-contact-sidebar";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { formatStatusText } from "@/utils/property-formatters"; // Added formatStatusText import

const statusBadgeStyles: Record<string, string> = {
  forSale: "bg-blue-100 text-blue-800 border-blue-200",
  forRent: "bg-green-100 text-green-800 border-green-200",
  sold: "bg-amber-100 text-amber-800 border-amber-200",
  rented: "bg-purple-100 text-purple-800 border-purple-200"
};
const featuredBadgeStyle = "bg-propulse-100 text-propulse-800 border-propulse-200";

export default function PublicPropertyDetails() {
  const { slug, propertyId } = useParams<{ slug: string; propertyId: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState<{ id: string; name: string | null; company_name: string | null } | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [initialImageIndex, setInitialImageIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('slug', slug)
          .single();
        
        if (profileError || !profile) {
          console.error("Profile not found:", profileError);
          return;
        }

        setProfileData({
          id: profile.id,
          name: profile.name,
          company_name: profile.company_name
        });

        const { data: propertyData, error: propertyError } = await supabase
          .from('properties')
          .select('*')
          .eq('id', propertyId)
          .eq('user_id', profile.id)
          .single();
          
        if (propertyError) {
          console.error("Error fetching property:", propertyError);
          return;
        }
        
        const typedProperty: Property = {
          id: propertyData.id,
          title: propertyData.title,
          description: propertyData.description || "",
          price: propertyData.price,
          address: propertyData.address,
          city: propertyData.city,
          state: propertyData.state,
          zipCode: propertyData.zip_code || "",
          bedrooms: propertyData.bedrooms,
          bathrooms: propertyData.bathrooms,
          area: propertyData.area,
          parkingSpaces: propertyData.parking_spaces || 0,
          type: propertyData.type as any,
          status: propertyData.status as any,
          images: propertyData.images || [],
          featured: propertyData.featured || false,
          createdAt: propertyData.created_at,
          updatedAt: propertyData.updated_at
        };
        
        setProperty(typedProperty);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug && propertyId) {
      fetchData();
    }
  }, [slug, propertyId]);

  const nextImage = () => {
    if (property && property.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }
  };

  const prevImage = () => {
    if (property && property.images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? property.images.length - 1 : prev - 1
      );
    }
  };

  const openGallery = (index: number) => {
    console.log("Opening gallery with index:", index);
    setInitialImageIndex(index);
    setIsGalleryOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-1/4 mt-2" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Skeleton className="h-[400px] w-full rounded-lg" />
              <div className="grid grid-cols-2 gap-4 mt-4">
                <Skeleton className="h-24 w-full rounded-md" />
                <Skeleton className="h-24 w-full rounded-md" />
              </div>
            </div>
            <div>
              <Skeleton className="h-[200px] w-full rounded-lg" />
              <Skeleton className="h-12 w-full mt-4 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!property || !profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Imóvel não encontrado</CardTitle>
            <CardDescription>O imóvel que você está procurando não existe ou não está disponível.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Link to={`/catalogo/${slug}`}>
              <Button variant="outline">Voltar para o catálogo</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-propulse-50">
      <PublicPropertyHeader 
        companyName={profileData.company_name}
        name={profileData.name}
        slug={slug!}
      />

      <main className="container mx-auto max-w-7xl px-4 py-6 animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="relative overflow-hidden bg-gray-100 rounded-2xl shadow-md aspect-video animate-fade-in">
              {property.images.length > 0 ? (
                <img
                  src={property.images[currentImageIndex]}
                  alt={`${property.title} - Image ${currentImageIndex + 1} of ${property.images.length}`}
                  className="w-full h-full object-cover transition-all duration-500 hover:scale-105 cursor-pointer"
                  onClick={() => openGallery(currentImageIndex)}
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-100 text-gray-400">
                  Nenhuma imagem disponível
                </div>
              )}
              
              {property.images.length > 1 && (
                <>
                  <Button 
                    onClick={prevImage} 
                    size="icon" 
                    variant="ghost"
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white h-8 w-8 rounded-full shadow-md transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  
                  <Button 
                    onClick={nextImage} 
                    size="icon" 
                    variant="ghost"
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white h-8 w-8 rounded-full shadow-md transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                  
                  <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10">
                    {property.images.map((_, idx) => (
                      <span 
                        key={idx} 
                        className={`h-1.5 rounded-full transition-all ${
                          currentImageIndex === idx ? "w-4 bg-white" : "w-1.5 bg-white/60"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
              
              <div className="absolute left-3 top-3 flex gap-2 z-10">
                {property.featured && (
                  <Badge className={featuredBadgeStyle + " shadow"}>Destaque</Badge>
                )}
                <Badge
                  className={statusBadgeStyles[property.status] + " shadow"}
                >
                  {formatStatusText(property.status)}
                </Badge>
              </div>
            </div>

            {property.images.length > 1 && (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-3">
                {property.images.slice(0, 5).map((image, idx) => (
                  <div 
                    key={idx} 
                    className={`aspect-video rounded-md overflow-hidden cursor-pointer border-2 transition-all duration-200 ${
                      currentImageIndex === idx ? 'border-propulse-600 shadow-md scale-105' : 'border-transparent'
                    }`}
                    onClick={() => {
                      setCurrentImageIndex(idx);
                      openGallery(idx);
                    }}
                  >
                    <img 
                      src={image} 
                      alt={`${property.title} - Miniatura ${idx + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            <PropertyDetailsContent property={property} />
          </div>
          
          <PropertyContactSidebar 
            property={property}
            profileData={profileData}
            slug={slug!}
          />
        </div>
      </main>
      
      {property.images.length > 0 && (
        <PropertyImageGallery
          images={property.images}
          initialImageIndex={initialImageIndex}
          isOpen={isGalleryOpen}
          onClose={() => setIsGalleryOpen(false)}
        />
      )}
      
      <PublicPropertyFooter 
        companyName={profileData.company_name}
        name={profileData.name}
      />
    </div>
  );
}
