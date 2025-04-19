
import { Property } from "@/types";
import { PropertyGridSkeleton } from "./property-grid-skeleton";
import { PropertyEmptyState } from "./property-empty-state";
import { PropertyList } from "./property-list";
import { PropertyPagination } from "./property-pagination";
import { PropertyGridHeader } from "./property-grid-header";

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
  if (isLoading) {
    return <PropertyGridSkeleton />;
  }

  if (properties.length === 0) {
    return <PropertyEmptyState onResetFilters={onResetFilters} />;
  }

  const indexOfLastProperty = currentPage * itemsPerPage;
  const indexOfFirstProperty = indexOfLastProperty - itemsPerPage;
  const currentProperties = properties.slice(indexOfFirstProperty, indexOfLastProperty);
  const totalPages = Math.ceil(properties.length / itemsPerPage);

  return (
    <>
      <PropertyGridHeader 
        indexOfFirstProperty={indexOfFirstProperty}
        indexOfLastProperty={indexOfLastProperty}
        totalProperties={properties.length}
      />
      
      <PropertyList properties={currentProperties} />

      {totalPages > 1 && (
        <PropertyPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </>
  );
}
