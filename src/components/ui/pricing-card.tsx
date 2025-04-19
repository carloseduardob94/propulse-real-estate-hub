
import { cn } from "@/lib/utils";
import { PlanDetails } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PricingCardProps {
  plan: PlanDetails;
  isPopular?: boolean;
  className?: string;
}

export function PricingCard({ plan, isPopular, className }: PricingCardProps) {
  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-300",
      isPopular && "border-propulse-500 shadow-lg",
      className
    )}>
      {plan.highlightedFeature && (
        <div className={cn(
          "absolute right-0 top-0",
          plan.id === "yearly" ? "right-1/2 translate-x-1/2 -top-3 rotate-12" : "right-0 top-0"
        )}>
          <Badge className={cn(
            "px-3 py-1",
            plan.id === "yearly" 
              ? "rounded-full bg-propulse-500 text-white shadow-lg transform transition-all duration-300 hover:scale-110 hover:rotate-0"
              : "rounded-tl-none rounded-br-none rounded-tr-md rounded-bl-md bg-propulse-500 text-white"
          )}>
            {plan.highlightedFeature}
          </Badge>
        </div>
      )}
      <CardHeader className="p-6">
        <CardTitle className="text-2xl">{plan.name}</CardTitle>
        <CardDescription>
          {plan.period === 'free' ? 'Gratuito' : 
           plan.period === 'monthly' ? 'Plano Mensal' : 'Plano Anual'}
        </CardDescription>
        <div className="mt-4 flex items-baseline">
          {plan.price > 0 ? (
            <>
              <span className="text-3xl font-bold">R$ {plan.price}</span>
              <span className="ml-1 text-sm text-muted-foreground">
                /{plan.period === 'monthly' ? 'mês' : 'ano'}
              </span>
            </>
          ) : (
            <span className="text-3xl font-bold">Gratuito</span>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <ul className="space-y-3">
          {plan.features.map((feature) => (
            <li key={feature.id} className="flex items-start gap-2">
              <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-success-500" />
              <div>
                <p className="font-medium">{feature.title}</p>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button 
          className={cn("w-full", 
            isPopular ? "bg-propulse-600 hover:bg-propulse-700" : ""
          )}
          size="lg"
        >
          {plan.period === 'free' ? 'Começar Agora' : 'Assinar Plano'}
        </Button>
      </CardFooter>
    </Card>
  );
}
