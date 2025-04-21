import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPropertyType, formatStatusText } from "@/utils/property-formatters";
import { PropertyInfoCards } from "./property-info-cards";
import { Property } from "@/types";
import { MapPin } from "lucide-react";

interface PropertyDetailsContentProps {
  property: Property;
}

export function PropertyDetailsContent({ property }: PropertyDetailsContentProps) {
  return (
    <div className="lg:col-span-2">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold font-montserrat text-propulse-700">{property.title}</h1>
        <div className="flex items-center gap-2 text-muted-foreground text-base">
          <MapPin className="h-5 w-5" />
          <span>{property.address}, {property.city}, {property.state}</span>
        </div>
        
        <PropertyInfoCards
          bedrooms={property.bedrooms}
          bathrooms={property.bathrooms}
          parkingSpaces={property.parkingSpaces}
          area={property.area}
        />
        
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
  );
}
