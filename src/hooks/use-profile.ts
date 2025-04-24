
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/auth";
import { useToast } from "@/hooks/use-toast";
import { useProfileForm } from "@/hooks/use-profile-form";
import { formatWhatsappForDisplay } from "@/utils/format-whatsapp";
import { getProfileById, createInitialProfile, updateProfile } from "@/services/profile-service";

export function useProfile() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { formData, setFormData, handleFormChange } = useProfileForm();
  
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
      
      const profile = await getProfileById(authUser.id);
        
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
        
        setFormData({
          name: profile.name || authUser.user_metadata?.name || '',
          email: authUser.email || '',
          company_name: profile.company_name || '',
          avatar_url: profile.avatar_url || '',
          whatsapp: formatWhatsappForDisplay(profile.whatsapp),
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
        
        await createInitialProfile(authUser.id, authUser);
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

  const handleSave = async () => {
    try {
      setSaving(true);
      
      if (!user) {
        throw new Error('Usuário não autenticado.');
      }

      const updatedProfile = await updateProfile(user.id, formData);
      
      setUser(prev => ({
        ...prev!,
        name: updatedProfile.name,
        company_name: updatedProfile.company_name,
        avatar_url: updatedProfile.avatar_url,
        whatsapp: updatedProfile.whatsapp,
      }));

      setFormData(prev => ({
        ...prev,
        whatsapp: formatWhatsappForDisplay(updatedProfile.whatsapp),
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
