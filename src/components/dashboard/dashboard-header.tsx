
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface DashboardHeaderProps {
  user: {
    name: string;
    email: string;
    plan: "free";
  };
  onNewProperty: () => void;
  onNewLead: () => void;
}

export function DashboardHeader({ user, onNewProperty, onNewLead }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Bem-vindo de volta, {user.name}!
        </p>
      </div>
      <div className="flex gap-3 mt-4 md:mt-0">
        <Button 
          onClick={onNewProperty}
          className="bg-propulse-600 hover:bg-propulse-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Imóvel
        </Button>
        <Button 
          variant="outline"
          onClick={onNewLead}
          className="border-propulse-600 text-propulse-600 hover:bg-propulse-50 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Lead
        </Button>
      </div>
    </div>
  );
}
