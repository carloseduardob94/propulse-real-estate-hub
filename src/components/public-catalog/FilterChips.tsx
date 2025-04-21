
import React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { usePropertyFilters } from "@/components/property/property-filter-context";

interface FilterChipsProps {}

export const FilterChips: React.FC<FilterChipsProps> = () => {
  const {
    searchTerm, setSearchTerm,
    propertyType, setPropertyType,
    bedrooms, setBedrooms,
    bathrooms, setBathrooms,
    priceRange, setPriceRange,
    status, setStatus
  } = usePropertyFilters();

  // Helpers for user-friendly labels
  const filters = [];

  if (searchTerm) {
    filters.push({
      label: `Busca: ${searchTerm}`,
      onRemove: () => setSearchTerm("")
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
      onRemove: () => setPropertyType("all")
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
      onRemove: () => setStatus("all")
    });
  }

  if (bedrooms[0] > 0) {
    filters.push({
      label: `Quartos Mín: ${bedrooms[0]}`,
      onRemove: () => setBedrooms([0])
    });
  }

  if (bathrooms[0] > 0) {
    filters.push({
      label: `Banheiros Mín: ${bathrooms[0]}`,
      onRemove: () => setBathrooms([0])
    });
  }

  // Só mostra tag se range NÃO é o padrão [minPrice, maxPrice]
  if (priceRange && (priceRange[0] > 0 || priceRange[1] < 10000000)) {
    // Label amigável
    filters.push({
      label: `Valor: R$${priceRange[0].toLocaleString('pt-BR')} - R$${priceRange[1].toLocaleString('pt-BR')}`,
      onRemove: () => setPriceRange([0, 10000000])
    });
  }

  // Visual chips
  if (filters.length === 0) return null;

  return (
    <div className="my-4">
      <span className="font-medium text-propulse-700 mb-1 block animate-fade-in">Filtros ativos:</span>
      <div className="flex flex-wrap gap-2">
        {filters.map((chip, idx) => (
          <span
            key={chip.label}
            className="flex items-center px-3 py-1.5 rounded-full bg-propulse-100 text-propulse-800 text-sm shadow-sm border border-propulse-200 animate-fade-in transition-all"
            style={{ animationDelay: `0.${idx}5s` }}
          >
            {chip.label}
            <button
              onClick={chip.onRemove}
              aria-label={`Remover filtro ${chip.label}`}
              className="ml-1 p-0.5 rounded-full hover:bg-propulse-200 transition-colors focus:outline-none"
              type="button"
            >
              <X size={16} className="text-propulse-700" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};
