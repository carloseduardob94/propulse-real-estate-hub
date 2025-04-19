
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Bed, Bath, Car, Maximize2, Share2, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { MOCK_PROPERTIES } from "@/data/mock-data";
import { Property } from "@/types";

export default function PropertyDetails() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [property, setProperty] = useState<Property | null>(null);
  
  useEffect(() => {
    // In a real app, this would fetch from an API
    const foundProperty = MOCK_PROPERTIES.find(p => p.id === id);
    setProperty(foundProperty || null);
    
    // Reset image index when property changes
    setCurrentImageIndex(0);
  }, [id]);
  
  const nextImage = () => {
    if (property && property.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }
  };

  const prevImage = () => {
    if (property && property.images.length > 1) {
      setCurrentImageIndex((prev) => (prev === 0 ? property.images.length - 1 : prev - 1));
    }
  };
  
  const handleShare = () => {
    const url = window.location.href;
    
    if (navigator.share) {
      navigator.share({
        title: property?.title || "Detalhes do Imóvel",
        text: `Confira este imóvel: ${property?.title}`,
        url: url,
      }).catch((error) => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(url).then(() => {
        toast({
          title: "Link copiado!",
          description: "Link do imóvel copiado para a área de transferência."
        });
      }).catch(err => {
        console.error('Failed to copy: ', err);
      });
    }
  };
  
  if (!property) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-2">Imóvel não encontrado</h1>
            <p className="text-muted-foreground mb-6">O imóvel que você está procurando não está disponível.</p>
            <Button asChild>
              <Link to="/properties">Ver todos os imóveis</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image Slider and Gallery */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <Link to="/properties" className="text-sm text-muted-foreground hover:text-propulse-700 inline-flex items-center">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Voltar para imóveis
              </Link>
            </div>
            
            <div className="relative aspect-video rounded-xl overflow-hidden mb-4">
              <img
                src={property.images[currentImageIndex]}
                alt={`${property.title} - Imagem ${currentImageIndex + 1} de ${property.images.length}`}
                className="h-full w-full object-cover"
              />
              
              {property.images.length > 1 && (
                <>
                  <Button 
                    onClick={prevImage} 
                    size="icon" 
                    variant="ghost" 
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white h-10 w-10 rounded-full"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  
                  <Button 
                    onClick={nextImage} 
                    size="icon" 
                    variant="ghost" 
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white h-10 w-10 rounded-full"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </>
              )}
              
              <div className="absolute top-4 left-4 flex gap-2">
                <Badge className={property.featured ? "bg-propulse-600" : ""}>
                  {property.featured ? "Destaque" : property.type === 'apartment' ? 'Apartamento' : 
                   property.type === 'house' ? 'Casa' : 
                   property.type === 'commercial' ? 'Comercial' : 'Terreno'}
                </Badge>
                
                <Badge variant={property.status === 'forSale' ? 'default' : 'secondary'}>
                  {property.status === 'forSale' ? 'Venda' : 
                   property.status === 'forRent' ? 'Aluguel' : 
                   property.status === 'sold' ? 'Vendido' : 'Alugado'}
                </Badge>
              </div>
            </div>
            
            {property.images.length > 1 && (
              <div className="grid grid-cols-5 gap-2 mb-6">
                {property.images.map((image, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`aspect-video rounded-md overflow-hidden ${
                      idx === currentImageIndex ? "ring-2 ring-propulse-500" : "opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${idx + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Property Details */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-2xl font-bold">{property.title}</h1>
                    <div className="flex items-center text-muted-foreground mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{property.address}, {property.city}, {property.state}</span>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={handleShare}
                    title="Compartilhar"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="text-3xl font-bold text-propulse-800 mb-6">
                  R$ {property.price.toLocaleString('pt-BR')}
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-1 mb-1">
                      <Bed className="h-5 w-5 text-propulse-600" />
                      <span className="text-xl font-semibold">{property.bedrooms}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">Quartos</span>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-1 mb-1">
                      <Bath className="h-5 w-5 text-propulse-600" />
                      <span className="text-xl font-semibold">{property.bathrooms}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">Banheiros</span>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-1 mb-1">
                      <Car className="h-5 w-5 text-propulse-600" />
                      <span className="text-xl font-semibold">{property.parkingSpaces}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">Vagas</span>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-1 mb-1">
                      <Maximize2 className="h-5 w-5 text-propulse-600" />
                      <span className="text-xl font-semibold">{property.area}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">m²</span>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-2">Descrição</h2>
                  <p className="text-muted-foreground">{property.description}</p>
                </div>
                
                <div className="flex flex-col gap-3">
                  <Button>Agendar visita</Button>
                  <Button variant="outline">Entrar em contato</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <footer className="py-6 bg-white border-t">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} PropulseHub. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
