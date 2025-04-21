
import { Lead } from "@/types";
import { User, MailIcon, Phone, DollarSign, MapPin, Clock, ChevronRight, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface LeadCardProps {
  lead: Lead;
}

export function LeadCard({ lead }: LeadCardProps) {
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-700";
      case "contacted":
        return "bg-yellow-100 text-yellow-700";
      case "qualified":
        return "bg-green-100 text-green-700";
      case "unqualified":
        return "bg-red-100 text-red-700";
      case "converted":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "new":
        return "Novo";
      case "contacted":
        return "Contatado";
      case "qualified":
        return "Qualificado";
      case "unqualified":
        return "Desqualificado";
      case "converted":
        return "Convertido";
      default:
        return status;
    }
  };

  const getLeadScoreClass = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-700";
    if (score >= 50) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="bg-gray-100 p-2 rounded-full">
              <User className="h-6 w-6 text-propulse-600" />
            </div>
            <div>
              <CardTitle className="text-lg">{lead.name}</CardTitle>
              {lead.propertyType.length > 0 && (
                <p className="text-sm text-muted-foreground mb-1">
                  Interesse: {lead.propertyType.join(", ")}
                </p>
              )}
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusBadgeClass(lead.status)}`}>
                  {getStatusLabel(lead.status)}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${getLeadScoreClass(lead.leadScore)}`}>
                  Score: {lead.leadScore}
                </span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full" asChild>
            <a href={`/leads/${lead.id}`}>
              <ChevronRight className="h-5 w-5" />
            </a>
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <MailIcon className="h-4 w-4 text-muted-foreground" />
            <span>{lead.email}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{lead.phone}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span>Orçamento: R$ {lead.budget.toLocaleString('pt-BR')}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>Região: {lead.preferredLocation}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>Cadastrado em: {new Date(lead.createdAt).toLocaleDateString('pt-BR')}</span>
          </div>
          
          {lead.message && (
            <div className="flex gap-2 mt-1">
              <MessageSquare className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
              <span className="text-sm text-muted-foreground line-clamp-2">{lead.message}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

