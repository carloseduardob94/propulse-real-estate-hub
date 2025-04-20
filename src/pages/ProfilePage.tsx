import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AvatarUpload } from "@/components/auth/avatar-upload";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCog, User, Check, X, Upload, BadgeDollarSign, LogOut, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { UserProfile } from "@/types/auth";
import { User as SupabaseUser } from "@supabase/supabase-js";

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company_name: '',
    avatar_url: '',
  });
  
  useEffect(() => {
    async function getProfile() {
      try {
        setLoading(true);
        
        const { data: { user: authUser } } = await supabase.auth.getUser();
        
        if (!authUser) {
          navigate('/login');
          return;
        }
        
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single();
          
        if (error && error.code !== 'PGRST116') {
          throw error;
        }
        
        if (profile) {
          setUser({
            id: authUser.id,
            name: profile.name || authUser.user_metadata?.name || 'Usuário',
            email: authUser.email || '',
            avatar_url: profile.avatar_url,
            company_name: profile.company_name,
            plan: (profile.plan as "free" | "monthly" | "yearly") || "free"
          });
          
          setFormData({
            name: profile.name || authUser.user_metadata?.name || '',
            email: authUser.email || '',
            company_name: profile.company_name || '',
            avatar_url: profile.avatar_url || '',
          });
        } else {
          setUser({
            id: authUser.id,
            name: authUser.user_metadata?.name || 'Usuário',
            email: authUser.email || '',
            avatar_url: null,
            company_name: null,
            plan: "free"
          });
          
          setFormData({
            name: authUser.user_metadata?.name || '',
            email: authUser.email || '',
            company_name: '',
            avatar_url: '',
          });
        }
      } catch (error: any) {
        console.error('Error loading user profile:', error.message);
        toast({
          title: 'Erro ao carregar perfil',
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }
    
    getProfile();
  }, [navigate, toast]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSave = async () => {
    try {
      setSaving(true);
      
      if (!user) {
        throw new Error('Usuário não autenticado.');
      }
      
      const generateSlug = (name: string) => {
        return name.toLowerCase()
          .replace(/\s+/g, '-')           // Replace spaces with -
          .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
          .replace(/\-\-+/g, '-')         // Replace multiple - with single -
          .replace(/^-+/, '')             // Trim - from start of text
          .replace(/-+$/, '');            // Trim - from end of text
      };
      
      const slug = formData.company_name 
        ? generateSlug(formData.company_name) 
        : generateSlug(formData.name);
      
      const updates = {
        id: user.id,
        name: formData.name,
        company_name: formData.company_name,
        avatar_url: formData.avatar_url,
        slug: slug,
        updated_at: new Date().toISOString(),
      };
      
      const { error } = await supabase
        .from('profiles')
        .upsert(updates)
        .select();
      
      if (error) {
        throw error;
      }
      
      setUser(prev => ({
        ...prev,
        name: formData.name,
        company_name: formData.company_name,
        avatar_url: formData.avatar_url,
      } as UserProfile));
      
      toast({
        title: 'Perfil atualizado!',
        description: 'Suas informações foram atualizadas com sucesso.',
      });
    } catch (error: any) {
      console.error('Error updating the profile:', error.message);
      toast({
        title: 'Erro ao atualizar perfil',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

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
  
  const getPlanBadge = (plan: 'free' | 'monthly' | 'yearly' | null) => {
    switch (plan) {
      case 'free':
        return (
          <Badge variant="outline" className="ml-2 bg-gray-100 text-gray-600 border-gray-200">
            Free
          </Badge>
        );
      case 'monthly':
        return (
          <Badge className="ml-2 bg-propulse-100 text-propulse-700 border-propulse-200 hover:bg-propulse-200">
            Premium
          </Badge>
        );
      case 'yearly':
        return (
          <Badge className="ml-2 bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200">
            Premium Anual
          </Badge>
        );
      default:
        return null;
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
            {loading ? (
              <p>Carregando informações do perfil...</p>
            ) : (
              <>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16 border-2 border-propulse-200">
                    <AvatarImage src={formData.avatar_url || (formData.name ? `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random` : undefined)} alt="Avatar" />
                    <AvatarFallback className="bg-propulse-100 text-propulse-700">
                      {formData.name?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <AvatarUpload 
                    user={user as unknown as SupabaseUser}
                    onUploadComplete={(url) => {
                      setFormData(prev => ({ ...prev, avatar_url: url }));
                      setUser(prev => ({ ...prev, avatar_url: url } as UserProfile));
                    }}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input 
                    type="text" 
                    id="name" 
                    name="name"
                    value={formData.name} 
                    onChange={handleChange} 
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    type="email" 
                    id="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled 
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="company_name">Empresa</Label>
                  <Input 
                    type="text" 
                    id="company_name" 
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                  />
                </div>
                
                {user?.plan && (
                  <div className="grid gap-2">
                    <Label>Plano</Label>
                    <div className="flex items-center">
                      <p className="font-medium">{user.plan === 'free' ? 'Free' : user.plan === 'monthly' ? 'Premium' : 'Premium Anual'}</p>
                      {getPlanBadge(user.plan)}
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
          
          <CardFooter className="justify-between">
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
            <Button onClick={handleSave} disabled={saving}>
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
