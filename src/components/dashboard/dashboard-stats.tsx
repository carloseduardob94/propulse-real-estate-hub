
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Users, FileText, Settings } from "lucide-react";
import { Property, Lead } from "@/types";

interface DashboardStatsProps {
  properties: Property[];
  leads: Lead[];
  plan: "free" | "monthly" | "yearly";
}

export function DashboardStats({ properties, leads, plan }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total de Imóveis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Home className="h-5 w-5 text-propulse-600 mr-2" />
            <div className="text-2xl font-bold">{properties.length}</div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {plan === 'free' ? `${properties.length}/3 imóveis (Plano Free)` : 'Ilimitado'}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total de Leads
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Users className="h-5 w-5 text-propulse-600 mr-2" />
            <div className="text-2xl font-bold">{leads.length}</div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {leads.filter(l => l.leadScore >= 80).length} leads qualificados
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Propostas Geradas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <FileText className="h-5 w-5 text-propulse-600 mr-2" />
            <div className="text-2xl font-bold">0</div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {plan === 'free' ? '0/1 propostas mensais' : 'Ilimitado'}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Seu Plano
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Settings className="h-5 w-5 text-propulse-600 mr-2" />
            <div className="text-2xl font-bold capitalize">
              {plan === 'free' ? 'Free' : plan === 'monthly' ? 'Mensal' : 'Anual'}
            </div>
          </div>
          {plan === 'free' && (
            <Button variant="link" className="text-xs p-0 h-6 mt-1" asChild>
              <a href="/plans">Fazer upgrade</a>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
