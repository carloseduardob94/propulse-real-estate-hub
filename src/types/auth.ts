
export interface UserProfile {
  id: string;
  name: string | null;
  avatar_url: string | null;
  email: string;
  company_name: string | null;
  plan: 'free' | 'monthly' | 'yearly' | null;
}
