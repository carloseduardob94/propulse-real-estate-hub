
import React from "react";
import { X } from "lucide-react";
import { usePropertyFilters } from "@/components/property/property-filter-context";

// Cores por tipo pastel 
const CHIP_STYLES: Record<
  string,
  string
> = {
  search: "bg-gray-100 text-gray-700 border border-gray-200",
  type: "bg-blue-100 text-blue-700 border border-blue-200",
  status: "bg-yellow-100 text-yellow-800 border border-yellow-200",
  bedrooms: "bg-purple-100 text-purple-800 border border-purple-200",
  bathrooms: "bg-orange-100 text-orange-800 border border-orange-200",
  price: "bg-green-100 text-green-800 border border-green-200",
};

interface Chip {
  label: string;
  onRemove: () => void;
  type: string;
}

export const FilterChips: React.FC = () => {
  const {
    searchTerm, setSearchTerm,
    propertyType, setPropertyType,
    bedrooms, setBedrooms,
    bathrooms, setBathrooms,
    priceRange, setPriceRange,
    status, setStatus
  } = usePropertyFilters();

  const filters: Chip[] = [];

  if (searchTerm) {
    filters.push({
      label: `Busca: ${searchTerm}`,
      onRemove: () => setSearchTerm(""),
      type: "search"
    });
  }

  if (propertyType !== "all") {
    const mapType = {
      apartment: "Apartamento",
      house: "Casa",
      commercial: "Comercial",
      land: "Terreno"
    } as Record<string, string>;
    filters.push({
      label: `Tipo: ${mapType[propertyType] || propertyType}`,
      onRemove: () => setPropertyType("all"),
      type: "type"
    });
  }

  if (status !== "all") {
    const mapStatus = {
      forSale: "À Venda",
      forRent: "Para Alugar",
      sold: "Vendido",
      rented: "Alugado"
    } as Record<string, string>;
    filters.push({
      label: `Status: ${mapStatus[status] || status}`,
      onRemove: () => setStatus("all"),
      type: "status"
    });
  }

  if (bedrooms[0] > 0) {
    filters.push({
      label: `Quartos Mín: ${bedrooms[0]}`,
      onRemove: () => setBedrooms([0]),
      type: "bedrooms"
    });
  }

  if (bathrooms[0] > 0) {
    filters.push({
      label: `Banheiros Mín: ${bathrooms[0]}`,
      onRemove: () => setBathrooms([0]),
      type: "bathrooms"
    });
  }

  if (priceRange && (priceRange[0] > 0 || priceRange[1] < 10000000)) {
    filters.push({
      label: `Valor: R$${priceRange[0].toLocaleString('pt-BR')} - R$${priceRange[1].toLocaleString('pt-BR')}`,
      onRemove: () => setPriceRange([0, 10000000]),
      type: "price"
    });
  }

  if (filters.length === 0) return null;

  return (
    <div className="my-4 animate-fade-in">
      <span className="font-medium text-propulse-700 mb-2 block">Filtros ativos:</span>
      <div className="flex flex-wrap gap-3">
        {filters.map((chip, idx) => (
          <span
            key={chip.label}
            className={`flex items-center px-3 py-1.5 rounded-full text-sm font-medium shadow animate-fade-in transition-all duration-200 select-none ${CHIP_STYLES[chip.type] || "bg-gray-100 text-gray-700 border border-gray-200"}`}
            style={{ animationDelay: `0.${idx}5s` }}
          >
            {chip.label}
            <button
              onClick={chip.onRemove}
              aria-label={`Remover filtro ${chip.label}`}
              className="ml-2 p-0.5 rounded-full hover:bg-white/40 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-propulse-400"
              type="button"
              tabIndex={0}
            >
              <X size={18} className="text-inherit" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};
