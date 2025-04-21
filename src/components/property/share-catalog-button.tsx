
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ShareCatalogButtonProps {
  userSlug?: string; // agora opcional
  variant?: "outline" | "ghost" | "default";
  className?: string;
}

/**
 * Obtém o slug do usuário autenticado via Supabase.
 */
async function getUserSlug(): Promise<string | null> {
  // Recupera usuário autenticado
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return null;
  }
  // Busca perfil do usuário para obter o slug
  const { data: profile } = await supabase
    .from("profiles")
    .select("slug")
    .eq("id", user.id)
    .maybeSingle();

  return profile?.slug || null;
}

export function ShareCatalogButton({
  userSlug,
  variant = "outline",
  className,
}: ShareCatalogButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [currentSlug, setCurrentSlug] = useState<string | null>(userSlug || null);
  const { toast } = useToast();

  // Obtém slug dinamicamente se não passado por prop
  useEffect(() => {
    if (!userSlug) {
      getUserSlug().then(setCurrentSlug);
    }
  }, [userSlug]);

  const handleShare = async () => {
    if (!currentSlug) {
      toast({
        title: "Erro",
        description: "Não foi possível gerar o link do catálogo. Perfil incompleto.",
        variant: "destructive",
      });
      return;
    }

    // Remove os subdomínios de preview do formato lovableproject.com
    // Formato típico: f3f90cd0-03bc-485d-b29a-ef940d959c5d.lovableproject.com
    let baseUrl = window.location.origin;
    
    // Verifica se está em ambiente de desenvolvimento com ID
    if (baseUrl.includes('.lovableproject.com')) {
      // Extrai apenas o domínio principal sem o ID de preview
      baseUrl = 'https://' + baseUrl.split('.lovableproject.com')[0].split('.').pop() + '.lovableproject.com';
    }
    
    // Se estiver em um ambiente local como localhost, mantém o origin como está
    const catalogUrl = `${baseUrl}/catalogo/${currentSlug}`;

    try {
      await navigator.clipboard.writeText(catalogUrl);
      setShowTooltip(true);

      toast({
        title: "Link copiado com sucesso!",
        description: "O link do catálogo foi copiado para a área de transferência.",
      });

      setTimeout(() => {
        setShowTooltip(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
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
