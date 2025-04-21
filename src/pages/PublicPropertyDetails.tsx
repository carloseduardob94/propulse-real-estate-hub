
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

export default function PublicPropertyDetails() {
  const { slug, propertyId } = useParams<{ slug: string; propertyId: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState<{ id: string; name: string | null; company_name: string | null } | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // First, fetch the profile by slug
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

        // Then, fetch the property by ID
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
        
        // Transform the property data
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">{profileData.company_name || profileData.name}</h1>
              <p className="text-muted-foreground">Catálogo de Imóveis</p>
            </div>
            <Link to={`/catalogo/${slug}`}>
              <Button variant="outline" size="sm">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Voltar ao catálogo
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Property Gallery Column */}
          <div className="lg:col-span-2">
            <div className="relative overflow-hidden bg-gray-100 rounded-lg aspect-video">
              {property.images.length > 0 ? (
                <img
                  src={property.images[currentImageIndex]}
                  alt={`${property.title} - Imagem ${currentImageIndex + 1} de ${property.images.length}`}
                  className="w-full h-full object-cover"
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
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white h-8 w-8 rounded-full"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  
                  <Button 
                    onClick={nextImage} 
                    size="icon" 
                    variant="ghost" 
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white h-8 w-8 rounded-full"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                  
                  <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
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
              
              <div className="absolute left-2 top-2 flex gap-2">
                {property.featured && (
                  <Badge variant="featured">
                    Destaque
                  </Badge>
                )}
                
                <Badge
                  variant={property.status === 'forSale' ? 'forSale' : 'forRent'}
                >
                  {formatStatusText(property.status)}
                </Badge>
              </div>
            </div>

            {property.images.length > 1 && (
              <div className="grid grid-cols-5 gap-2 mt-2">
                {property.images.slice(0, 5).map((image, idx) => (
                  <div 
                    key={idx} 
                    className={`aspect-video rounded-md overflow-hidden cursor-pointer border-2 ${
                      currentImageIndex === idx ? 'border-propulse-600' : 'border-transparent'
                    }`}
                    onClick={() => setCurrentImageIndex(idx)}
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

            <div className="mt-8">
              <h1 className="text-2xl font-bold">{property.title}</h1>
              <div className="flex items-center gap-1 mt-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <p>{property.address}, {property.city}, {property.state}</p>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                <Card className="bg-gray-50">
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <Bed className="h-5 w-5 mb-1 text-propulse-600" />
                    <p className="text-sm text-muted-foreground">Quartos</p>
                    <p className="font-medium">{property.bedrooms}</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-50">
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <Bath className="h-5 w-5 mb-1 text-propulse-600" />
                    <p className="text-sm text-muted-foreground">Banheiros</p>
                    <p className="font-medium">{property.bathrooms}</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-50">
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <Car className="h-5 w-5 mb-1 text-propulse-600" />
                    <p className="text-sm text-muted-foreground">Vagas</p>
                    <p className="font-medium">{property.parkingSpaces}</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-50">
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <Maximize2 className="h-5 w-5 mb-1 text-propulse-600" />
                    <p className="text-sm text-muted-foreground">Área</p>
                    <p className="font-medium">{property.area} m²</p>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Descrição</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="whitespace-pre-wrap">
                    {property.description || "Nenhuma descrição disponível"}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Informações adicionais</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Tipo de imóvel</p>
                      <p>{formatPropertyType(property.type)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <p>{formatStatusText(property.status)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Cidade</p>
                      <p>{property.city}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Estado</p>
                      <p>{property.state}</p>
                    </div>
                    {property.zipCode && (
                      <div>
                        <p className="text-sm text-muted-foreground">CEP</p>
                        <p>{property.zipCode}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-muted-foreground">Publicado em</p>
                      <p>{new Date(property.createdAt).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Contact Column */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Card className="bg-white shadow-md">
                <CardHeader className="border-b">
                  <CardTitle className="text-2xl">
                    {property.status === 'forSale' ? 'Compre por' : 'Alugue por'}
                  </CardTitle>
                  <p className="text-3xl font-bold text-propulse-600">
                    R$ {property.price.toLocaleString('pt-BR')}
                  </p>
                  {property.status === 'forRent' && <p className="text-sm text-muted-foreground">por mês</p>}
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-center mb-6">
                    Interessado neste imóvel? Entre em contato!
                  </p>
                  
                  {showContactForm ? (
                    <PropertyContactForm 
                      propertyId={property.id} 
                      userId={profileData.id}
                      propertyTitle={property.title}
                      onClose={() => setShowContactForm(false)}
                    />
                  ) : (
                    <Button 
                      className="w-full bg-propulse-600 hover:bg-propulse-700 text-white"
                      onClick={() => setShowContactForm(true)}
                    >
                      Tenho Interesse
                    </Button>
                  )}
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Sobre o anunciante</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <h3 className="font-semibold text-lg">{profileData.company_name || profileData.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">Consulte esse e outros imóveis no catálogo</p>
                    <Link to={`/catalogo/${slug}`} className="block mt-4">
                      <Button variant="outline" className="w-full">
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
      
      <footer className="bg-white border-t py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {profileData.company_name || profileData.name}. Todos os direitos reservados.</p>
          <p className="mt-1">Powered by MeuCorretorPRO</p>
        </div>
      </footer>
    </div>
  );
}
