
import { Property } from "@/types";
import { PropertyCardWithSlider } from "@/components/ui/property-card-with-slider";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReusablePagination } from "@/components/ui/reusable-pagination";
import { Skeleton } from "@/components/ui/skeleton";

interface PropertyGridProps {
  properties: Property[];
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onResetFilters: () => void;
  isLoading?: boolean;
}

export function PropertyGrid({
  properties,
  currentPage,
  itemsPerPage,
  onPageChange,
  onResetFilters,
  isLoading = false
}: PropertyGridProps) {
  const indexOfLastProperty = currentPage * itemsPerPage;
  const indexOfFirstProperty = indexOfLastProperty - itemsPerPage;
  const currentProperties = properties.slice(indexOfFirstProperty, indexOfLastProperty);
  const totalPages = Math.ceil(properties.length / itemsPerPage);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="w-full max-w-md">
          <div className="space-y-3">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <img 
          src="/lovable-uploads/1e820eef-1dc6-45a5-b3cb-a00ca35ec455.png"
          alt="No properties found"
          className="w-64 h-64 mb-8"
        />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Nenhum imóvel encontrado
        </h2>
        <p className="text-gray-600 text-center mb-6 max-w-md">
          Adicione novos imóveis usando o botão "Novo Imóvel" acima.
        </p>
        <Button onClick={onResetFilters} variant="outline" className="min-w-[200px]">
          <Plus className="mr-2 h-4 w-4" />
          Limpar filtros
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <p className="text-muted-foreground">
          Exibindo <span className="font-medium text-foreground">
            {indexOfFirstProperty + 1}-{Math.min(indexOfLastProperty, properties.length)}
          </span> de <span className="font-medium text-foreground">{properties.length}</span> imóveis
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentProperties.map((property) => (
          <PropertyCardWithSlider key={property.id} property={property} />
        ))}
      </div>

      {totalPages > 1 && (
        <ReusablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </>
  );
}
