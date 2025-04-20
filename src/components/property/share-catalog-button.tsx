
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ShareCatalogButtonProps {
  userSlug: string;
  variant?: "outline" | "ghost" | "default";
  className?: string;
}

export function ShareCatalogButton({ userSlug, variant = "outline", className }: ShareCatalogButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const { toast } = useToast();
  
  const handleShare = async () => {
    if (!userSlug) {
      toast({
        title: "Erro",
        description: "Não foi possível gerar o link do catálogo. Perfil incompleto.",
        variant: "destructive",
      });
      return;
    }
    
    const baseUrl = window.location.origin;
    const catalogUrl = `${baseUrl}/catalogo/${userSlug}`;
    
    try {
      await navigator.clipboard.writeText(catalogUrl);
      setShowTooltip(true);
      
      toast({
        title: "Link copiado!",
        description: "Link do catálogo copiado para a área de transferência.",
      });
      
      setTimeout(() => {
        setShowTooltip(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
      toast({
        title: "Erro",
        description: "Não foi possível copiar o link. Verifique as permissões do navegador.",
        variant: "destructive",
      });
    }
  };

  return (
    <TooltipProvider>
      <Tooltip open={showTooltip}>
        <TooltipTrigger asChild>
          <Button 
            variant={variant}
            className={`bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white ${className}`}
            onClick={handleShare}
          >
            <Copy className="mr-2 h-4 w-4" />
            Copiar Link
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Copiado!</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
