import React from 'react';
import { Logo } from '@/components/brand/logo';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

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

  /**
   * Builds a srcSet attribute string for the avatar image to improve resolution on high-density displays.
   * Assumes that the avatarUrl can be adjusted with a 'width' query param for resizing.
   * If avatarUrl is undefined or does not support resizing, srcSet will be the single image URL.
   */
  const buildSrcSet = (url: string) => {
    // Check if URL already has query params
    const separator = url.includes('?') ? '&' : '?';

    // We create 3 sizes: 80w (1x), 160w (2x), 240w (3x)
    return [
      `${url}${separator}width=80 1x`,
      `${url}${separator}width=160 2x`,
      `${url}${separator}width=240 3x`
    ].join(', ');
  };

  return (
    <header className="bg-white border-b shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Logo className="h-8 w-auto" iconOnly />

            <div className="h-6 w-px bg-gray-200" />

            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16 border-2 border-propulse-100"> {/* 64x64 px */}
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    srcSet={buildSrcSet(avatarUrl)}
                    alt={profileName}
                    width={64}
                    height={64}
                    className="object-cover rounded-full aspect-square"
                    loading="lazy"
                    decoding="async"
                    style={{ imageRendering: 'auto' }}
                  />
                ) : (
                  <AvatarFallback className="bg-propulse-100 text-propulse-800 font-medium text-lg">
                    {getInitials(profileName)}
                  </AvatarFallback>
                )}
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
