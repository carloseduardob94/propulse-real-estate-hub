import { UserProfile } from "@/types/auth";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AvatarUpload } from "@/components/auth/avatar-upload";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";

interface ProfileFormProps {
  loading: boolean;
  user: UserProfile | null;
  formData: {
    name: string;
    email: string;
    company_name: string;
    avatar_url: string;
    whatsapp: string;
  };
  onFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAvatarUpload: (url: string | null) => void;
}

export function ProfileForm({ 
  loading, 
  user, 
  formData, 
  onFormChange, 
  onAvatarUpload 
}: ProfileFormProps) {
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

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <Loader2 className="h-8 w-8 animate-spin text-propulse-600" />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center space-x-4">
        <Avatar className="h-16 w-16 border-2 border-propulse-200">
          <AvatarImage 
            src={formData.avatar_url || (formData.name ? `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random` : undefined)} 
            alt="Avatar" 
          />
          <AvatarFallback className="bg-propulse-100 text-propulse-700">
            {formData.name?.charAt(0).toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
        <AvatarUpload 
          user={user as unknown as SupabaseUser}
          onUploadComplete={onAvatarUpload}
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="name">Nome</Label>
        <Input 
          type="text" 
          id="name" 
          name="name"
          value={formData.name} 
          onChange={onFormChange} 
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="whatsapp">WhatsApp</Label>
        <Input 
          type="text" 
          id="whatsapp" 
          name="whatsapp"
          value={formData.whatsapp || ''} 
          onChange={onFormChange}
          placeholder="(11) 91234-5678"
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input 
          type="email" 
          id="email" 
          name="email"
          value={formData.email}
          onChange={onFormChange}
          disabled 
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="company_name">Empresa</Label>
        <Input 
          type="text" 
          id="company_name" 
          name="company_name"
          value={formData.company_name || ''}
          onChange={onFormChange}
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
  );
}
