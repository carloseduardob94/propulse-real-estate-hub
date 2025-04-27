
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Lead } from "@/types";

export function useLeads(userId: string) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      const typedLeads = data.map(lead => ({
        id: lead.id,
        name: lead.name,
        email: lead.email,
        phone: lead.phone || "",
        message: lead.message || "",
        budget: lead.budget || 0,
        preferredLocation: lead.preferred_location || "",
        propertyType: lead.property_type || [],
        leadScore: lead.lead_score || 0,
        status: lead.status as any || "new",
        createdAt: lead.created_at,
        updatedAt: lead.updated_at
      }));
      
      setLeads(typedLeads);
    } catch (error) {
      console.error("Error fetching leads:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar seus leads",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    leads,
    isLoading,
    fetchLeads
  };
}
