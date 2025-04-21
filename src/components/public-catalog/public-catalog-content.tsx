
import { useState } from "react";
import { Link } from "react-router-dom";
import { PropertyFilters } from "@/components/property/property-filters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { usePropertyFilters } from "@/components/property/property-filter-context";

interface ProfileData {
  id: string;
  name: string | null;
  company_name: string | null;
}

interface PublicCatalogContentProps {
  properties: any[];
  isLoading: boolean;
  onResetFilters: () => void;
  profileData: ProfileData;
  slug: string;
}

export function PublicCatalogContent({
  properties, isLoading, profileData, slug
}: Omit<PublicCatalogContentProps, 'onResetFilters'> & { onResetFilters?: () => void }) {
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

  const itemsPerPage = 9;

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Carregando catálogo...</span>
      </div>
    );
  }

  return (
    <>
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

      {/* Property Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((property) => (
          <Link
            key={property.id}
            to={`/catalogo/${slug}/${property.id}`}
            className="block hover:no-underline transition-transform hover:translate-y-[-4px]"
          >
            <Card className="overflow-hidden h-full flex flex-col">
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={property.images[0] || '/placeholder.svg'}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader className="p-4 pb-0">
                <CardTitle className="text-lg">{property.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {property.city}, {property.state}
                </p>
              </CardHeader>
              <CardContent className="p-4 flex-grow">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{property.bedrooms} quartos</span>
                  <span>{property.bathrooms} banheiros</span>
                  <span>{property.area} m²</span>
                </div>
                <p className="mt-4 text-lg font-bold text-propulse-600">
                  R$ {property.price.toLocaleString('pt-BR')}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      {filteredProperties.length > itemsPerPage && (
        <div className="flex justify-center mt-8">
          <div className="flex gap-2">
            {Array.from({ length: Math.ceil(filteredProperties.length / itemsPerPage) }).map((_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`h-10 w-10 rounded-md flex items-center justify-center ${
                  currentPage === i + 1
                    ? "bg-propulse-600 text-white"
                    : "bg-white text-gray-600 border hover:bg-gray-50"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
