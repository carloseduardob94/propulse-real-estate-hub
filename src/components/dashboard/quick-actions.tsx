
import { Home, Users, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export function QuickActions() {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Ações Rápidas</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Button variant="outline" className="h-auto py-6 justify-start" asChild>
          <a href="/properties/new" className="inline-flex items-center">
            <div className="rounded-full bg-propulse-100 p-3 mr-4">
              <Home className="h-5 w-5 text-propulse-600" />
            </div>
            <div className="text-left">
              <p className="font-medium">Cadastrar Imóvel</p>
              <p className="text-sm text-muted-foreground">Adicione um novo imóvel</p>
            </div>
          </a>
        </Button>
        
        <Button variant="outline" className="h-auto py-6 justify-start" asChild>
          <a href="/leads/new" className="inline-flex items-center">
            <div className="rounded-full bg-success-100 p-3 mr-4">
              <Users className="h-5 w-5 text-success-600" />
            </div>
            <div className="text-left">
              <p className="font-medium">Registrar Lead</p>
              <p className="text-sm text-muted-foreground">Cadastre um novo lead</p>
            </div>
          </a>
        </Button>
        
        <Button variant="outline" className="h-auto py-6 justify-start" asChild>
          <a href="/proposals/new" className="inline-flex items-center">
            <div className="rounded-full bg-blue-100 p-3 mr-4">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-left">
              <p className="font-medium">Gerar Proposta</p>
              <p className="text-sm text-muted-foreground">Crie uma nova proposta</p>
            </div>
          </a>
        </Button>
      </div>
    </div>
  );
}
