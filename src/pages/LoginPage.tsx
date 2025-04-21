
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "@/components/auth/login-form";
import { RegisterForm } from "@/components/auth/register-form";
import { useToast } from "@/hooks/use-toast";
import { Logo } from "@/components/brand/logo";
import { AvatarUpload } from "@/components/auth/avatar-upload";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [session, setSession] = useState(supabase.auth.getSession());

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate('/dashboard');
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) navigate('/dashboard');
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

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
    } catch (error: any) {
      toast({
        title: "Erro no login",
        description: error.message === "Invalid login credentials" 
          ? "Email ou senha incorretos" 
          : "Ocorreu um erro ao fazer login",
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
      toast({
        title: "Erro no cadastro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-propulse-50 via-white to-propulse-50">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-lg w-full max-w-lg p-8 rounded-2xl shadow-xl space-y-8">
          {/* Botão Voltar para o início */}
          <Button
            variant="ghost"
            size="sm"
            className="mb-2 text-propulse-600 hover:text-propulse-700 flex items-center"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Voltar para o início
          </Button>

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
            <>
              <AvatarUpload 
                user={null}
                onUploadComplete={(url) => {
                  console.log('Avatar URL:', url);
                }}
              />
              <RegisterForm 
                onSubmit={handleRegister} 
                onLoginClick={() => setIsLogin(true)} 
              />
            </>
          )}
        </div>
      </div>
      
      <footer className="py-6 text-center text-sm text-gray-600">
        &copy; {new Date().getFullYear()} MeuCorretorPRO. Todos os direitos reservados.
      </footer>
    </div>
  );
};

export default LoginPage;

