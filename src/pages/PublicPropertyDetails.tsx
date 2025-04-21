import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Property } from "@/types";
import { 
  Card, 
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { 
  Bed, 
  Bath, 
  Car, 
  Maximize2, 
  MapPin, 
  Calendar, 
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PropertyContactForm } from "@/components/property/property-contact-form";
import { Skeleton } from "@/components/ui/skeleton";
import { PropertyImageGallery } from "@/components/property/property-image-gallery";

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
  const [showContactForm, setShowContactForm] = useState(false);
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

  const formatStatusText = (status: string) => {
    switch (status) {
      case 'forSale': return 'Venda';
      case 'forRent': return 'Aluguel';
      case 'sold': return 'Vendido';
      case 'rented': return 'Alugado';
      default: return status;
    }
  };

  const formatPropertyType = (type: string) => {
    switch (type) {
      case 'house': return 'Casa';
      case 'apartment': return 'Apartamento';
      case 'land': return 'Terreno';
      case 'commercial': return 'Comercial';
      case 'rural': return 'Rural';
      default: return type;
    }
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
      <header className="bg-propulse-700 text-white rounded-b-2xl shadow-lg mb-6 animate-fade-in">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-montserrat">{profileData.company_name || profileData.name}</h1>
            <p className="text-propulse-100">Catálogo de Imóveis</p>
          </div>
          <Link to={`/catalogo/${slug}`}>
            <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/20 hover:text-white bg-white/10">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Voltar ao catálogo
            </Button>
          </Link>
        </div>
      </header>

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

            <div className="mt-8 space-y-6">
              <h1 className="text-3xl font-bold font-montserrat text-propulse-700">{property.title}</h1>
              <div className="flex items-center gap-2 text-muted-foreground text-base">
                <MapPin className="h-5 w-5" />
                <span>{property.address}, {property.city}, {property.state}</span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <Card className="bg-blue-50 border-blue-100 shadow-none animate-fade-in">
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <Bed className="h-5 w-5 mb-1 text-blue-600" />
                    <p className="text-xs text-muted-foreground">Quartos</p>
                    <p className="font-medium text-lg">{property.bedrooms}</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-green-50 border-green-100 shadow-none animate-fade-in">
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <Bath className="h-5 w-5 mb-1 text-green-600" />
                    <p className="text-xs text-muted-foreground">Banheiros</p>
                    <p className="font-medium text-lg">{property.bathrooms}</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-amber-50 border-amber-100 shadow-none animate-fade-in">
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <Car className="h-5 w-5 mb-1 text-amber-600" />
                    <p className="text-xs text-muted-foreground">Vagas</p>
                    <p className="font-medium text-lg">{property.parkingSpaces}</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-purple-50 border-purple-100 shadow-none animate-fade-in">
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <Maximize2 className="h-5 w-5 mb-1 text-purple-600" />
                    <p className="text-xs text-muted-foreground">Área</p>
                    <p className="font-medium text-lg">{property.area} m²</p>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="rounded-xl bg-white/90 shadow p-0 animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-propulse-700 text-xl mb-1">Descrição</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="whitespace-pre-wrap text-base text-gray-700">
                    {property.description || "Nenhuma descrição disponível"}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="rounded-xl bg-white/90 shadow p-0 animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-propulse-700 text-xl mb-1">Informações adicionais</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                    <div>
                      <p className="text-xs text-muted-foreground">Tipo de imóvel</p>
                      <p className="text-base font-medium">{formatPropertyType(property.type)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Status</p>
                      <p className="text-base font-medium">{formatStatusText(property.status)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Cidade</p>
                      <p className="text-base font-medium">{property.city}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Estado</p>
                      <p className="text-base font-medium">{property.state}</p>
                    </div>
                    {property.zipCode && (
                      <div>
                        <p className="text-xs text-muted-foreground">CEP</p>
                        <p className="text-base font-medium">{property.zipCode}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-muted-foreground">Publicado em</p>
                      <p className="text-base font-medium">{new Date(property.createdAt).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="lg:col-span-1 mt-6 lg:mt-0 animate-fade-in">
            <div className="sticky top-8 space-y-6">
              <Card className="bg-white/95 shadow-lg rounded-xl animate-fade-in">
                <CardHeader className="border-b">
                  <CardTitle className="text-2xl font-bold text-propulse-700">
                    {property.status === 'forSale' ? 'Compre por' : 'Alugue por'}
                  </CardTitle>
                  <p className="text-3xl font-extrabold text-propulse-600 mt-1">
                    R$ {property.price.toLocaleString('pt-BR')}
                  </p>
                  {property.status === 'forRent' && <p className="text-xs text-muted-foreground">por mês</p>}
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-center mb-6 text-base">
                    Interessado neste imóvel? Entre em contato!
                  </p>
                  
                  {showContactForm ? (
                    <PropertyContactForm 
                      propertyId={property.id} 
                      userId={profileData.id}
                      propertyTitle={property.title}
                      propertyPrice={property.price}
                      propertyRegion={`${property.address}, ${property.city}, ${property.state}`}
                      onClose={() => setShowContactForm(false)}
                    />
                  ) : (
                    <Button 
                      className="w-full bg-propulse-600 hover:bg-propulse-700 text-white font-semibold text-lg animate-fade-in"
                      onClick={() => setShowContactForm(true)}
                    >
                      Tenho Interesse
                    </Button>
                  )}
                </CardContent>
              </Card>
              
              <Card className="rounded-xl shadow bg-white/95 py-2 px-2 animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-propulse-700 text-lg">Sobre o anunciante</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <h3 className="font-semibold text-base">{profileData.company_name || profileData.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">Consulte esse e outros imóveis no catálogo</p>
                    <Link to={`/catalogo/${slug}`} className="block mt-4">
                      <Button variant="outline" className="w-full border-propulse-300 text-propulse-700 hover:bg-propulse-50 font-medium shadow-sm">
                        Ver catálogo completo
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
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
      
      <footer className="bg-white border-t py-6 mt-12 animate-fade-in">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {profileData.company_name || profileData.name}. Todos os direitos reservados.</p>
          <p className="mt-1">Powered by MeuCorretorPRO</p>
        </div>
      </footer>
    </div>
  );
}
