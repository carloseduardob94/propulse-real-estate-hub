
import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/navbar";
import { useToast } from "@/hooks/use-toast";
import { MOCK_PROPERTIES } from "@/data/mock-data";
import { Property } from "@/types";
import { PropertyCatalogHeader } from "@/components/property/property-catalog-header";
import { PropertyFilters } from "@/components/property/property-filters";
import { PropertyGrid } from "@/components/property/property-grid";

export default function PropertyCatalog() {
  const { toast } = useToast();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const [searchTerm, setSearchTerm] = useState("");
  const [propertyType, setPropertyType] = useState<string>("all");
  const [bedrooms, setBedrooms] = useState<number[]>([0]);
  const [bathrooms, setBathrooms] = useState<number[]>([0]);
  const [priceRange, setPriceRange] = useState<number[]>([0, 10000000]);
  const [status, setStatus] = useState<string>("all");

  useEffect(() => {
    setProperties(MOCK_PROPERTIES);
    setFilteredProperties(MOCK_PROPERTIES);
    
    const prices = MOCK_PROPERTIES.map(p => p.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    setPriceRange([minPrice, maxPrice]);
  }, []);

  useEffect(() => {
    let result = [...properties];
    
    if (searchTerm) {
      result = result.filter(property => 
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.state.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (propertyType !== "all") {
      result = result.filter(property => property.type === propertyType);
    }
    
    if (bedrooms[0] > 0) {
      result = result.filter(property => property.bedrooms >= bedrooms[0]);
    }
    
    if (bathrooms[0] > 0) {
      result = result.filter(property => property.bathrooms >= bathrooms[0]);
    }
    
    result = result.filter(property => 
      property.price >= priceRange[0] && property.price <= priceRange[1]
    );
    
    if (status !== "all") {
      result = result.filter(property => property.status === status);
    }
    
    setFilteredProperties(result);
  }, [properties, searchTerm, propertyType, bedrooms, bathrooms, priceRange, status]);

  const handleShareCatalog = () => {
    const url = window.location.href;
    
    if (navigator.share) {
      navigator.share({
        title: "Catálogo de Imóveis - PropulseHub",
        text: "Confira nosso catálogo de imóveis:",
        url: url,
      }).catch((error) => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(url).then(() => {
        toast({
          title: "Link copiado!",
          description: "Link do catálogo copiado para a área de transferência."
        });
      }).catch(err => {
        console.error('Failed to copy: ', err);
      });
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setPropertyType("all");
    setBedrooms([0]);
    setBathrooms([0]);
    
    const prices = properties.map(p => p.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    setPriceRange([minPrice, maxPrice]);
    
    setStatus("all");
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      
      <PropertyCatalogHeader
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onShare={handleShareCatalog}
      />
      
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
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <PropertyGrid
          properties={filteredProperties}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onResetFilters={resetFilters}
        />
      </main>
      
      <footer className="py-6 bg-white border-t">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} PropulseHub. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
