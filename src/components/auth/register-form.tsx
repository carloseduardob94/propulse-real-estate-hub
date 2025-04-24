import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  name: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "E-mail inválido" }),
  companyName: z.string().optional(),
  whatsapp: z.string().regex(/^\([0-9]{2}\) 9[0-9]{4}-[0-9]{4}$/, {
    message: "WhatsApp inválido. Use o formato: (11) 91234-5678",
  }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
  confirmPassword: z.string().min(6, { message: "A confirmação de senha deve ter pelo menos 6 caracteres" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof formSchema>;

interface RegisterFormProps {
  onSubmit?: (data: FormValues) => void;
  onLoginClick?: () => void;
  isLoading?: boolean;
  className?: string;
}

export function RegisterForm({ onSubmit, onLoginClick, isLoading = false, className }: RegisterFormProps) {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      companyName: "",
      password: "",
      confirmPassword: "",
    },
  });

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

  return (
    <Card className={className}>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Cadastro no MeuCorretorPRO</CardTitle>
        <CardDescription>
          Crie sua conta para começar a usar o MeuCorretorPRO
        </CardDescription>
      </CardHeader>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              placeholder="Seu nome completo"
              disabled={isLoading}
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="corretor@example.com"
              disabled={isLoading}
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="companyName">Nome da Imobiliária (opcional)</Label>
            <Input
              id="companyName"
              placeholder="Nome da sua imobiliária"
              disabled={isLoading}
              {...form.register("companyName")}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="whatsapp">WhatsApp</Label>
            <Input
              id="whatsapp"
              placeholder="(11) 91234-5678"
              disabled={isLoading}
              {...form.register("whatsapp")}
            />
            {form.formState.errors.whatsapp && (
              <p className="text-sm text-red-500">{form.formState.errors.whatsapp.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                disabled={isLoading}
                {...form.register("password")}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={isLoading}
                className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {form.formState.errors.password && (
              <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                disabled={isLoading}
                {...form.register("confirmPassword")}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={isLoading}
                className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {form.formState.errors.confirmPassword && (
              <p className="text-sm text-red-500">{form.formState.errors.confirmPassword.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={acceptedTerms}
              onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
              disabled={isLoading}
            />
            <Label
              htmlFor="terms"
              className="text-sm text-muted-foreground"
            >
              Li e aceito os termos de uso e política de privacidade
            </Label>
          </div>
          <Button 
            type="submit" 
            disabled={isLoading || !acceptedTerms} 
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                Cadastrando...
              </>
            ) : (
              "Cadastrar"
            )}
          </Button>
          <div className="text-center text-sm">
            Já tem uma conta?{" "}
            <Button 
              variant="link" 
              className="p-0 h-auto"
              type="button"
              disabled={isLoading}
              onClick={onLoginClick}
            >
              Faça login
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
