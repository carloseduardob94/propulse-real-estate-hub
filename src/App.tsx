
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import PropertyDetails from "./pages/PropertyDetails";
import PropertyCatalog from "./pages/PropertyCatalog";
import LeadsPage from "./pages/LeadsPage";
import ProposalsPage from "./pages/ProposalsPage";
import PlansPage from "./pages/PlansPage";
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import AuthPage from "./pages/AuthPage";

const queryClient = new QueryClient();

const App = () => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<AuthPage />} />
            <Route 
              path="/dashboard" 
              element={
                session ? <Dashboard /> : <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="/properties" 
              element={<PropertyCatalog />} 
            />
            <Route 
              path="/properties/:id" 
              element={<PropertyDetails />} 
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
