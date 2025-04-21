
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import PropertyDetails from "./pages/PropertyDetails";
import PropertyCatalog from "./pages/PropertyCatalog";
import LeadsPage from "./pages/LeadsPage";
import ProposalsPage from "./pages/ProposalsPage";
import PlansPage from "./pages/PlansPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import PublicCatalog from "./pages/PublicCatalog";

const queryClient = new QueryClient();

const App = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Set up auth state listener FIRST
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, newSession) => {
          console.log("Auth state changed:", _event, !!newSession);
          setSession(newSession);
        });

        // THEN check for existing session
        const { data } = await supabase.auth.getSession();
        console.log("Initial session:", !!data.session);
        setSession(data.session);
        
        // Only set the session if there is one to prevent unnecessary token refresh
        if (data.session) {
          await supabase.auth.setSession({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
          });
        }
        
        setIsLoading(false);
        
        return () => subscription?.unsubscribe();
      } catch (error) {
        console.error("Auth initialization error:", error);
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-propulse-50 to-gray-100">
        <div className="animate-pulse text-propulse-600 font-semibold">Carregando...</div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route 
              path="/login" 
              element={
                session ? <Navigate to="/dashboard" replace /> : <LoginPage />
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                session ? <Dashboard /> : <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="/properties" 
              element={
                session ? <PropertyCatalog /> : <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="/properties/:id" 
              element={
                session ? <PropertyDetails /> : <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="/leads" 
              element={
                session ? <LeadsPage /> : <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="/proposals" 
              element={
                session ? <ProposalsPage /> : <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="/plans" 
              element={<PlansPage />} 
            />
            <Route 
              path="/profile" 
              element={
                session ? <ProfilePage /> : <Navigate to="/login" replace />
              } 
            />
            <Route path="/catalogo/:slug" element={<PublicCatalog />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
