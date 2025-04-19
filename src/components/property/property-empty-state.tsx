
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PropertyEmptyStateProps {
  onResetFilters: () => void;
}

export function PropertyEmptyState({ onResetFilters }: PropertyEmptyStateProps) {
  return (
    <div className="text-center py-12 flex flex-col items-center">
      <Info className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
      <h2 className="text-xl font-semibold mb-2">Nenhum imóvel encontrado</h2>
      <p className="text-muted-foreground mb-6">Tente ajustar os filtros para ver mais resultados.</p>
      <Button onClick={onResetFilters}>Limpar filtros</Button>
    </div>
  );
}
