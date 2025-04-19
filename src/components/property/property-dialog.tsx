
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PropertyForm } from "@/components/ui/property-form";

interface PropertyDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => Promise<void>;
}

export function PropertyDialog({ isOpen, onOpenChange, onSubmit }: PropertyDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-h-[80vh] sm:max-w-[600px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cadastrar Novo Imóvel</DialogTitle>
          <DialogDescription>
            Preencha os dados do imóvel para cadastrá-lo em seu portfólio.
          </DialogDescription>
        </DialogHeader>
        <PropertyForm onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  );
}
