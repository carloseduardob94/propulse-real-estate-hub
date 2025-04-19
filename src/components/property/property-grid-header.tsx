
import React from "react";

interface PropertyGridHeaderProps {
  indexOfFirstProperty: number;
  indexOfLastProperty: number;
  totalProperties: number;
}

export function PropertyGridHeader({
  indexOfFirstProperty,
  indexOfLastProperty,
  totalProperties
}: PropertyGridHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <p className="text-muted-foreground">
        Exibindo <span className="font-medium text-foreground">
          {indexOfFirstProperty + 1}-{Math.min(indexOfLastProperty, totalProperties)}
        </span> de <span className="font-medium text-foreground">{totalProperties}</span> imóveis
      </p>
    </div>
  );
}
