
import { Property } from "@/types";
import { PropertyGridSkeleton } from "./property-grid-skeleton";
import { PropertyEmptyState } from "./property-empty-state";
import { PropertyList } from "./property-list";
import { ReusablePagination } from "@/components/ui/reusable-pagination";

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
      <div className="flex justify-between items-center mb-6">
        <p className="text-muted-foreground">
          Exibindo <span className="font-medium text-foreground">
            {indexOfFirstProperty + 1}-{Math.min(indexOfLastProperty, properties.length)}
          </span> de <span className="font-medium text-foreground">{properties.length}</span> imóveis
        </p>
      </div>
      
      <PropertyList properties={currentProperties} />

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
