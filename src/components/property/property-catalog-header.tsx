
import { Button } from "@/components/ui/button";
import { Share2, Filter, X } from "lucide-react";

interface PropertyCatalogHeaderProps {
  showFilters: boolean;
  onToggleFilters: () => void;
  onShare: () => void;
}

export function PropertyCatalogHeader({
  showFilters,
  onToggleFilters,
  onShare
}: PropertyCatalogHeaderProps) {
  return (
    <div className="bg-propulse-700 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Catálogo de Imóveis</h1>
            <p className="text-propulse-100">Encontre o imóvel ideal para você</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              className="bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white"
              onClick={onShare}
            >
              <Share2 className="mr-2 h-4 w-4" />
              Compartilhar
            </Button>
            
            <Button 
              variant={showFilters ? "secondary" : "outline"}
              className={`${!showFilters ? "bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white" : ""}`}
              onClick={onToggleFilters}
            >
              {showFilters ? <X className="mr-2 h-4 w-4" /> : <Filter className="mr-2 h-4 w-4" />}
              {showFilters ? "Fechar Filtros" : "Filtros"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
