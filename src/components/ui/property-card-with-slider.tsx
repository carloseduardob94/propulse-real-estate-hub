import { useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Property } from "@/types";
import { Bed, Bath, Car, Maximize2, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PropertyCardWithSliderProps {
  property: Property;
  className?: string;
  isOwner?: boolean;
  onDelete?: () => void;
}

export function PropertyCardWithSlider({ property, className, isOwner = false, onDelete }: PropertyCardWithSliderProps) {
  const { toast } = useToast();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (property.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (property.images.length > 1) {
      setCurrentImageIndex((prev) => (prev === 0 ? property.images.length - 1 : prev - 1));
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', property.id);
        
      if (error) throw error;
      
      toast({
        title: "Imóvel excluído com sucesso!",
        description: "O imóvel foi removido do seu catálogo."
      });
      
      if (onDelete) {
        onDelete();
      }
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

  return (
    <>
      <Card className={cn("overflow-hidden transition-all duration-300 hover:shadow-lg group", className)}>
        <Link to={`/properties/${property.id}`}>
          <div className="relative aspect-video overflow-hidden">
            <img
              src={property.images[currentImageIndex]}
              alt={`${property.title} - Imagem ${currentImageIndex + 1} de ${property.images.length}`}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            />
            
            <div className="absolute left-2 top-2 flex gap-2 z-10">
              {property.featured && (
                <Badge variant="featured">
                  Destaque
                </Badge>
              )}
              
              <Badge
                variant={property.status === 'forSale' ? 'forSale' : 'forRent'}
              >
                {property.status === 'forSale' ? 'Venda' : 
                property.status === 'forRent' ? 'Aluguel' : 
                property.status === 'sold' ? 'Vendido' : 'Alugado'}
              </Badge>
            </div>
            
            {isOwner && (
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDeleteDialogOpen(true);
                }}
                className="absolute right-2 top-2 bg-red-100 hover:bg-red-200 text-red-700 p-1.5 rounded-full transition-colors z-20"
                title="Excluir imóvel"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
            
            {property.images.length > 1 && (
              <>
                <Button 
                  onClick={prevImage} 
                  size="icon" 
                  variant="ghost" 
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                
                <Button 
                  onClick={nextImage} 
                  size="icon" 
                  variant="ghost" 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
                
                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
                  {property.images.map((_, idx) => (
                    <span 
                      key={idx} 
                      className={cn(
                        "h-1.5 rounded-full transition-all",
                        currentImageIndex === idx ? "w-4 bg-white" : "w-1.5 bg-white/60"
                      )}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
          
          <CardHeader className="p-4 pb-0">
            <div className="flex flex-col space-y-1">
              <h3 className="font-semibold line-clamp-1">{property.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-1">
                {property.city}, {property.state}
              </p>
            </div>
          </CardHeader>
          
          <CardContent className="p-4 pt-2">
            <div className="flex justify-between">
              <div className="flex items-center gap-1 text-sm">
                <Bed className="h-4 w-4" />
                <span>{property.bedrooms}</span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Bath className="h-4 w-4" />
                <span>{property.bathrooms}</span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Car className="h-4 w-4" />
                <span>{property.parkingSpaces}</span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Maximize2 className="h-4 w-4" />
                <span>{property.area}m²</span>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex items-center justify-between p-4 pt-0">
            <p className="text-lg font-bold text-propulse-800">
              R$ {property.price.toLocaleString('pt-BR')}
            </p>
            <div className="rounded-full bg-propulse-100 p-2 text-propulse-800 transition-colors hover:bg-propulse-200">
              <ChevronRight className="h-5 w-5" />
            </div>
          </CardFooter>
        </Link>
      </Card>
      
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
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
