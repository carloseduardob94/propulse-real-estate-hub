
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "E-mail inválido" }),
  phone: z.string().min(10, { message: "Telefone inválido" }),
  budget: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "O orçamento deve ser um número válido maior ou igual a zero",
  }),
  preferredLocation: z.string().min(3, { message: "A localização deve ter pelo menos 3 caracteres" }),
  message: z.string().min(10, { message: "A mensagem deve ter pelo menos 10 caracteres" }),
  propertyTypes: z.object({
    apartment: z.boolean().optional(),
    house: z.boolean().optional(),
    commercial: z.boolean().optional(),
    land: z.boolean().optional(),
  }).refine((data) => Object.values(data).some(Boolean), {
    message: "Selecione pelo menos um tipo de imóvel",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface LeadFormProps {
  onSubmit?: (data: any) => void;
  className?: string;
}

export function LeadForm({ onSubmit, className }: LeadFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      budget: "",
      preferredLocation: "",
      message: "",
      propertyTypes: {
        apartment: false,
        house: false,
        commercial: false,
        land: false,
      },
    },
  });

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Convert propertyTypes object to array
      const propertyType = Object.entries(values.propertyTypes)
        .filter(([_, selected]) => selected)
        .map(([type]) => type);

      // Calculate a simple lead score based on form completeness and budget
      const budget = Number(values.budget);
      let leadScore = 50; // Base score
      
      // Add points for higher budget
      if (budget > 1000000) leadScore += 20;
      else if (budget > 500000) leadScore += 10;
      
      // Add points for providing detailed information
      if (values.message.length > 50) leadScore += 10;
      if (values.preferredLocation.length > 10) leadScore += 5;
      if (propertyType.length > 1) leadScore += 5;
      
      const leadData = {
        ...values,
        propertyType,
        leadScore,
        budget: Number(values.budget),
        status: 'new',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Simulated delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (onSubmit) {
        onSubmit(leadData);
      }
      
      toast({
        title: "Lead cadastrado!",
        description: "O lead foi cadastrado com sucesso.",
      });
      
      form.reset();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao cadastrar o lead. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle>Cadastrar Novo Lead</CardTitle>
        <CardDescription>
          Preencha os dados do lead para cadastrar no sistema.
        </CardDescription>
      </CardHeader>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              placeholder="Nome completo"
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@exemplo.com"
                {...form.register("email")}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                placeholder="(00) 00000-0000"
                {...form.register("phone")}
              />
              {form.formState.errors.phone && (
                <p className="text-sm text-red-500">{form.formState.errors.phone.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="budget">Orçamento (R$)</Label>
              <Input
                id="budget"
                placeholder="Ex: 500000"
                {...form.register("budget")}
              />
              {form.formState.errors.budget && (
                <p className="text-sm text-red-500">{form.formState.errors.budget.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferredLocation">Localização Desejada</Label>
              <Input
                id="preferredLocation"
                placeholder="Ex: Zona Sul, São Paulo"
                {...form.register("preferredLocation")}
              />
              {form.formState.errors.preferredLocation && (
                <p className="text-sm text-red-500">{form.formState.errors.preferredLocation.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tipos de Imóvel</Label>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="apartment"
                  onCheckedChange={(checked) =>
                    form.setValue("propertyTypes.apartment", checked === true)
                  }
                />
                <Label htmlFor="apartment" className="text-sm font-normal">
                  Apartamento
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="house"
                  onCheckedChange={(checked) =>
                    form.setValue("propertyTypes.house", checked === true)
                  }
                />
                <Label htmlFor="house" className="text-sm font-normal">
                  Casa
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="commercial"
                  onCheckedChange={(checked) =>
                    form.setValue("propertyTypes.commercial", checked === true)
                  }
                />
                <Label htmlFor="commercial" className="text-sm font-normal">
                  Comercial
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="land"
                  onCheckedChange={(checked) =>
                    form.setValue("propertyTypes.land", checked === true)
                  }
                />
                <Label htmlFor="land" className="text-sm font-normal">
                  Terreno
                </Label>
              </div>
            </div>
            {form.formState.errors.propertyTypes && (
              <p className="text-sm text-red-500">{(form.formState.errors.propertyTypes as any).message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Mensagem</Label>
            <Textarea
              id="message"
              placeholder="Mensagem ou observações do lead"
              rows={4}
              {...form.register("message")}
            />
            {form.formState.errors.message && (
              <p className="text-sm text-red-500">{form.formState.errors.message.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Enviando..." : "Cadastrar Lead"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
