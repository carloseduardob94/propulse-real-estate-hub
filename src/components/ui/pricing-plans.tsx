
import { Badge } from "@/components/ui/badge";
import { PricingCard } from "@/components/ui/pricing-card";
import { PlanDetails } from "@/types";

const plans: PlanDetails[] = [
  {
    id: "free",
    name: "Gratuito",
    price: 0,
    period: "free",
    features: [
      {
        id: "free-1",
        title: "Até 3 imóveis",
        description: "Ideal para começar",
        includedIn: ["free", "monthly", "yearly"]
      },
      {
        id: "free-2",
        title: "Gestão de Leads",
        description: "Cadastre e gerencie seus contatos",
        includedIn: ["free", "monthly", "yearly"]
      },
      {
        id: "free-3",
        title: "Propostas Básicas",
        description: "Crie propostas simples em PDF",
        includedIn: ["free", "monthly", "yearly"]
      }
    ],
    maxProperties: 3,
    maxProposals: 10,
    supportsLeadScoring: false,
    supportsPdfExport: true
  },
  {
    id: "monthly",
    name: "Profissional",
    price: 97,
    period: "monthly",
    features: [
      {
        id: "pro-1",
        title: "Imóveis Ilimitados",
        description: "Cadastre todos seus imóveis",
        includedIn: ["monthly", "yearly"]
      },
      {
        id: "pro-2",
        title: "Lead Scoring Automático",
        description: "Qualificação automática de leads",
        includedIn: ["monthly", "yearly"]
      },
      {
        id: "pro-3",
        title: "Propostas Ilimitadas com Yzze (IA)",
        description: "Crie propostas inteligentes com ajuda da IA",
        includedIn: ["monthly", "yearly"]
      },
      {
        id: "pro-4",
        title: "Automações via n8n",
        description: "Integre com outras ferramentas",
        includedIn: ["monthly", "yearly"]
      }
    ],
    highlightedFeature: "Mais Popular",
    maxProperties: -1,
    maxProposals: -1,
    supportsLeadScoring: true,
    supportsPdfExport: true
  },
  {
    id: "yearly",
    name: "Profissional Anual",
    price: 970,
    period: "yearly",
    features: [
      {
        id: "yearly-1",
        title: "Todos os recursos Pro",
        description: "Acesso completo à plataforma",
        includedIn: ["yearly"]
      },
      {
        id: "yearly-2",
        title: "Automações Avançadas",
        description: "Workflows personalizados",
        includedIn: ["yearly"]
      }
    ],
    highlightedFeature: "2 MESES GRÁTIS",
    maxProperties: -1,
    maxProposals: -1,
    supportsLeadScoring: true,
    supportsPdfExport: true
  }
];

export function PricingPlans() {
  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {plans.map((plan) => (
        <PricingCard
          key={plan.id}
          plan={plan}
          isPopular={plan.id === "monthly"}
        />
      ))}
    </div>
  );
}

export { plans };
