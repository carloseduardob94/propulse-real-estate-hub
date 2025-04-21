import { useState } from "react";
import { Link } from "react-router-dom";
import { PropertyFilters } from "@/components/property/property-filters";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, MapPin, Home, Bed, Bath, Maximize2, ArrowRight } from "lucide-react";
import { usePropertyFilters } from "@/components/property/property-filter-context";
import { FilterChips } from "./FilterChips";

interface ProfileData {
  id: string;
  name: string | null;
  company_name: string | null;
}

interface PublicCatalogContentProps {
  properties: any[];
  isLoading: boolean;
  onResetFilters?: () => void;
  profileData: ProfileData;
  slug: string;
}

export function PublicCatalogContent({
  properties, isLoading, profileData, slug
}: PublicCatalogContentProps) {
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
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-propulse-600 mr-2" />
        <span className="text-propulse-800 font-medium">Carregando imóveis...</span>
      </div>
    );
  }

  const getPropertyTypeLabel = (type: string) => {
    switch (type) {
      case 'apartment': return 'Apartamento';
      case 'house': return 'Casa';
      case 'commercial': return 'Comercial';
      case 'land': return 'Terreno';
      default: return type;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'forSale': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'forRent': return 'bg-green-100 text-green-800 border-green-200';
      case 'sold': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'rented': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'forSale': return 'Venda';
      case 'forRent': return 'Aluguel';
      case 'sold': return 'Vendido';
      case 'rented': return 'Alugado';
      default: return status;
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-sm p-6 border">
        <h2 className="text-2xl font-bold mb-2">Imóveis disponíveis</h2>
        <p className="text-muted-foreground mb-6">
          Confira nossa seleção de {properties.length} imóveis disponíveis no catálogo
        </p>
        
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

        <FilterChips />
      </div>

      {filteredProperties.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center border">
          <Home className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Nenhum imóvel encontrado</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Não encontramos imóveis com os filtros selecionados. Tente ajustar os filtros ou volte mais tarde.
          </p>
          <Button onClick={resetFilters} variant="outline">Limpar filtros</Button>
        </div>
      ) : (
        <>
          {/* Property Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((property) => (
              <Link
                key={property.id}
                to={`/catalogo/${slug}/${property.id}`}
                className="block hover:no-underline group"
              >
                <Card className="overflow-hidden h-full flex flex-col border-transparent hover:border-propulse-200 transition-all duration-300 hover:shadow-md">
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                    <img
                      src={property.images[0] || '/placeholder.svg'}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                      {property.featured && (
                        <Badge className="bg-propulse-100 text-propulse-800 border-propulse-200">
                          Destaque
                        </Badge>
                      )}
                      <Badge className={getStatusBadgeVariant(property.status)}>
                        {getStatusLabel(property.status)}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-4 flex-grow flex flex-col">
                    <div className="mb-2 flex items-start justify-between">
                      <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-propulse-700 transition-colors">
                        {property.title}
                      </h3>
                      <Badge variant="outline" className="ml-2 shrink-0">
                        {getPropertyTypeLabel(property.type)}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center text-sm text-muted-foreground mb-3">
                      <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                      <span className="truncate">{property.city}, {property.state}</span>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-2 my-3">
                      <div className="flex flex-col items-center p-1.5 bg-blue-50 rounded">
                        <Bed className="h-4 w-4 text-blue-600 mb-1" />
                        <span className="text-xs font-medium">{property.bedrooms}</span>
                      </div>
                      <div className="flex flex-col items-center p-1.5 bg-green-50 rounded">
                        <Bath className="h-4 w-4 text-green-600 mb-1" />
                        <span className="text-xs font-medium">{property.bathrooms}</span>
                      </div>
                      <div className="flex flex-col items-center p-1.5 bg-amber-50 rounded">
                        <Maximize2 className="h-4 w-4 text-amber-600 mb-1" />
                        <span className="text-xs font-medium">{property.area}m²</span>
                      </div>
                      <div className="flex flex-col items-center p-1.5 bg-purple-50 rounded">
                        <Home className="h-4 w-4 text-purple-600 mb-1" />
                        <span className="text-xs font-medium">{property.parkingSpaces}</span>
                      </div>
                    </div>

                    <div className="mt-auto pt-3 flex items-center justify-between border-t">
                      <p className="text-lg font-bold text-propulse-700">
                        R$ {property.price.toLocaleString('pt-BR')}
                      </p>
                      
                      <Button size="sm" className="group-hover:bg-propulse-700 transition-colors">
                        Ver Detalhes <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
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
                    className={`h-10 w-10 rounded-md flex items-center justify-center transition-colors ${
                      currentPage === i + 1
                        ? "bg-propulse-600 text-white shadow-sm"
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
      )}
    </div>
  );
}
