
import React from 'react';
import { Property } from "@/types";
import { PropertyCardWithSlider } from "@/components/ui/property-card-with-slider";
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="rounded-lg overflow-hidden border border-gray-200">
            <Skeleton className="w-full h-48" />
            <div className="p-4 space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
              <div className="pt-2 flex justify-between">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-12 flex flex-col items-center">
        <img 
          src="/lovable-uploads/1db02422-8cd7-4d1f-b4c6-813d5ca1afa5.png" 
          alt="Nenhum imóvel encontrado" 
          className="w-64 h-64 mb-6 opacity-80"
        />
        <h2 className="text-xl font-semibold mb-2">Nenhum imóvel encontrado</h2>
        <p className="text-muted-foreground mb-6">Tente ajustar os filtros para ver mais resultados.</p>
        <Button onClick={onResetFilters}>Limpar filtros</Button>
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
