
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
  whatsapp: string;
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
    whatsapp: '',
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
          whatsapp: profile.whatsapp,
          plan: (profile.plan as "free" | "monthly" | "yearly") || "free"
        });
        
        // Format the WhatsApp number for display if it exists
        let displayWhatsapp = '';
        if (profile.whatsapp) {
          const phoneNumber = profile.whatsapp.replace(/\D/g, '');
          if (phoneNumber.length > 2) {
            displayWhatsapp = `(${phoneNumber.substring(0, 2)})`;
            if (phoneNumber.length > 7) {
              displayWhatsapp = `(${phoneNumber.substring(0, 2)}) ${phoneNumber.substring(2, 7)}-${phoneNumber.substring(7)}`;
            } else {
              displayWhatsapp += phoneNumber.substring(2);
            }
          } else {
            displayWhatsapp = phoneNumber;
          }
        }
        
        setFormData({
          name: profile.name || authUser.user_metadata?.name || '',
          email: authUser.email || '',
          company_name: profile.company_name || '',
          avatar_url: profile.avatar_url || '',
          whatsapp: displayWhatsapp,
        });
      } else {
        const defaultUser = {
          id: authUser.id,
          name: authUser.user_metadata?.name || 'Usuário',
          email: authUser.email || '',
          avatar_url: null,
          company_name: null,
          plan: "free" as const,
          whatsapp: null,
        };
        
        setUser(defaultUser);
        setFormData({
          name: authUser.user_metadata?.name || '',
          email: authUser.email || '',
          company_name: '',
          avatar_url: '',
          whatsapp: '',
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
    
    // Aplicando formatação especial para o campo whatsapp
    if (name === 'whatsapp') {
      const input = value.replace(/\D/g, '');
      
      if (input.length <= 11) {
        let formattedInput = input;
        
        if (input.length > 2) {
          formattedInput = `(${input.substring(0, 2)})${input.substring(2)}`;
        }
        
        if (input.length > 7) {
          formattedInput = `(${input.substring(0, 2)}) ${input.substring(2, 7)}-${input.substring(7)}`;
        }
        
        setFormData(prev => ({
          ...prev,
          [name]: formattedInput,
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      if (!user) {
        throw new Error('Usuário não autenticado.');
      }

      // Formatando o WhatsApp para remover caracteres especiais antes de salvar
      const whatsappFormatted = formData.whatsapp ? formData.whatsapp.replace(/\D/g, '') : '';
      
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
        whatsapp: whatsappFormatted, // Salvando apenas os números
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
      
      // After successful save, update the user state with formatted WhatsApp
      let displayWhatsapp = '';
      if (whatsappFormatted) {
        if (whatsappFormatted.length > 2) {
          displayWhatsapp = `(${whatsappFormatted.substring(0, 2)})`;
          if (whatsappFormatted.length > 7) {
            displayWhatsapp = `(${whatsappFormatted.substring(0, 2)}) ${whatsappFormatted.substring(2, 7)}-${whatsappFormatted.substring(7)}`;
          } else {
            displayWhatsapp += whatsappFormatted.substring(2);
          }
        } else {
          displayWhatsapp = whatsappFormatted;
        }
      }

      setUser(prev => ({
        ...prev!,
        name: formData.name,
        company_name: formData.company_name,
        avatar_url: formData.avatar_url,
        whatsapp: whatsappFormatted,
      }));

      // Update the form with properly formatted display value
      setFormData(prev => ({
        ...prev,
        whatsapp: displayWhatsapp,
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
