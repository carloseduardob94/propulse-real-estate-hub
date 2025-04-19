
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface PremiumPromotionProps {
  show: boolean;
}

export function PremiumPromotion({ show }: PremiumPromotionProps) {
  if (!show) return null;

  return (
    <Card className="bg-propulse-50 border-propulse-200">
      <CardHeader>
        <CardTitle>Aumente sua produtividade com o Plano Premium</CardTitle>
        <CardDescription>
          Desbloqueie recursos avançados para potencializar seus resultados
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex items-start gap-2">
            <div className="rounded-full bg-propulse-100 p-1 mt-0.5">
              <Check className="h-4 w-4 text-propulse-600" />
            </div>
            <p className="text-sm">Cadastro ilimitado de imóveis</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="rounded-full bg-propulse-100 p-1 mt-0.5">
              <Check className="h-4 w-4 text-propulse-600" />
            </div>
            <p className="text-sm">Qualificação automática de leads</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="rounded-full bg-propulse-100 p-1 mt-0.5">
              <Check className="h-4 w-4 text-propulse-600" />
            </div>
            <p className="text-sm">Propostas ilimitadas com exportação em PDF</p>
          </div>
        </div>
        <Button asChild>
          <a href="/plans">Ver Planos</a>
        </Button>
      </CardContent>
    </Card>
  );
}
