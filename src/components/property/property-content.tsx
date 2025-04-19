
import { useState } from "react";
import { Property } from "@/types";
import { PropertyFilters } from "./property-filters";
import { PropertyGrid } from "./property-grid";
import { usePropertyFilters } from "./property-filter-context";

interface PropertyContentProps {
  properties: Property[];
  isLoading: boolean;
  showFilters: boolean;
}

export function PropertyContent({ properties, isLoading, showFilters }: PropertyContentProps) {
  const [currentPage, setCurrentPage] = useState(1);
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

  const itemsPerPage = 9;

  return (
    <>
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
        />
      )}
      
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
