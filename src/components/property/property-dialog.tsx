
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PropertyForm } from "@/components/ui/property-form";
import { useProperties } from "@/hooks/use-properties";
import { useToast } from "@/hooks/use-toast";

interface PropertyDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PropertyDialog({ isOpen, onOpenChange }: PropertyDialogProps) {
  const { addProperty } = useProperties();
  const { toast } = useToast();

  const handleSubmit = async (data: any) => {
    try {
      await addProperty(data);
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
