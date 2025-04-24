
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Phone } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { PasswordInput } from "./password-input";
import { useRegisterForm, FormValues } from "@/hooks/use-register-form";

interface RegisterFormProps {
  onSubmit?: (data: FormValues) => void;
  onLoginClick?: () => void;
  isLoading?: boolean;
  className?: string;
}

export function RegisterForm({ onSubmit, onLoginClick, isLoading = false, className }: RegisterFormProps) {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const { form, handleSubmit, handleWhatsAppChange } = useRegisterForm({ onSubmit, isLoading });

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
            <Label htmlFor="whatsapp" className="flex items-center">
              <Phone className="h-4 w-4 mr-2" /> WhatsApp
            </Label>
            <Input
              id="whatsapp"
              placeholder="(11) 91234-5678"
              disabled={isLoading}
              {...form.register("whatsapp")}
              onChange={handleWhatsAppChange}
              maxLength={15}
            />
            {form.formState.errors.whatsapp && (
              <p className="text-sm text-red-500">{form.formState.errors.whatsapp.message}</p>
            )}
          </div>
          
          <PasswordInput form={form} isLoading={isLoading} />
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
