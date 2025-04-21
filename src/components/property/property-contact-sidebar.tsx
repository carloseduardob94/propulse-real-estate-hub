
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { PropertyContactForm } from "./property-contact-form";
import { Property } from "@/types";
import { useState } from "react";

interface PropertyContactSidebarProps {
  property: Property;
  profileData: {
    id: string;
    name: string | null;
    company_name: string | null;
  };
  slug: string;
}

export function PropertyContactSidebar({ property, profileData, slug }: PropertyContactSidebarProps) {
  const [showContactForm, setShowContactForm] = useState(false);
  
  return (
    <div className="lg:col-span-1 mt-6 lg:mt-0 animate-fade-in">
      <div className="sticky top-8 space-y-6">
        <Card className="bg-white/95 shadow-lg rounded-xl animate-fade-in">
          <CardHeader className="border-b">
            <CardTitle className="text-2xl font-bold text-propulse-700">
              {property.status === 'forSale' ? 'Compre por' : 'Alugue por'}
            </CardTitle>
            <p className="text-3xl font-extrabold text-propulse-600 mt-1">
              R$ {property.price.toLocaleString('pt-BR')}
            </p>
            {property.status === 'forRent' && <p className="text-xs text-muted-foreground">por mês</p>}
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-center mb-6 text-base">
              Interessado neste imóvel? Entre em contato!
            </p>
            
            {showContactForm ? (
              <PropertyContactForm 
                propertyId={property.id} 
                userId={profileData.id}
                propertyTitle={property.title}
                propertyPrice={property.price}
                propertyRegion={`${property.address}, ${property.city}, ${property.state}`}
                onClose={() => setShowContactForm(false)}
              />
            ) : (
              <Button 
                className="w-full bg-propulse-600 hover:bg-propulse-700 text-white font-semibold text-lg animate-fade-in"
                onClick={() => setShowContactForm(true)}
              >
                Tenho Interesse
              </Button>
            )}
          </CardContent>
        </Card>
        
        <Card className="rounded-xl shadow bg-white/95 py-2 px-2 animate-fade-in">
          <CardHeader>
            <CardTitle className="text-propulse-700 text-lg">Sobre o anunciante</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <h3 className="font-semibold text-base">{profileData.company_name || profileData.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">Consulte esse e outros imóveis no catálogo</p>
              <Link to={`/catalogo/${slug}`} className="block mt-4">
                <Button variant="outline" className="w-full border-propulse-300 text-propulse-700 hover:bg-propulse-50 font-medium shadow-sm">
                  Ver catálogo completo
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
