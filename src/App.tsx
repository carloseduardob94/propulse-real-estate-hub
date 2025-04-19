import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

const queryClient = new QueryClient();

const App = () => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes and update session
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Configure session persistence for 7 days
    supabase.auth.setSession({
      access_token: session?.access_token || '',
      refresh_token: session?.refresh_token || '',
    }, {
      expiresIn: 604800 // 7 days in seconds
    });

    return () => subscription.unsubscribe();
  }, [session]);

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
