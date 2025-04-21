
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "@/components/auth/login-form";
import { RegisterForm } from "@/components/auth/register-form";
import { useToast } from "@/hooks/use-toast";
import { Logo } from "@/components/brand/logo";
import { AvatarUpload } from "@/components/auth/avatar-upload";
import { supabase } from "@/integrations/supabase/client";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        
        if (data.session) {
          navigate('/dashboard');
        }
      } catch (error) {
        console.error("Session check error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) navigate('/dashboard');
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogin = async (data: any) => {
    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (data: any) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            company_name: data.companyName,
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
      let errorMessage = error.message;
      
      // Handling specific error messages for better user experience
      if (error.message.includes("User already registered")) {
        errorMessage = "Este email já está cadastrado. Tente fazer login.";
      }
      
      toast({
        title: "Erro no cadastro",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[linear-gradient(108deg,_#f0f5ff_20%,_#fbed96_100%)]">
        <div className="animate-pulse text-propulse-600 font-semibold">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center relative bg-[linear-gradient(108deg,_#f0f5ff_20%,_#fbed96_100%)]">
      {/* Botão "Início" absoluto */}
      <div className="absolute top-8 left-8 z-20">
        <Button
          variant="propulse"
          size="sm"
          onClick={() => navigate('/')}
          aria-label="Início"
          className="shadow-md px-5 py-2 flex items-center gap-1"
        >
          <Home className="h-5 w-5 mr-1" />
          Início
        </Button>
      </div>

      <main className="flex flex-1 justify-center items-center w-full px-2">
        <div
          className="
            animate-[fade-in_0.6s_ease]
            w-full max-w-md md:max-w-lg
            flex flex-col items-center
            bg-white/60 backdrop-blur-2xl
            rounded-3xl shadow-2xl border border-white/40
            p-6 md:p-10
            md:mt-16 mt-10
            glass-morphism
          "
          style={{ boxShadow: "0 8px 40px 0 rgba(86,76,255,0.12)" }}
        >
          <Logo className="mx-auto mb-4 scale-110" iconOnly={!isLogin} />

          <h1 className="text-3xl md:text-4xl font-extrabold text-propulse-700 text-center mb-1 animate-fade-in">
            {isLogin ? "Bem-vindo de volta!" : "Criar nova conta"}
          </h1>
          <p className="text-gray-600 text-base text-center mb-4 max-w-xs font-medium animate-fade-in">
            {isLogin 
              ? "Acesse sua conta para explorar o MeuCorretorPRO"
              : "Preencha as informações para começar sua jornada"}
          </p>

          <div className="w-full flex flex-col gap-4 animate-fade-in">
            {isLogin ? (
              <LoginForm 
                onSubmit={handleLogin} 
                onRegisterClick={() => setIsLogin(false)}
                isLoading={isLoading}
                className="bg-transparent shadow-none border-none"
              />
            ) : (
              <>
                <AvatarUpload
                  user={null}
                  onUploadComplete={(url) => {
                    // Futuro: usaremos url do avatar no perfil
                  }}
                />
                <RegisterForm 
                  onSubmit={handleRegister} 
                  onLoginClick={() => setIsLogin(true)}
                  isLoading={isLoading}
                  className="bg-transparent shadow-none border-none"
                />
              </>
            )}
          </div>
        </div>
      </main>

      <footer className="w-full py-6 text-center text-xs md:text-sm text-gray-500 font-semibold bg-transparent absolute bottom-2">
        &copy; {new Date().getFullYear()}. Todos os direitos reservados.
      </footer>
    </div>
  );
};

export default LoginPage;
