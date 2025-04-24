
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/auth";
import { generateSlug } from "@/utils/profile-utils";
import { formatWhatsappForStorage, validateWhatsapp } from "@/utils/format-whatsapp";

export async function getProfileById(userId: string) {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
    
  if (error) throw error;
  return profile;
}

export async function createInitialProfile(userId: string, userMetadata: any) {
  const initialProfile = {
    id: userId,
    name: userMetadata?.name,
    email: userMetadata?.email,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  
  const { error } = await supabase
    .from('profiles')
    .insert(initialProfile);
    
  if (error) throw error;
}

export async function updateProfile(userId: string, formData: any) {
  const whatsappFormatted = formatWhatsappForStorage(formData.whatsapp);
  
  if (!validateWhatsapp(whatsappFormatted)) {
    throw new Error('O número de WhatsApp deve ter 10 ou 11 dígitos incluindo o DDD.');
  }
  
  const slug = formData.company_name 
    ? generateSlug(formData.company_name) 
    : generateSlug(formData.name);
  
  const updates = {
    id: userId,
    name: formData.name,
    company_name: formData.company_name,
    avatar_url: formData.avatar_url,
    whatsapp: whatsappFormatted,
    slug: slug,
    updated_at: new Date().toISOString(),
  };
  
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);
    
  if (error) throw error;
  
  return { ...updates, whatsapp: whatsappFormatted };
}
