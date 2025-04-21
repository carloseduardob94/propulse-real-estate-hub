
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
    <Card className="overflow-hidden hover:shadow-md transition-shadow bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-900 dark:to-gray-800/80 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="bg-propulse-50 p-2 rounded-full dark:bg-propulse-900/50">
              <User className="h-6 w-6 text-propulse-600 dark:text-propulse-400" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">{lead.name}</CardTitle>
              {lead.propertyType.length > 0 && (
                <p className="text-sm text-muted-foreground mb-1 font-medium">
                  Interesse: {lead.propertyType.join(", ")}
                </p>
              )}
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold shadow-sm ${getStatusBadgeClass(lead.status)}`}>
                  {getStatusLabel(lead.status)}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold shadow-sm ${getLeadScoreClass(lead.leadScore)}`}>
                  Score: {lead.leadScore}
                </span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-propulse-50 dark:hover:bg-propulse-900/50" asChild>
            <a href={`/leads/${lead.id}`}>
              <ChevronRight className="h-5 w-5 text-propulse-600 dark:text-propulse-400" />
            </a>
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 group hover:text-propulse-600 transition-colors">
            <MailIcon className="h-4 w-4 text-muted-foreground group-hover:text-propulse-600 transition-colors" />
            <span className="text-sm">{lead.email}</span>
          </div>
          
          <div className="flex items-center gap-2 group hover:text-propulse-600 transition-colors">
            <Phone className="h-4 w-4 text-muted-foreground group-hover:text-propulse-600 transition-colors" />
            <span className="text-sm">{lead.phone}</span>
          </div>
          
          <div className="flex items-center gap-2 group hover:text-propulse-600 transition-colors">
            <DollarSign className="h-4 w-4 text-muted-foreground group-hover:text-propulse-600 transition-colors" />
            <span className="text-sm">R$ {lead.budget.toLocaleString('pt-BR')}</span>
          </div>
          
          <div className="flex items-center gap-2 group hover:text-propulse-600 transition-colors">
            <MapPin className="h-4 w-4 text-muted-foreground group-hover:text-propulse-600 transition-colors" />
            <span className="text-sm">{lead.preferredLocation}</span>
          </div>
          
          <div className="flex items-center gap-2 group hover:text-propulse-600 transition-colors">
            <Clock className="h-4 w-4 text-muted-foreground group-hover:text-propulse-600 transition-colors" />
            <span className="text-sm">{new Date(lead.createdAt).toLocaleDateString('pt-BR')}</span>
          </div>

          {lead.message && (
            <div className="flex gap-2 mt-2 p-3 bg-gray-50 rounded-lg dark:bg-gray-800/50 group hover:bg-propulse-50 dark:hover:bg-propulse-900/50 transition-colors">
              <MessageSquare className="h-4 w-4 text-muted-foreground group-hover:text-propulse-600 transition-colors flex-shrink-0 mt-0.5" />
              <span className="text-sm text-muted-foreground line-clamp-2">{lead.message}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

