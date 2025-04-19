
import { Lead } from "@/types";
import { LeadCard } from "@/components/ui/lead-card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Inbox, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface LeadSectionProps {
  leads: Lead[];
  isLoading: boolean;
  onNewLead: () => void;
}

export function LeadSection({ leads, isLoading, onNewLead }: LeadSectionProps) {
  const navigate = useNavigate();
  const topLeads = leads
    .sort((a, b) => b.leadScore - a.leadScore)
    .slice(0, 3);

  if (isLoading) {
    return <div className="col-span-full text-center py-8">Carregando leads...</div>;
  }

  if (topLeads.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-muted rounded-lg bg-muted/5">
        <div className="rounded-full bg-muted/10 p-4 mb-4">
          <Inbox className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Nenhum dado encontrado</h3>
        <p className="text-muted-foreground text-center mb-4">
          Adicione seu primeiro lead para começar a gerenciar seus contatos.
        </p>
        <Button 
          onClick={onNewLead}
          className="bg-propulse-600 hover:bg-propulse-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Lead
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topLeads.map((lead) => (
          <div 
            key={lead.id}
            className="transition-transform duration-200 hover:scale-[1.02] cursor-pointer group"
            onClick={() => navigate(`/leads/${lead.id}`)}
          >
            <div className="relative">
              <LeadCard lead={lead} />
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity flex items-center justify-center">
                <div className="bg-white/90 px-4 py-2 rounded-full text-sm font-medium">
                  Ver detalhes
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {leads.length > 3 && (
        <div className="text-center mt-6">
          <Button 
            variant="outline" 
            className="group hover:border-propulse-600 hover:text-propulse-600"
            asChild
          >
            <a href="/leads" className="inline-flex items-center">
              Ver todos os leads
              <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </Button>
        </div>
      )}
    </div>
  );
}
