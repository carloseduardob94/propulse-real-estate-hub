
import React from 'react';
import { Logo } from '@/components/brand/logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface PublicCatalogHeaderProps {
  profileName: string;
  avatarUrl?: string | null;
}

export const PublicCatalogHeader: React.FC<PublicCatalogHeaderProps> = ({ 
  profileName,
  avatarUrl
}) => {
  // Get the initials from the profile name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className="bg-white border-b shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Logo className="h-8 w-auto" iconOnly />
            
            <div className="h-6 w-px bg-gray-200" />
            
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20 border-2 border-propulse-100"> {/* 80x80 px */}
                <AvatarImage 
                  src={avatarUrl || undefined} 
                  alt={profileName} 
                  className="object-cover aspect-square h-full w-full"
                  // object-fit: cover ensured by className in ui/avatar and tailwind
                />
                <AvatarFallback className="bg-propulse-100 text-propulse-800 font-medium text-lg">
                  {getInitials(profileName)}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <h1 className="font-semibold text-xl md:text-2xl leading-tight">{profileName}</h1>
                <p className="text-sm text-muted-foreground">Catálogo de Imóveis</p>
              </div>
            </div>
          </div>
          
          <div className="hidden md:block">
            <a 
              href="/"
              className="text-sm font-medium text-propulse-600 hover:text-propulse-700 transition-colors"
              aria-label="Voltar para o site"
            >
              Voltar para o site
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};
