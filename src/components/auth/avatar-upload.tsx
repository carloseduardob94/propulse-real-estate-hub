
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User } from '@supabase/supabase-js';
import { Upload } from "lucide-react";

interface AvatarUploadProps {
  user: User | null;
  url?: string | null;
  onUploadComplete?: (url: string) => void;
}

export function AvatarUpload({ user, url, onUploadComplete }: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Você precisa selecionar uma imagem para fazer upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user?.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = await supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      if (data?.publicUrl) {
        onUploadComplete?.(data.publicUrl);
        toast({
          title: "Avatar atualizado!",
          description: "Sua foto foi atualizada com sucesso.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro ao fazer upload",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar className="h-24 w-24 border-4 border-propulse-100">
        <AvatarImage src={url ?? undefined} />
        <AvatarFallback className="bg-propulse-100 text-propulse-700 text-xl">
          {user?.email?.charAt(0).toUpperCase() || '?'}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          className="relative"
          disabled={uploading}
        >
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept="image/*"
            onChange={uploadAvatar}
            disabled={uploading}
          />
          <Upload className="mr-2 h-4 w-4" />
          {uploading ? 'Enviando...' : 'Alterar foto'}
        </Button>
      </div>
    </div>
  );
}
