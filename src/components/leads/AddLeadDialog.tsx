
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LeadForm } from "@/components/ui/lead-form";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AddLeadDialogProps {
  userId: string;
}

export function AddLeadDialog({ userId }: AddLeadDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleAddLead = async (data: any) => {
    try {
      const { error } = await supabase
        .from('leads')
        .insert({
          user_id: userId,
          name: data.name,
          email: data.email,
          phone: data.phone,
          message: data.notes,
          budget: data.budget ? parseFloat(data.budget) : null,
          preferred_location: data.preferredLocation,
          status: data.status,
        });
        
      if (error) throw error;
      
      toast({
        title: "Sucesso!",
        description: "Lead cadastrado com sucesso"
      });
      
      await queryClient.invalidateQueries({ queryKey: ['leads', userId] });
      setIsOpen(false);
    } catch (error) {
      console.error("Error adding lead:", error);
      toast({
        title: "Erro",
        description: "Não foi possível cadastrar o lead",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="mt-4 md:mt-0">
          <Plus className="h-4 w-4 mr-2" />
          Novo Lead
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Cadastrar novo lead</DialogTitle>
          <DialogDescription>
            Preencha as informações do lead para adicioná-lo ao sistema.
          </DialogDescription>
        </DialogHeader>
        <LeadForm onSubmit={handleAddLead} />
      </DialogContent>
    </Dialog>
  );
}
