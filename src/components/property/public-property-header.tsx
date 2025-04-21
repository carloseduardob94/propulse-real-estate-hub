
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface PublicPropertyHeaderProps {
  companyName: string | null;
  name: string | null;
  slug: string;
}

export function PublicPropertyHeader({ companyName, name, slug }: PublicPropertyHeaderProps) {
  return (
    <header className="bg-propulse-700 text-white rounded-b-2xl shadow-lg mb-6 animate-fade-in">
      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-montserrat">{companyName || name}</h1>
          <p className="text-propulse-100">Catálogo de Imóveis</p>
        </div>
        <Link to={`/catalogo/${slug}`}>
          <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/20 hover:text-white bg-white/10">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Voltar ao catálogo
          </Button>
        </Link>
      </div>
    </header>
  );
}
