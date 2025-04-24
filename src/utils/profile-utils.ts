
export function generateSlug(name: string): string {
  return name.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export interface ProfileFormData {
  name: string;
  email: string;
  company_name: string;
  avatar_url: string;
  whatsapp: string;
}

export const defaultFormData: ProfileFormData = {
  name: '',
  email: '',
  company_name: '',
  avatar_url: '',
  whatsapp: '',
};
