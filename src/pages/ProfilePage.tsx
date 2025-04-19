
import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCog, User, Check, X, Upload, BadgeDollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { UserProfile } from "@/types/auth";

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const { toast } = useToast();

  // Function to get initials from name
  const getUserInitials = (name: string | null) => {
    if (!name) return '?';
    
    const nameParts = name.trim().split(' ');
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  };

  // Get plan badge
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
          <Badge className="ml-2 bg-propulse-100 text-propulse-700 border-propulse-200">
            Premium
          </Badge>
        );
      case 'yearly':
        return (
          <Badge className="ml-2 bg-amber-100 text-amber-700 border-amber-200">
            Premium Anual
          </Badge>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (!sessionData.session) {
          return;
        }
        
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', sessionData.session.user.id)
          .single();
          
        if (error && error.code !== 'PGRST116') {
          throw error;
        }
        
        if (profileData) {
          setUser({
            id: sessionData.session.user.id,
            name: profileData.name || sessionData.session.user.user_metadata?.name || '',
            email: sessionData.session.user.email || '',
            avatar_url: profileData.avatar_url,
            company_name: profileData.company_name,
            plan: profileData.plan || 'free'
          });
          
          setName(profileData.name || sessionData.session.user.user_metadata?.name || '');
          setCompanyName(profileData.company_name || '');
          setAvatarUrl(profileData.avatar_url);
        } else {
          // Create a profile if it doesn't exist
          const userData = {
            id: sessionData.session.user.id,
            name: sessionData.session.user.user_metadata?.name || '',
            email: sessionData.session.user.email || '',
            avatar_url: null,
            company_name: '',
            plan: 'free' as const
          };
          
          setUser(userData);
          setName(userData.name || '');
          
          // Create profile in database
          await supabase.from('profiles').insert([{
            id: userData.id,
            name: userData.name,
            company_name: '',
            plan: 'free'
          }]);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar seu perfil',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [toast]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: 'Arquivo muito grande',
          description: 'O avatar deve ter no máximo 2MB',
          variant: 'destructive',
        });
        return;
      }
      
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const uploadAvatar = async (): Promise<string | null> => {
    if (!avatarFile || !user) return avatarUrl;
    
    try {
      const fileExt = avatarFile.name.split('.').pop();
      const filePath = `avatars/${user.id}/${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('user-content')
        .upload(filePath, avatarFile, { upsert: true });
        
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage.from('user-content').getPublicUrl(filePath);
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível fazer upload do avatar',
        variant: 'destructive',
      });
      return null;
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    try {
      setSaving(true);
      
      // Upload avatar if changed
      let newAvatarUrl = avatarUrl;
      if (avatarFile) {
        newAvatarUrl = await uploadAvatar();
      }
      
      // Update profile in database
      const { error } = await supabase
        .from('profiles')
        .update({
          name,
          company_name: companyName,
          avatar_url: newAvatarUrl,
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      // Update local state
      setUser({
        ...user,
        name,
        company_name: companyName,
        avatar_url: newAvatarUrl,
      });
      
      toast({
        title: 'Perfil atualizado',
        description: 'Suas informações foram salvas com sucesso',
      });
      
      // Reset avatar preview
      if (avatarFile) {
        setAvatarFile(null);
        setAvatarUrl(newAvatarUrl);
        URL.revokeObjectURL(avatarPreview || '');
        setAvatarPreview(null);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar as alterações',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar 
        isAuthenticated={!!user} 
        user={user} 
      />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <UserCog className="h-8 w-8 text-propulse-600" />
            Meu Perfil
          </h1>
          <p className="text-muted-foreground">
            Gerencie suas informações pessoais e configurações de conta
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>
                Atualize seus dados de perfil visíveis no sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 pb-6">
                <div className="relative group">
                  <Avatar className="h-24 w-24 border-4 border-propulse-100">
                    <AvatarImage 
                      src={avatarPreview || avatarUrl || (user?.name ? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&size=192` : undefined)} 
                    />
                    <AvatarFallback className="text-2xl bg-propulse-100 text-propulse-700">
                      {getUserInitials(user?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <label 
                    htmlFor="avatar-upload" 
                    className="absolute inset-0 flex items-center justify-center bg-black/30 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <Upload className="h-8 w-8" />
                    <span className="sr-only">Upload avatar</span>
                  </label>
                  <input 
                    id="avatar-upload" 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleFileChange}
                  />
                </div>
                
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-medium">{user?.name || 'Carregando...'}</p>
                    {user?.plan && getPlanBadge(user.plan)}
                  </div>
                  <p className="text-sm text-muted-foreground">{user?.email || 'Carregando...'}</p>
                  {avatarPreview && (
                    <div className="flex items-center gap-2 mt-2">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => {
                          URL.revokeObjectURL(avatarPreview);
                          setAvatarPreview(null);
                          setAvatarFile(null);
                        }}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Cancelar
                      </Button>
                      <p className="text-xs text-muted-foreground">
                        Nova imagem selecionada
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome completo</Label>
                    <Input 
                      id="name" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      placeholder="Seu nome"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company">Nome da Imobiliária/Empresa</Label>
                    <Input 
                      id="company" 
                      value={companyName} 
                      onChange={(e) => setCompanyName(e.target.value)} 
                      placeholder="Nome da sua empresa (opcional)"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                onClick={handleSave}
                disabled={saving || loading}
                className="flex items-center gap-2"
              >
                {saving ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                {saving ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </CardFooter>
          </Card>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Plano atual</CardTitle>
                <CardDescription>
                  Informações sobre seu plano de assinatura
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <BadgeDollarSign className="h-5 w-5 text-propulse-600" />
                    <div>
                      <p className="font-medium">
                        {user?.plan === 'free' ? 'Plano Gratuito' : 
                         user?.plan === 'monthly' ? 'Plano Premium Mensal' : 
                         user?.plan === 'yearly' ? 'Plano Premium Anual' : 
                         'Carregando...'}
                      </p>
                      {user?.plan === 'free' && (
                        <p className="text-sm text-muted-foreground">
                          Acesso limitado a funcionalidades básicas
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {user?.plan === 'free' && (
                    <Button variant="propulse" className="w-full" asChild>
                      <a href="/plans">Upgrade para Premium</a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Segurança da conta</CardTitle>
                <CardDescription>
                  Gerencie suas credenciais de acesso
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full">
                    Alterar senha
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
