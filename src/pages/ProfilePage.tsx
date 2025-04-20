
import { Navbar } from "@/components/layout/navbar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCog, Check, LogOut, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { ProfileForm } from "@/components/profile/profile-form";
import { useProfile } from "@/hooks/use-profile";

export default function ProfilePage() {
  const { 
    user, 
    loading, 
    saving, 
    formData, 
    handleFormChange, 
    handleSave,
    setFormData
  } = useProfile();
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error: any) {
      console.error('Logout error:', error.message);
      toast({
        title: 'Erro ao fazer logout',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar 
        isAuthenticated={!!user} 
        user={user}
        onLogout={handleLogout}
      />
      
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              <UserCog className="inline-block h-6 w-6 mr-2 align-middle" />
              Meu Perfil
            </CardTitle>
            <CardDescription>
              Atualize suas informações pessoais e configurações da conta.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <ProfileForm
              loading={loading}
              user={user}
              formData={formData}
              onFormChange={handleFormChange}
              onAvatarUpload={(url) => {
                setFormData(prev => ({ ...prev, avatar_url: url }));
              }}
            />
          </CardContent>
          
          <CardFooter className="justify-between">
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
            <Button onClick={handleSave} disabled={saving || loading}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Salvar
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <footer className="py-6 bg-white border-t">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} MeuCorretorPRO. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
