import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  ChevronRight, 
  Bed, 
  Bath, 
  Car, 
  Maximize2, 
  Share2, 
  MapPin, 
  Pencil,
  Trash2 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Property } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { PropertyForm } from "@/components/ui/property-form";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export default function PropertyDetails() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCurrentUserOwner, setIsCurrentUserOwner] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const fetchProperty = async () => {
    if (!id) return;
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      const formattedProperty: Property = {
        id: data.id,
        title: data.title,
        description: data.description || "",
        price: data.price,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zip_code || "",
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        area: data.area,
        parkingSpaces: data.parking_spaces || 0,
        type: data.type as any,
        status: data.status as any,
        images: data.images || [],
        featured: data.featured || false,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
      
      setProperty(formattedProperty);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (session && data.user_id === session.user.id) {
        setIsCurrentUserOwner(true);
      }
    } catch (error) {
      console.error("Error fetching property:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os detalhes do imóvel",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProperty();
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

  const handleEditProperty = async (data: any) => {
    if (!property || !id) return;
    
    try {
      const dbData = {
        title: data.title,
        description: data.description,
        price: parseFloat(data.price),
        address: data.address,
        city: data.city,
        state: data.state,
        zip_code: data.zipCode,
        bedrooms: parseInt(data.bedrooms),
        bathrooms: parseInt(data.bathrooms),
        area: parseFloat(data.area),
        parking_spaces: parseInt(data.parkingSpaces || 0),
        type: data.type,
        status: data.status,
        images: data.images,
        featured: data.featured
      };

      const { error } = await supabase
        .from('properties')
        .update(dbData)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Imóvel atualizado com sucesso!",
        description: "As informações do imóvel foram atualizadas.",
      });

      setIsEditDialogOpen(false);
      fetchProperty();
    } catch (error: any) {
      console.error("Error updating property:", error);
      toast({
        title: "Erro ao atualizar imóvel",
        description: error.message || "Ocorreu um erro ao atualizar as informações do imóvel.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProperty = async () => {
    if (!id) return;
    
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Imóvel excluído com sucesso!",
        description: "O imóvel foi removido do seu catálogo."
      });
      
      navigate('/properties');
    } catch (error: any) {
      console.error("Error deleting property:", error);
      toast({
        title: "Erro ao excluir imóvel",
        description: error.message || "Ocorreu um erro ao excluir o imóvel.",
        variant: "destructive"
      });
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-lg">Carregando detalhes do imóvel...</p>
          </div>
        </main>
      </div>
    );
  }
  
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
          <div className="lg:col-span-2">
            <div className="mb-4 flex justify-between items-center">
              <Link to="/properties" className="text-sm text-muted-foreground hover:text-propulse-700 inline-flex items-center">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Voltar para imóveis
              </Link>
              
              {isCurrentUserOwner && (
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-propulse-700 border-propulse-200 hover:bg-propulse-100"
                    onClick={() => setIsEditDialogOpen(true)}
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-red-700 border-red-200 hover:bg-red-100"
                    onClick={() => setIsDeleteDialogOpen(true)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Excluir
                  </Button>
                </div>
              )}
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
                {property.featured && (
                  <Badge className="bg-propulse-600">
                    Destaque
                  </Badge>
                )}
                
                <Badge variant={property.status === 'forSale' ? 'default' : 'secondary'}>
                  {property.status === 'forSale' ? 'Venda' : 
                   property.status === 'forRent' ? 'Aluguel' : 
                   property.status === 'sold' ? 'Vendido' : 'Alugado'}
                </Badge>
                
                <Badge variant="propulse">
                  {property.type === 'apartment' ? 'Apartamento' : 
                   property.type === 'house' ? 'Casa' : 
                   property.type === 'commercial' ? 'Comercial' : 'Terreno'}
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
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="w-full max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Imóvel</DialogTitle>
            <DialogDescription>
              Atualize as informações do seu imóvel. Clique em salvar quando terminar.
            </DialogDescription>
          </DialogHeader>
          <PropertyForm 
            property={property} 
            onSubmit={handleEditProperty} 
            onCancel={() => setIsEditDialogOpen(false)}
            className="w-full"
          />
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir imóvel</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este imóvel? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteProperty}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
