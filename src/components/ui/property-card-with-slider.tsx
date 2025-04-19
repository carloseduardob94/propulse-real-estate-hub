
import { useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Property } from "@/types";
import { Bed, Bath, Car, Maximize2, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface PropertyCardWithSliderProps {
  property: Property;
  className?: string;
}

export function PropertyCardWithSlider({ property, className }: PropertyCardWithSliderProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  return (
    <Card className={cn("overflow-hidden transition-all duration-300 hover:shadow-lg group", className)}>
      <Link to={`/properties/${property.id}`}>
        <div className="relative aspect-video overflow-hidden">
          <img
            src={property.images[currentImageIndex]}
            alt={`${property.title} - Imagem ${currentImageIndex + 1} de ${property.images.length}`}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
          
          {property.featured && (
            <Badge className="absolute left-2 top-2 bg-propulse-600 hover:bg-propulse-700 z-10">
              Destaque
            </Badge>
          )}
          
          <Badge
            variant={property.status === 'forSale' ? 'default' : 'secondary'}
            className="absolute right-2 top-2 z-10"
          >
            {property.status === 'forSale' ? 'Venda' : 
             property.status === 'forRent' ? 'Aluguel' : 
             property.status === 'sold' ? 'Vendido' : 'Alugado'}
          </Badge>
          
          {property.images.length > 1 && (
            <>
              <Button 
                onClick={prevImage} 
                size="icon" 
                variant="ghost" 
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              
              <Button 
                onClick={nextImage} 
                size="icon" 
                variant="ghost" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
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
  );
}
