
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Navbar } from "@/components/layout/navbar";
import { LoginForm } from "@/components/auth/login-form";
import { RegisterForm } from "@/components/auth/register-form";
import { useToast } from "@/hooks/use-toast";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (data: any) => {
    // Simulated login - in a real app, this would call an authentication service
    console.log("Login data:", data);
    
    // Show success toast
    toast({
      title: "Login realizado com sucesso!",
      description: "Redirecionando para o dashboard...",
    });
    
    // Redirect to dashboard after a short delay
    setTimeout(() => {
      navigate("/dashboard");
    }, 1500);
  };

  const handleRegister = (data: any) => {
    // Simulated registration - in a real app, this would call an authentication service
    console.log("Register data:", data);
    
    // Show success toast
    toast({
      title: "Cadastro realizado com sucesso!",
      description: "Você já pode fazer login com suas credenciais.",
    });
    
    // Switch to login form after registration
    setIsLogin(true);
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="w-full max-w-md">
          {isLogin ? (
            <LoginForm 
              onSubmit={handleLogin} 
              onRegisterClick={toggleForm} 
            />
          ) : (
            <RegisterForm 
              onSubmit={handleRegister} 
              onLoginClick={toggleForm} 
            />
          )}
        </div>
      </main>
      
      <footer className="py-6 bg-white border-t">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} MeuCorretorPRO. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;
