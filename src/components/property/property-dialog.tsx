
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PropertyForm } from "@/components/ui/property-form";
import { useProperties } from "@/hooks/use-properties";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface PropertyDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function PropertyDialog({ isOpen, onOpenChange, onSuccess }: PropertyDialogProps) {
  const [userId, setUserId] = useState<string>("");
  const { addProperty } = useProperties(userId);
  const { toast } = useToast();

  // Get the current user's ID when the component mounts
  useEffect(() => {
    const fetchUserId = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUserId(session.user.id);
      }
    };

    fetchUserId();
  }, []);

  const handleSubmit = async (data: any) => {
    try {
      await addProperty(data);
      if (onSuccess) {
        await onSuccess();
      }
      onOpenChange(false); // Close dialog on success
    } catch (error) {
      console.error("Error adding property:", error);
      toast({
        title: "Erro",
        description: "Não foi possível cadastrar o imóvel. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-h-[80vh] sm:max-w-[600px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cadastrar Novo Imóvel</DialogTitle>
          <DialogDescription>
            Preencha os dados do imóvel para cadastrá-lo em seu portfólio.
          </DialogDescription>
        </DialogHeader>
        <PropertyForm onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
}
