
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface PropertyFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  propertyType: string;
  setPropertyType: (value: string) => void;
  bedrooms: number[];
  setBedrooms: (value: number[]) => void;
  bathrooms: number[];
  setBathrooms: (value: number[]) => void;
  priceRange: number[];
  setPriceRange: (value: number[]) => void;
  status: string;
  setStatus: (value: string) => void;
  onResetFilters: () => void;
  onApplyFilters: () => void;
}

export function PropertyFilters({
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
  onResetFilters,
  onApplyFilters
}: PropertyFiltersProps) {
  return (
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
            <Label>
              Faixa de Preço: R$ {priceRange[0].toLocaleString('pt-BR')} - R$ {priceRange[1].toLocaleString('pt-BR')}
            </Label>
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
        
        <div className="flex justify-end mt-4 gap-2">
          <Button variant="outline" onClick={onResetFilters}>
            <X className="mr-2 h-4 w-4" />
            Limpar filtros
          </Button>
          <Button variant="propulse" onClick={onApplyFilters}>
            <Check className="mr-2 h-4 w-4" />
            Aplicar filtros
          </Button>
        </div>
      </div>
    </div>
  );
}
