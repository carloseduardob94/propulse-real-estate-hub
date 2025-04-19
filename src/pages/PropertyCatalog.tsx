
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { PropertyDialog } from "@/components/property/property-dialog";
import { PageLayout } from "@/components/layout/PageLayout";
import { useProperties } from "@/hooks/use-properties";
import { PropertyCatalogHeader } from "@/components/property/property-catalog-header";
import { PropertyCatalogContent } from "@/components/property/property-catalog-content";
import { useAuthCheck } from "@/hooks/use-auth-check";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function PropertyCatalog() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const { user, isAuthenticated } = useAuthCheck();
  const { properties, isLoading, fetchProperties } = useProperties(user.id);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      navigate('/login');
    } catch (error: any) {
      console.error("Logout error:", error);
      toast({
        title: "Erro",
        description: "Falha ao fazer logout",
        variant: "destructive"
      });
    }
  };

  const getUserSlug = (profile: typeof user) => {
    const baseSlug = profile.company_name || profile.name || profile.id;
    return baseSlug.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };

  const actionButton = (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Imóvel
        </Button>
      </DialogTrigger>
      <PropertyDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </Dialog>
  );

  return (
    <PageLayout
      isAuthenticated={isAuthenticated}
      user={user}
      onLogout={handleLogout}
      title="Imóveis"
      description="Gerenciamento do seu portfólio de imóveis"
      actionButton={actionButton}
    >
      <PropertyCatalogHeader 
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(prev => !prev)}
        userSlug={getUserSlug(user)}
      />
      
      <PropertyCatalogContent 
        properties={properties}
        isLoading={isLoading}
        showFilters={showFilters}
      />
    </PageLayout>
  );
}
