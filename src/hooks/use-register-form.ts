
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "E-mail inválido" }),
  companyName: z.string().optional(),
  whatsapp: z.string()
    .min(14, { message: "WhatsApp deve ter 11 dígitos (incluindo DDD)" })
    .max(15, { message: "WhatsApp inválido" })
    .regex(/^\([0-9]{2}\) 9[0-9]{4}-[0-9]{4}$/, {
      message: "WhatsApp inválido. Use o formato: (11) 91234-5678",
    }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
  confirmPassword: z.string().min(6, { message: "A confirmação de senha deve ter pelo menos 6 caracteres" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

export type FormValues = z.infer<typeof formSchema>;

interface UseRegisterFormProps {
  onSubmit?: (data: FormValues) => void;
  isLoading?: boolean;
}

export function useRegisterForm({ onSubmit, isLoading = false }: UseRegisterFormProps) {
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      companyName: "",
      whatsapp: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleWhatsAppChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, '');
    
    if (input.length <= 11) {
      let formattedInput = input;
      
      if (input.length > 2) {
        formattedInput = `(${input.substring(0, 2)})${input.substring(2)}`;
      }
      
      if (input.length > 7) {
        formattedInput = `(${input.substring(0, 2)}) ${input.substring(2, 7)}-${input.substring(7)}`;
      }
      
      form.setValue('whatsapp', formattedInput, { 
        shouldValidate: true, 
        shouldDirty: true 
      });
    }
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      if (onSubmit) {
        await onSubmit(values);
      }
    } catch (error: any) {
      toast({
        title: "Erro no Cadastro",
        description: error.message || "Não foi possível realizar o cadastro. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  return {
    form,
    handleSubmit,
    handleWhatsAppChange,
  };
}
