
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/auth";
import { useToast } from "@/hooks/use-toast";

interface ProfileFormData {
  name: string;
  email: string;
  company_name: string;
  avatar_url: string;
}

export function useProfile() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    email: '',
    company_name: '',
    avatar_url: '',
  });
  
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    getProfile();
  }, [navigate, toast]);

  async function getProfile() {
    try {
      setLoading(true);
      
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        navigate('/login');
        return;
      }
      
      let { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle();
        
      if (error) {
        console.error('Error fetching profile:', error);
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
        const defaultUser = {
          id: authUser.id,
          name: authUser.user_metadata?.name || 'Usuário',
          email: authUser.email || '',
          avatar_url: null,
          company_name: null,
          plan: "free" as const
        };
        
        setUser(defaultUser);
        setFormData({
          name: authUser.user_metadata?.name || '',
          email: authUser.email || '',
          company_name: '',
          avatar_url: '',
        });
        
        await createInitialProfile(authUser);
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

  async function createInitialProfile(authUser: User) {
    const initialProfile = {
      id: authUser.id,
      name: authUser.user_metadata?.name,
      email: authUser.email,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    const { error: insertError } = await supabase
      .from('profiles')
      .insert(initialProfile);
      
    if (insertError) {
      console.error('Error creating initial profile:', insertError);
    }
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
          .replace(/\s+/g, '-')
          .replace(/[^\w\-]+/g, '')
          .replace(/\-\-+/g, '-')
          .replace(/^-+/, '')
          .replace(/-+$/, '');
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
      
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();
        
      const { error } = existingProfile
        ? await supabase.from('profiles').update(updates).eq('id', user.id)
        : await supabase.from('profiles').insert(updates);
      
      if (error) {
        console.error('Error details:', error);
        throw error;
      }
      
      setUser(prev => ({
        ...prev!,
        name: formData.name,
        company_name: formData.company_name,
        avatar_url: formData.avatar_url,
      }));
      
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

  return {
    user,
    loading,
    saving,
    formData,
    handleFormChange,
    handleSave,
    setFormData
  };
}
