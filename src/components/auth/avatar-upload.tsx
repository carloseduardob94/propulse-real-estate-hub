
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
  onUploadComplete?: (url: string | null) => void;
  optional?: boolean;
}

export function AvatarUpload({ 
  user, 
  url, 
  onUploadComplete, 
  optional = true 
}: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(url || null);
  const { toast } = useToast();

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        if (optional) {
          onUploadComplete?.(null);
          return;
        }
        throw new Error('Você precisa selecionar uma imagem para fazer upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const userId = user?.id || 'anonymous';
      const timestamp = new Date().getTime();
      const filePath = `${userId}-${timestamp}.${fileExt}`;

      // Upload the file
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          upsert: true,
          cacheControl: '3600'
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw uploadError;
      }

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      if (urlData?.publicUrl) {
        setAvatarUrl(urlData.publicUrl);
        onUploadComplete?.(urlData.publicUrl);
        toast({
          title: "Avatar atualizado!",
          description: "Sua foto foi atualizada com sucesso.",
        });
      }
    } catch (error: any) {
      console.error("Avatar upload error:", error);
      toast({
        title: "Erro ao fazer upload",
        description: error.message || "Não foi possível fazer o upload da imagem.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar className="h-24 w-24 border-4 border-propulse-100">
        <AvatarImage src={avatarUrl ?? undefined} />
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
