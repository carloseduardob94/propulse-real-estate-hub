
import { Share2 } from "lucide-react";
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
      if (navigator.share) {
        // Mobile share API
        await navigator.share({
          title: "Catálogo de Imóveis",
          text: "Confira meu catálogo de imóveis:",
          url: catalogUrl,
        });
        
        toast({
          title: "Compartilhado!",
          description: "Link do catálogo compartilhado com sucesso.",
        });
      } else {
        // Clipboard fallback for desktop
        await navigator.clipboard.writeText(catalogUrl);
        setShowTooltip(true);
        
        // Show toast notification
        toast({
          title: "Link copiado!",
          description: "Link do catálogo copiado para a área de transferência.",
        });
        
        // Hide tooltip after 2 seconds
        setTimeout(() => {
          setShowTooltip(false);
        }, 2000);
      }
    } catch (err) {
      console.error('Failed to share/copy: ', err);
      toast({
        title: "Erro",
        description: "Não foi possível compartilhar o link. Tente novamente.",
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
            <Share2 className="mr-2 h-4 w-4" />
            Compartilhar
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Copiado!</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
