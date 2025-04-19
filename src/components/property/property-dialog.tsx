
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
      <DialogContent className="w-full max-h-[80vh] sm:max-w-[600px] overflow-y-auto duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] data-[state=closed]:scale-95 data-[state=open]:scale-100">
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
