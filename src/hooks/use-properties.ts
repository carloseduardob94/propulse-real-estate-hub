
import { useState, useEffect } from "react";
import { Property } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useProperties = (userId: string) => {
  const { toast } = useToast();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProperties = async (userId: string) => {
    setIsLoading(true);
    try {
      // Only proceed if we have a valid userId
      if (!userId) {
        console.log("No userId provided, returning empty array");
        setProperties([]);
        return [];
      }

      console.log(`Fetching properties for user: ${userId}`);
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('user_id', userId);
        
      if (error) throw error;
      
      console.log(`Found ${data?.length || 0} properties for user ${userId}`);
      
      const typedProperties = data.map(p => ({
        id: p.id,
        title: p.title,
        description: p.description || "",
        price: p.price,
        address: p.address,
        city: p.city,
        state: p.state,
        zipCode: p.zip_code || "",
        bedrooms: p.bedrooms,
        bathrooms: p.bathrooms,
        area: p.area,
        parkingSpaces: p.parking_spaces || 0,
        type: p.type as any,
        status: p.status as any,
        images: p.images || [],
        featured: p.featured || false,
        createdAt: p.created_at,
        updatedAt: p.updated_at
      }));
      
      setProperties(typedProperties);
      return typedProperties;
    } catch (error) {
      console.error("Error fetching properties:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar seus imóveis",
        variant: "destructive"
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const addProperty = async (data: any) => {
    try {
      if (!userId) {
        toast({
          title: "Erro ao cadastrar imóvel",
          description: "Usuário não identificado. Faça login novamente.",
          variant: "destructive",
        });
        return false;
      }

      const dbData = {
        title: data.title,
        description: data.description,
        price: parseFloat(data.price),
        address: data.address,
        city: data.city,
        state: data.state,
        zip_code: data.zipCode,
        bedrooms: parseInt(data.bedrooms),
        bathrooms: parseInt(data.bathrooms),
        area: parseFloat(data.area),
        parking_spaces: parseInt(data.parkingSpaces || 0),
        type: data.type,
        status: data.status,
        images: data.images || [],
        featured: data.featured || false,
        user_id: userId
      };

      const { error } = await supabase
        .from('properties')
        .insert([dbData]);

      if (error) throw error;

      toast({
        title: "Imóvel cadastrado com sucesso!",
        description: "O imóvel foi adicionado ao seu catálogo.",
      });

      await fetchProperties(userId);
      return true;
    } catch (error: any) {
      toast({
        title: "Erro ao cadastrar imóvel",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  const updateProperty = async (id: string, data: any) => {
    try {
      if (!userId) {
        toast({
          title: "Erro ao atualizar imóvel",
          description: "Usuário não identificado. Faça login novamente.",
          variant: "destructive",
        });
        return false;
      }

      // Add a check to ensure the property belongs to the current user
      const { data: propertyCheck, error: checkError } = await supabase
        .from('properties')
        .select('user_id')
        .eq('id', id)
        .single();
        
      if (checkError) throw checkError;
      
      if (propertyCheck.user_id !== userId) {
        toast({
          title: "Acesso negado",
          description: "Você não tem permissão para editar este imóvel.",
          variant: "destructive",
        });
        return false;
      }

      const dbData = {
        title: data.title,
        description: data.description,
        price: parseFloat(data.price),
        address: data.address,
        city: data.city,
        state: data.state,
        zip_code: data.zipCode,
        bedrooms: parseInt(data.bedrooms),
        bathrooms: parseInt(data.bathrooms),
        area: parseFloat(data.area),
        parking_spaces: parseInt(data.parkingSpaces || 0),
        type: data.type,
        status: data.status,
        images: data.images || [],
        featured: data.featured || false
      };

      const { error } = await supabase
        .from('properties')
        .update(dbData)
        .eq('id', id)
        .eq('user_id', userId); // Add extra check here too

      if (error) throw error;

      toast({
        title: "Imóvel atualizado com sucesso!",
        description: "As informações do imóvel foram atualizadas.",
      });

      await fetchProperties(userId);
      return true;
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar imóvel",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteProperty = async (id: string) => {
    try {
      if (!userId) {
        toast({
          title: "Erro ao excluir imóvel",
          description: "Usuário não identificado. Faça login novamente.",
          variant: "destructive",
        });
        return false;
      }

      // Check if property belongs to user before deletion
      const { data: propertyCheck, error: checkError } = await supabase
        .from('properties')
        .select('user_id')
        .eq('id', id)
        .single();
        
      if (checkError) throw checkError;
      
      if (propertyCheck.user_id !== userId) {
        toast({
          title: "Acesso negado",
          description: "Você não tem permissão para excluir este imóvel.",
          variant: "destructive",
        });
        return false;
      }

      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id)
        .eq('user_id', userId); // Double check with user_id
        
      if (error) throw error;
      
      toast({
        title: "Imóvel excluído com sucesso!",
        description: "O imóvel foi removido do seu catálogo."
      });
      
      await fetchProperties(userId);
      return true;
    } catch (error: any) {
      toast({
        title: "Erro ao excluir imóvel",
        description: error.message,
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    properties,
    isLoading,
    fetchProperties,
    addProperty,
    updateProperty,
    deleteProperty
  };
};
