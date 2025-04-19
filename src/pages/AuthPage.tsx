
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/auth/auth-layout";
import { LoginForm } from "@/components/auth/login-form";
import { RegisterForm } from "@/components/auth/register-form";
import { supabase } from "@/integrations/supabase/client";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleLogin = async (data: { email: string; password: string }) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;

      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error signing in:", error.message);
      throw error;
    }
  };

  const handleRegister = async (data: { email: string; password: string; name: string }) => {
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

      // Switch to login view after successful registration
      setIsLogin(true);
    } catch (error: any) {
      console.error("Error signing up:", error.message);
      throw error;
    }
  };

  return (
    <AuthLayout
      title={isLogin ? "Entrar" : "Criar conta"}
      description={
        isLogin
          ? "Entre com seu e-mail e senha"
          : "Crie sua conta gratuita"
      }
    >
      {isLogin ? (
        <LoginForm
          onSubmit={handleLogin}
          onRegisterClick={() => setIsLogin(false)}
        />
      ) : (
        <RegisterForm
          onSubmit={handleRegister}
          onLoginClick={() => setIsLogin(true)}
        />
      )}
    </AuthLayout>
  );
}
