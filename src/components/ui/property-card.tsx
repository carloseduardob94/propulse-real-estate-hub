
import { cn } from "@/lib/utils";
import { Property } from "@/types";
import { Bed, Bath, Car, Maximize2, Trash2 } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PropertyCardProps {
  property: Property;
  className?: string;
  isOwner?: boolean;
  onDelete?: () => void;
}

export function PropertyCard({ property, className, isOwner = false, onDelete }: PropertyCardProps) {
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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
      <Card className={cn("overflow-hidden transition-all duration-300 hover:shadow-md", className)}>
        <div className="relative aspect-video overflow-hidden">
          <img
            src={property.images[0]}
            alt={property.title}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute left-2 top-2 flex gap-2">
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
              className="absolute right-2 top-2 bg-red-100 hover:bg-red-200 text-red-700 p-1.5 rounded-full transition-colors"
              title="Excluir imóvel"
            >
              <Trash2 className="h-4 w-4" />
            </button>
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
          <button className="rounded-full bg-propulse-100 p-2 text-propulse-800 transition-colors hover:bg-propulse-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-chevron-right"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </CardFooter>
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
