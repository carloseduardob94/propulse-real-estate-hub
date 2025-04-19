
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Property } from '@/types';

interface FilterContextType {
  filteredProperties: Property[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  propertyType: string;
  setPropertyType: (type: string) => void;
  bedrooms: number[];
  setBedrooms: (beds: number[]) => void;
  bathrooms: number[];
  setBathrooms: (baths: number[]) => void;
  priceRange: number[];
  setPriceRange: (range: number[]) => void;
  status: string;
  setStatus: (status: string) => void;
  resetFilters: () => void;
}

const PropertyFilterContext = createContext<FilterContextType | undefined>(undefined);

export function PropertyFilterProvider({ 
  children,
  properties 
}: { 
  children: ReactNode;
  properties: Property[];
}) {
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(properties);
  const [searchTerm, setSearchTerm] = useState("");
  const [propertyType, setPropertyType] = useState<string>("all");
  const [bedrooms, setBedrooms] = useState<number[]>([0]);
  const [bathrooms, setBathrooms] = useState<number[]>([0]);
  const [priceRange, setPriceRange] = useState<number[]>([0, 10000000]);
  const [status, setStatus] = useState<string>("all");

  useEffect(() => {
    const prices = properties.map(p => p.price);
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 10000000;
    setPriceRange([minPrice, maxPrice]);
  }, [properties]);

  useEffect(() => {
    console.log('Filtering properties with:', {
      searchTerm, 
      propertyType, 
      bedrooms: bedrooms[0], 
      bathrooms: bathrooms[0], 
      priceRange, 
      status
    });

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
    
    console.log('Filtered results:', result.length);
    setFilteredProperties(result);
  }, [properties, searchTerm, propertyType, bedrooms, bathrooms, priceRange, status]);

  const resetFilters = () => {
    console.log('Resetting all filters');
    setSearchTerm("");
    setPropertyType("all");
    setBedrooms([0]);
    setBathrooms([0]);
    
    const prices = properties.map(p => p.price);
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 10000000;
    setPriceRange([minPrice, maxPrice]);
    
    setStatus("all");
  };

  return (
    <PropertyFilterContext.Provider
      value={{
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
      }}
    >
      {children}
    </PropertyFilterContext.Provider>
  );
}

export const usePropertyFilters = () => {
  const context = useContext(PropertyFilterContext);
  if (context === undefined) {
    throw new Error('usePropertyFilters must be used within a PropertyFilterProvider');
  }
  return context;
};
