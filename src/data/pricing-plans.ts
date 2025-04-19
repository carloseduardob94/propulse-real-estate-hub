import { PlanDetails } from "@/types";

export const PRICING_PLANS: PlanDetails[] = [
  {
    id: "free",
    name: "Plano Free",
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
      },
      {
        id: "free-4",
        title: "Suporte limitado via base de conhecimento",
        description: "Acesso à documentação e tutoriais",
        includedIn: ["free"]
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
    price: 79.90, // IMPORTANT: Corrected to match exact decimal notation
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
        title: "Qualificação automática de leads com Yzze",
        description: "Otimize suas vendas", // Removed "com IA"
        includedIn: ["monthly", "yearly"]
      },
      {
        id: "pro-3",
        title: "Propostas ilimitadas com Yzze",
        description: "Crie propostas profissionais", // Removed "com IA"
        includedIn: ["monthly", "yearly"]
      },
      {
        id: "pro-4",
        title: "Automatize processos como envio de mensagens no WhatsApp, resposta rápida a leads, notificações e muito mais",
        description: "Aumente sua produtividade",
        includedIn: ["monthly", "yearly"]
      },
      {
        id: "pro-5",
        title: "Suporte via e-mail e WhatsApp comercial",
        description: "Atendimento personalizado",
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
    price: 799,
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
        title: "2 Meses Grátis",
        description: "Economize pagando anualmente",
        includedIn: ["yearly"]
      },
      {
        id: "yearly-3",
        title: "Suporte prioritário via WhatsApp e consultoria personalizada",
        description: "Atendimento VIP",
        includedIn: ["yearly"]
      }
    ],
    highlightedFeature: "Melhor Custo-Benefício",
    maxProperties: -1,
    maxProposals: -1,
    supportsLeadScoring: true,
    supportsPdfExport: true
  }
];
