
import { cn } from "@/lib/utils";
import { Property } from "@/types";
import { Bed, Bath, Car, Maximize2 } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PropertyCardProps {
  property: Property;
  className?: string;
}

export function PropertyCard({ property, className }: PropertyCardProps) {
  return (
    <Card className={cn("overflow-hidden transition-all duration-300 hover:shadow-lg", className)}>
      <div className="relative aspect-video overflow-hidden">
        <img
          src={property.images[0]}
          alt={property.title}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
        {property.featured && (
          <Badge className="absolute left-2 top-2 bg-propulse-600 hover:bg-propulse-700">
            Destaque
          </Badge>
        )}
        <Badge
          variant={property.status === 'forSale' ? 'default' : 'secondary'}
          className="absolute right-2 top-2"
        >
          {property.status === 'forSale' ? 'Venda' : 
           property.status === 'forRent' ? 'Aluguel' : 
           property.status === 'sold' ? 'Vendido' : 'Alugado'}
        </Badge>
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
  );
}
