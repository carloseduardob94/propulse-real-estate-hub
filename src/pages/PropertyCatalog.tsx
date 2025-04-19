import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/navbar";
import { PropertyCardWithSlider } from "@/components/ui/property-card-with-slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Share2, Info, Filter, X } from "lucide-react";
import { MOCK_PROPERTIES } from "@/data/mock-data";
import { Property } from "@/types";

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

  const indexOfLastProperty = currentPage * itemsPerPage;
  const indexOfFirstProperty = indexOfLastProperty - itemsPerPage;
  const currentProperties = filteredProperties.slice(indexOfFirstProperty, indexOfLastProperty);
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="bg-propulse-700 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Catálogo de Imóveis</h1>
              <p className="text-propulse-100">Encontre o imóvel ideal para você</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                className="bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white"
                onClick={handleShareCatalog}
              >
                <Share2 className="mr-2 h-4 w-4" />
                Compartilhar
              </Button>
              
              <Button 
                variant={showFilters ? "secondary" : "outline"}
                className={`${!showFilters ? "bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white" : ""}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                {showFilters ? <X className="mr-2 h-4 w-4" /> : <Filter className="mr-2 h-4 w-4" />}
                {showFilters ? "Fechar Filtros" : "Filtros"}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {showFilters && (
        <div className="border-b bg-white shadow-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <div>
                <Label htmlFor="search">Pesquisar</Label>
                <Input
                  id="search"
                  placeholder="Buscar por nome, cidade..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="property-type">Tipo de Imóvel</Label>
                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger id="property-type" className="mt-1">
                    <SelectValue placeholder="Todos os tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os tipos</SelectItem>
                    <SelectItem value="apartment">Apartamento</SelectItem>
                    <SelectItem value="house">Casa</SelectItem>
                    <SelectItem value="commercial">Comercial</SelectItem>
                    <SelectItem value="land">Terreno</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger id="status" className="mt-1">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="forSale">À Venda</SelectItem>
                    <SelectItem value="forRent">Para Alugar</SelectItem>
                    <SelectItem value="sold">Vendido</SelectItem>
                    <SelectItem value="rented">Alugado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Quartos (mínimo: {bedrooms[0]})</Label>
                <Slider
                  value={bedrooms}
                  min={0}
                  max={5}
                  step={1}
                  onValueChange={setBedrooms}
                  className="my-5"
                />
              </div>
              
              <div>
                <Label>Banheiros (mínimo: {bathrooms[0]})</Label>
                <Slider
                  value={bathrooms}
                  min={0}
                  max={5}
                  step={1}
                  onValueChange={setBathrooms}
                  className="my-5"
                />
              </div>
              
              <div className="md:col-span-2">
                <Label>Faixa de Preço: R$ {priceRange[0].toLocaleString('pt-BR')} - R$ {priceRange[1].toLocaleString('pt-BR')}</Label>
                <Slider
                  value={priceRange}
                  min={100000}
                  max={10000000}
                  step={50000}
                  onValueChange={setPriceRange}
                  className="my-5"
                />
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={resetFilters} className="mr-2">
                <X className="mr-2 h-4 w-4" />
                Limpar filtros
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {filteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <Info className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Nenhum imóvel encontrado</h2>
            <p className="text-muted-foreground mb-6">Tente ajustar os filtros para ver mais resultados.</p>
            <Button onClick={resetFilters}>Limpar filtros</Button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <p className="text-muted-foreground">
                Exibindo <span className="font-medium text-foreground">
                  {indexOfFirstProperty + 1}-{Math.min(indexOfLastProperty, filteredProperties.length)}
                </span> de <span className="font-medium text-foreground">{filteredProperties.length}</span> imóveis
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentProperties.map((property) => (
                <PropertyCardWithSlider key={property.id} property={property} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    {currentPage > 1 && (
                      <PaginationItem>
                        <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} />
                      </PaginationItem>
                    )}

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => handlePageChange(page)}
                          isActive={currentPage === page}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    {currentPage < totalPages && (
                      <PaginationItem>
                        <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </main>
      
      <footer className="py-6 bg-white border-t">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} PropulseHub. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
