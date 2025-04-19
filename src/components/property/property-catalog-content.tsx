
import { Property } from "@/types";
import { PropertyFilterProvider } from "@/components/property/property-filter-context";
import { PropertyContent } from "./property-content";
import { PropertyGrid } from "./property-grid";

interface PropertyCatalogContentProps {
  properties: Property[];
  isLoading: boolean;
  showFilters: boolean;
}

export function PropertyCatalogContent({ properties, isLoading, showFilters }: PropertyCatalogContentProps) {
  return (
    <PropertyFilterProvider properties={properties}>
      <div className="container mx-auto px-4 py-6">
        {showFilters ? (
          <PropertyContent properties={properties} isLoading={isLoading} />
        ) : (
          <div className="mt-4">
            <PropertyGrid
              properties={properties}
              currentPage={1}
              itemsPerPage={9}
              onPageChange={() => {}}
              onResetFilters={() => {}}
              isLoading={isLoading}
            />
          </div>
        )}
      </div>
    </PropertyFilterProvider>
  );
}
