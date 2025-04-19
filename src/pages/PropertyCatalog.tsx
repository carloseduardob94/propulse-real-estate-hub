
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { PropertyDialog } from "@/components/property/property-dialog";
import { PageLayout } from "@/components/layout/PageLayout";
import { PropertyFilterProvider } from "@/components/property/property-filter-context";
import { PropertyCatalogHeader } from "@/components/property/property-catalog-header";
import { PropertyContent } from "@/components/property/property-content";
import { useAuthProfile } from "@/hooks/use-auth-profile";
import { useProperties } from "@/hooks/use-properties";
import { getUserSlug } from "@/utils/user-utils";

export default function PropertyCatalog() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const { user, isAuthenticated, handleLogout } = useAuthProfile();
  const { properties, isLoading, addProperty } = useProperties(user.id);

  const onPropertySubmit = async (data: any) => {
    const success = await addProperty(data);
    if (success) {
      setIsDialogOpen(false);
    }
  };

  const toggleFilters = () => {
    setShowFilters(prev => !prev);
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
        onSubmit={onPropertySubmit}
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
        onToggleFilters={toggleFilters}
        userSlug={getUserSlug(user)}
      />
      
      <PropertyFilterProvider properties={properties}>
        <PropertyContent 
          properties={properties} 
          isLoading={isLoading} 
          showFilters={showFilters} 
        />
      </PropertyFilterProvider>
    </PageLayout>
  );
}
