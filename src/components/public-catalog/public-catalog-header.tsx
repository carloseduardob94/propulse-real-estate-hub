
import React from 'react';

interface PublicCatalogHeaderProps {
  profileName: string;
}

export const PublicCatalogHeader: React.FC<PublicCatalogHeaderProps> = ({ profileName }) => (
  <header className="bg-white border-b">
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold">{profileName}</h1>
      <p className="text-muted-foreground">Catálogo de Imóveis</p>
    </div>
  </header>
);
