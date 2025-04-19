
import { Property } from "@/types";
import { PropertyCard } from "@/components/ui/property-card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Inbox, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PropertySectionProps {
  properties: Property[];
  isLoading: boolean;
  onNewProperty: () => void;
}

export function PropertySection({ properties, isLoading, onNewProperty }: PropertySectionProps) {
  const navigate = useNavigate();
  const recentProperties = properties.slice(0, 3);

  if (isLoading) {
    return <div className="col-span-full text-center py-8">Carregando imóveis...</div>;
  }

  if (recentProperties.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-muted rounded-lg bg-muted/5">
        <div className="rounded-full bg-muted/10 p-4 mb-4">
          <Inbox className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Nenhum dado encontrado</h3>
        <p className="text-muted-foreground text-center mb-4">
          Cadastre seu primeiro imóvel para começar a gerenciar seu portfólio.
        </p>
        <Button 
          onClick={onNewProperty}
          className="bg-propulse-600 hover:bg-propulse-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Imóvel
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recentProperties.map((property) => (
          <div 
            key={property.id}
            className="transition-transform duration-200 hover:scale-[1.02] cursor-pointer group"
            onClick={() => navigate(`/properties/${property.id}`)}
          >
            <div className="relative">
              <PropertyCard property={property} />
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity flex items-center justify-center">
                <div className="bg-white/90 px-4 py-2 rounded-full text-sm font-medium">
                  Ver detalhes
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {properties.length > 3 && (
        <div className="text-center mt-6">
          <Button 
            variant="outline" 
            className="group hover:border-propulse-600 hover:text-propulse-600"
            asChild
          >
            <a href="/properties" className="inline-flex items-center">
              Ver todos os imóveis
              <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </Button>
        </div>
      )}
    </div>
  );
}
