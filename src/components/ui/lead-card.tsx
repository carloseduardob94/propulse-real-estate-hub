
import { cn } from "@/lib/utils";
import { Lead } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail, DollarSign, MapPin, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface LeadCardProps {
  lead: Lead;
  className?: string;
}

export function LeadCard({ lead, className }: LeadCardProps) {
  const getLeadScoreColor = (score: number) => {
    if (score >= 80) return "text-success-500 bg-success-50";
    if (score >= 60) return "text-amber-500 bg-amber-50";
    return "text-red-500 bg-red-50";
  };

  const getStatusBadge = (status: Lead['status']) => {
    switch (status) {
      case 'new':
        return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Novo</Badge>;
      case 'contacted':
        return <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">Contatado</Badge>;
      case 'qualified':
        return <Badge variant="outline" className="bg-success-50 text-success-600 border-success-200">Qualificado</Badge>;
      case 'unqualified':
        return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Não Qualificado</Badge>;
      case 'converted':
        return <Badge variant="outline" className="bg-propulse-50 text-propulse-600 border-propulse-200">Convertido</Badge>;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { 
      addSuffix: true,
      locale: ptBR
    });
  };

  return (
    <Card className={cn("overflow-hidden transition-all duration-300 hover:shadow-md", className)}>
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{lead.name}</CardTitle>
          <div className="flex items-center gap-2">
            {getStatusBadge(lead.status)}
          </div>
        </div>
        <CardDescription className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>{formatDate(lead.createdAt)}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-2 pb-2">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{lead.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span>{lead.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span>R$ {lead.budget.toLocaleString('pt-BR')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{lead.preferredLocation}</span>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {lead.propertyType.map((type) => (
              <Badge key={type} variant="secondary" className="text-xs">
                {type === 'apartment' ? 'Apartamento' : 
                 type === 'house' ? 'Casa' : 
                 type === 'commercial' ? 'Comercial' : 'Terreno'}
              </Badge>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{lead.message}</p>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4 pt-2">
        <div className={cn("px-2 py-1 rounded-md font-medium text-sm", getLeadScoreColor(lead.leadScore))}>
          Lead Score: {lead.leadScore}
        </div>
        <div className="flex gap-2">
          <button className="rounded-full bg-blue-100 p-2 text-blue-600 transition-colors hover:bg-blue-200">
            <Mail className="h-4 w-4" />
          </button>
          <button className="rounded-full bg-success-100 p-2 text-success-600 transition-colors hover:bg-success-200">
            <Phone className="h-4 w-4" />
          </button>
        </div>
      </CardFooter>
    </Card>
  );
}
