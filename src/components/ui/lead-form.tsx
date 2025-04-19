
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

const formSchema = z.object({
  name: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  phone: z.string().min(10, { message: "Telefone inválido" }),
  budget: z.string().min(1, { message: "Orçamento é obrigatório" }),
  preferredLocation: z.string().min(2, { message: "Localização é obrigatória" }),
  notes: z.string(),
  status: z.enum(["new", "contacted", "qualified", "unqualified", "converted"]),
});

type FormValues = z.infer<typeof formSchema>;

interface LeadFormProps {
  lead?: any;
  onSubmit?: (data: FormValues) => void;
  className?: string;
}

export function LeadForm({ lead, onSubmit, className }: LeadFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: lead || {
      name: "",
      email: "",
      phone: "",
      budget: "",
      preferredLocation: "",
      notes: "",
      status: "new",
    },
  });

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      if (onSubmit) {
        onSubmit(values);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Nome</Label>
          <Input
            id="name"
            {...form.register("name")}
            placeholder="Nome do lead"
          />
          {form.formState.errors.name && (
            <p className="text-sm text-red-500 mt-1">{form.formState.errors.name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...form.register("email")}
            placeholder="email@exemplo.com"
          />
          {form.formState.errors.email && (
            <p className="text-sm text-red-500 mt-1">{form.formState.errors.email.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            {...form.register("phone")}
            placeholder="(11) 99999-9999"
          />
          {form.formState.errors.phone && (
            <p className="text-sm text-red-500 mt-1">{form.formState.errors.phone.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="budget">Orçamento</Label>
          <Input
            id="budget"
            {...form.register("budget")}
            placeholder="R$ 500.000"
          />
          {form.formState.errors.budget && (
            <p className="text-sm text-red-500 mt-1">{form.formState.errors.budget.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="preferredLocation">Localização Preferida</Label>
          <Input
            id="preferredLocation"
            {...form.register("preferredLocation")}
            placeholder="Região ou bairro de interesse"
          />
          {form.formState.errors.preferredLocation && (
            <p className="text-sm text-red-500 mt-1">{form.formState.errors.preferredLocation.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="notes">Observações</Label>
          <Textarea
            id="notes"
            {...form.register("notes")}
            placeholder="Adicione notas ou observações sobre o lead"
          />
        </div>

        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            onValueChange={(value) => form.setValue("status", value as any)}
            defaultValue={form.getValues("status")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">Novo</SelectItem>
              <SelectItem value="contacted">Contatado</SelectItem>
              <SelectItem value="qualified">Qualificado</SelectItem>
              <SelectItem value="unqualified">Desqualificado</SelectItem>
              <SelectItem value="converted">Convertido</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full bg-propulse-600 hover:bg-propulse-700"
      >
        {isSubmitting ? "Salvando..." : lead ? "Atualizar Lead" : "Cadastrar Lead"}
      </Button>
    </form>
  );
}
