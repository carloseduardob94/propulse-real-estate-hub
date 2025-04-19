
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Property } from "@/types";
import { Check, FileText, Download } from "lucide-react";

const formSchema = z.object({
  clientName: z.string().min(3, { message: "O nome do cliente deve ter pelo menos 3 caracteres" }),
  clientEmail: z.string().email({ message: "E-mail inválido" }),
  agentName: z.string().min(3, { message: "O nome do corretor deve ter pelo menos 3 caracteres" }),
  agentPhone: z.string().min(10, { message: "Telefone inválido" }),
  companyName: z.string().optional(),
  message: z.string().min(10, { message: "A mensagem deve ter pelo menos 10 caracteres" }),
});

type FormValues = z.infer<typeof formSchema>;

interface ProposalGeneratorProps {
  properties: Property[];
  selectedProperties?: string[];
  onSubmit?: (data: any) => void;
  onExportPdf?: () => void;
  className?: string;
  plan?: 'free' | 'monthly' | 'yearly';
}

export function ProposalGenerator({ 
  properties, 
  selectedProperties = [], 
  onSubmit, 
  onExportPdf,
  className,
  plan = 'free'
}: ProposalGeneratorProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [proposalGenerated, setProposalGenerated] = useState(false);
  const [selectedPropertyIds, setSelectedPropertyIds] = useState<string[]>(selectedProperties);

  const canExportPdf = plan !== 'free';
  const maxProperties = plan === 'free' ? 3 : Infinity;

  const filteredProperties = properties.filter(p => 
    p.status === 'forSale' || p.status === 'forRent'
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientName: "",
      clientEmail: "",
      agentName: "",
      agentPhone: "",
      companyName: "",
      message: "Conforme nossa conversa, estou enviando uma seleção especial de imóveis que acredito atenderem perfeitamente às suas necessidades. Estou à disposição para agendar visitas ou esclarecer quaisquer dúvidas sobre estes imóveis.",
    },
  });

  const handleSubmit = async (values: FormValues) => {
    if (selectedPropertyIds.length === 0) {
      toast({
        title: "Erro",
        description: "Selecione pelo menos um imóvel para gerar a proposta.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulated delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const proposalData = {
        ...values,
        properties: properties.filter(p => selectedPropertyIds.includes(p.id)),
        createdAt: new Date().toISOString(),
      };
      
      if (onSubmit) {
        onSubmit(proposalData);
      }
      
      setProposalGenerated(true);
      
      toast({
        title: "Proposta gerada!",
        description: "A proposta foi gerada com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao gerar a proposta. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePropertyToggle = (propertyId: string) => {
    setSelectedPropertyIds(prev => {
      if (prev.includes(propertyId)) {
        return prev.filter(id => id !== propertyId);
      } else {
        if (prev.length >= maxProperties) {
          toast({
            title: "Limite atingido",
            description: `Seu plano permite selecionar no máximo ${maxProperties} imóveis. Faça upgrade para adicionar mais imóveis.`,
            variant: "destructive",
          });
          return prev;
        }
        return [...prev, propertyId];
      }
    });
  };

  const handleExportPdf = () => {
    if (!canExportPdf) {
      toast({
        title: "Recurso premium",
        description: "A exportação em PDF está disponível apenas nos planos pagos. Faça upgrade do seu plano para acessar este recurso.",
        variant: "destructive",
      });
      return;
    }

    if (onExportPdf) {
      onExportPdf();
    }

    toast({
      title: "PDF gerado!",
      description: "O PDF da proposta foi gerado com sucesso.",
    });
  };

  return (
    <div className={className}>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Gerador de Propostas</CardTitle>
          <CardDescription>
            Selecione os imóveis e preencha as informações para gerar uma proposta personalizada.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Selecione os imóveis ({selectedPropertyIds.length}/{maxProperties})</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProperties.length > 0 ? (
                  filteredProperties.map((property) => (
                    <div 
                      key={property.id}
                      className={`relative rounded-lg border p-2 cursor-pointer transition-all ${
                        selectedPropertyIds.includes(property.id) 
                          ? "border-propulse-500 bg-propulse-50" 
                          : "border-gray-200 hover:border-propulse-200"
                      }`}
                      onClick={() => handlePropertyToggle(property.id)}
                    >
                      <div className="flex gap-3">
                        <div className="w-20 h-20 overflow-hidden rounded-md flex-shrink-0">
                          <img 
                            src={property.images[0]} 
                            alt={property.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm line-clamp-1">{property.title}</h4>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {property.city}, {property.state}
                          </p>
                          <p className="text-sm font-bold mt-1">
                            R$ {property.price.toLocaleString('pt-BR')}
                          </p>
                        </div>
                        {selectedPropertyIds.includes(property.id) && (
                          <div className="absolute top-2 right-2 bg-propulse-500 text-white rounded-full p-1">
                            <Check className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-10 text-center text-muted-foreground">
                    Nenhum imóvel disponível para proposta.
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardHeader>
            <CardTitle>Informações da Proposta</CardTitle>
            <CardDescription>
              Preencha os dados para personalizar a proposta.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="clientName">Nome do Cliente</Label>
                <Input
                  id="clientName"
                  placeholder="Nome do cliente"
                  {...form.register("clientName")}
                />
                {form.formState.errors.clientName && (
                  <p className="text-sm text-red-500">{form.formState.errors.clientName.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="clientEmail">E-mail do Cliente</Label>
                <Input
                  id="clientEmail"
                  type="email"
                  placeholder="cliente@exemplo.com"
                  {...form.register("clientEmail")}
                />
                {form.formState.errors.clientEmail && (
                  <p className="text-sm text-red-500">{form.formState.errors.clientEmail.message}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="agentName">Seu Nome</Label>
                <Input
                  id="agentName"
                  placeholder="Seu nome completo"
                  {...form.register("agentName")}
                />
                {form.formState.errors.agentName && (
                  <p className="text-sm text-red-500">{form.formState.errors.agentName.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="agentPhone">Seu Telefone</Label>
                <Input
                  id="agentPhone"
                  placeholder="(00) 00000-0000"
                  {...form.register("agentPhone")}
                />
                {form.formState.errors.agentPhone && (
                  <p className="text-sm text-red-500">{form.formState.errors.agentPhone.message}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="companyName">Nome da Imobiliária (opcional)</Label>
              <Input
                id="companyName"
                placeholder="Nome da sua imobiliária"
                {...form.register("companyName")}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Mensagem Personalizada</Label>
              <Textarea
                id="message"
                placeholder="Mensagem para o cliente"
                rows={4}
                {...form.register("message")}
              />
              {form.formState.errors.message && (
                <p className="text-sm text-red-500">{form.formState.errors.message.message}</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              disabled={isSubmitting || selectedPropertyIds.length === 0} 
              className="w-full"
            >
              {isSubmitting ? "Gerando..." : proposalGenerated ? "Atualizar Proposta" : "Gerar Proposta"}
            </Button>
            
            {proposalGenerated && (
              <Button 
                type="button" 
                variant={canExportPdf ? "default" : "outline"}
                className="w-full"
                onClick={handleExportPdf}
                disabled={!canExportPdf}
              >
                {canExportPdf ? (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Exportar em PDF
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Exportar em PDF (Plano Premium)
                  </>
                )}
              </Button>
            )}
            
            {!canExportPdf && proposalGenerated && (
              <p className="text-xs text-center text-muted-foreground">
                A exportação em PDF está disponível apenas nos planos pagos.{" "}
                <a href="#pricing" className="text-propulse-600 hover:underline">
                  Faça upgrade
                </a>
              </p>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
