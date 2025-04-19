
import { useState } from "react";
import { Property } from "@/types";
import { PropertyFilters } from "./property-filters";
import { PropertyGrid } from "./property-grid";
import { usePropertyFilters } from "./property-filter-context";
import { useToast } from "@/hooks/use-toast";

interface PropertyContentProps {
  properties: Property[];
  isLoading: boolean;
  showFilters: boolean;
}

export function PropertyContent({ properties, isLoading, showFilters }: PropertyContentProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  const {
    filteredProperties,
    searchTerm,
    setSearchTerm,
    propertyType,
    setPropertyType,
    bedrooms,
    setBedrooms,
    bathrooms,
    setBathrooms,
    priceRange,
    setPriceRange,
    status,
    setStatus,
    resetFilters
  } = usePropertyFilters();

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApplyFilters = () => {
    setCurrentPage(1);
    toast({
      title: "Filtros aplicados",
      description: `${filteredProperties.length} imóveis encontrados`,
    });
  };

  const itemsPerPage = 9;

  return (
    <>
      <div className={`transition-all duration-500 ease-out transform ${showFilters ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 h-0 overflow-hidden'}`}>
        {showFilters && (
          <PropertyFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            propertyType={propertyType}
            setPropertyType={setPropertyType}
            bedrooms={bedrooms}
            setBedrooms={setBedrooms}
            bathrooms={bathrooms}
            setBathrooms={setBathrooms}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            status={status}
            setStatus={setStatus}
            onResetFilters={resetFilters}
            onApplyFilters={handleApplyFilters}
          />
        )}
      </div>
      
      <PropertyGrid
        properties={filteredProperties}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        onResetFilters={resetFilters}
        isLoading={isLoading}
      />
    </>
  );
}
