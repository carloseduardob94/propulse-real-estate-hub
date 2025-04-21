
import { Card, CardContent } from "@/components/ui/card";
import { Bed, Bath, Car, Maximize2 } from "lucide-react";

interface PropertyInfoCardsProps {
  bedrooms: number;
  bathrooms: number;
  parkingSpaces: number;
  area: number;
}

export function PropertyInfoCards({ bedrooms, bathrooms, parkingSpaces, area }: PropertyInfoCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
      <Card className="bg-blue-50 border-blue-100 shadow-none animate-fade-in">
        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
          <Bed className="h-5 w-5 mb-1 text-blue-600" />
          <p className="text-xs text-muted-foreground">Quartos</p>
          <p className="font-medium text-lg">{bedrooms}</p>
        </CardContent>
      </Card>
      
      <Card className="bg-green-50 border-green-100 shadow-none animate-fade-in">
        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
          <Bath className="h-5 w-5 mb-1 text-green-600" />
          <p className="text-xs text-muted-foreground">Banheiros</p>
          <p className="font-medium text-lg">{bathrooms}</p>
        </CardContent>
      </Card>
      
      <Card className="bg-amber-50 border-amber-100 shadow-none animate-fade-in">
        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
          <Car className="h-5 w-5 mb-1 text-amber-600" />
          <p className="text-xs text-muted-foreground">Vagas</p>
          <p className="font-medium text-lg">{parkingSpaces}</p>
        </CardContent>
      </Card>
      
      <Card className="bg-purple-50 border-purple-100 shadow-none animate-fade-in">
        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
          <Maximize2 className="h-5 w-5 mb-1 text-purple-600" />
          <p className="text-xs text-muted-foreground">Área</p>
          <p className="font-medium text-lg">{area} m²</p>
        </CardContent>
      </Card>
    </div>
  );
}
