
import { useState } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { RegisterForm } from "@/components/auth/register-form";
import { useToast } from "@/hooks/use-toast";
import { Logo } from "@/components/brand/logo";
import { AvatarUpload } from "@/components/auth/avatar-upload";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleLogin = async (data: any) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;

      toast({
        title: "Login realizado com sucesso!",
        description: "Redirecionando para o dashboard...",
      });
      
      // Navigate programmatically after successful login
      navigate('/dashboard');
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Erro no login",
        description: error.message === "Invalid login credentials" 
          ? "Email ou senha incorretos" 
          : "Ocorreu um erro ao fazer login: " + error.message,
        variant: "destructive",
      });
    }
  };

  const handleRegister = async (data: any) => {
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            avatar_url: avatarUrl,
            company_name: data.companyName || null,
          },
        },
      });

      if (error) throw error;
      
      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Você já pode fazer login com suas credenciais.",
      });
      
      setIsLogin(true);
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        title: "Erro no cadastro",
        description: error.message || "Ocorreu um erro ao fazer o cadastro.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-propulse-50 via-white to-propulse-50">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-lg w-full max-w-lg p-8 rounded-2xl shadow-xl space-y-8">
          <div className="text-center space-y-2">
            <Logo className="mx-auto" />
            <h1 className="text-2xl font-bold text-gray-900">
              {isLogin ? "Bem-vindo de volta!" : "Criar nova conta"}
            </h1>
            <p className="text-gray-600">
              {isLogin 
                ? "Entre com suas credenciais para acessar sua conta" 
                : "Preencha os dados abaixo para criar sua conta"}
            </p>
          </div>

          {isLogin ? (
            <LoginForm 
              onSubmit={handleLogin} 
              onRegisterClick={() => setIsLogin(false)} 
            />
          ) : (
            <div className="space-y-6">
              <AvatarUpload 
                user={null}
                url={avatarUrl}
                onUploadComplete={(url) => {
                  setAvatarUrl(url);
                  toast({
                    title: "Avatar carregado com sucesso!",
                    description: "Sua foto foi atualizada.",
                  });
                }}
              />
              <RegisterForm 
                onSubmit={handleRegister} 
                onLoginClick={() => setIsLogin(true)} 
              />
            </div>
          )}
        </div>
      </div>
      
      <footer className="py-6 text-center text-sm text-gray-600">
        &copy; {new Date().getFullYear()} MeuCorretorPRO. Todos os direitos reservados.
      </footer>
    </div>
  );
};

export default AuthPage;
