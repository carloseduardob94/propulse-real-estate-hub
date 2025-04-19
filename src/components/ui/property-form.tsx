import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Property } from "@/types";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { X, Plus, ImagePlus } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(5, { message: "O título deve ter pelo menos 5 caracteres" }),
  description: z.string().min(20, { message: "A descrição deve ter pelo menos 20 caracteres" }),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "O preço deve ser um número válido maior que zero",
  }),
  address: z.string().min(5, { message: "O endereço deve ter pelo menos 5 caracteres" }),
  city: z.string().min(2, { message: "A cidade é obrigatória" }),
  state: z.string().min(2, { message: "O estado é obrigatório" }),
  zipCode: z.string().min(5, { message: "O CEP é obrigatório" }),
  bedrooms: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "O número de quartos deve ser um número válido maior ou igual a zero",
  }),
  bathrooms: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "O número de banheiros deve ser um número válido maior ou igual a zero",
  }),
  area: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "A área deve ser um número válido maior que zero",
  }),
  parkingSpaces: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "O número de vagas deve ser um número válido maior ou igual a zero",
  }),
  type: z.enum(["apartment", "house", "commercial", "land"]),
  status: z.enum(["forSale", "forRent", "sold", "rented"]),
  featured: z.boolean().default(false),
  images: z.array(z.string()).default([]),
});

type FormValues = z.infer<typeof formSchema>;

interface PropertyFormProps {
  property?: Property;
  onSubmit?: (data: FormValues) => void;
  className?: string;
}

export function PropertyForm({ property, onSubmit, className }: PropertyFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imageValidationError, setImageValidationError] = useState<string | null>(null);

  const defaultValues: Partial<FormValues> = property
    ? {
        title: property.title,
        description: property.description,
        price: property.price.toString(),
        address: property.address,
        city: property.city,
        state: property.state,
        zipCode: property.zipCode,
        bedrooms: property.bedrooms.toString(),
        bathrooms: property.bathrooms.toString(),
        area: property.area.toString(),
        parkingSpaces: property.parkingSpaces.toString(),
        type: property.type,
        status: property.status,
        featured: property.featured,
        images: property.images || [],
      }
    : {
        title: "",
        description: "",
        price: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        bedrooms: "0",
        bathrooms: "0",
        area: "",
        parkingSpaces: "0",
        type: "apartment",
        status: "forSale",
        featured: false,
        images: [],
      };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files).slice(0, 20 - images.length);
      
      if (images.length + newFiles.length > 20) {
        toast({
          title: "Limite de imagens excedido",
          description: "Você pode adicionar no máximo 20 imagens.",
          variant: "destructive",
        });
        return;
      }

      setImages(prev => [...prev, ...newFiles]);
      setImageValidationError(null);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (values: FormValues) => {
    if (images.length < 3 && (!property || !property.images || property.images.length < 3)) {
      setImageValidationError("Adicione pelo menos 3 imagens");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const imageUrls = await Promise.all(
        images.map(async (file) => {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const { data, error } = await supabase.storage
            .from('property-images')
            .upload(`${fileName}`, file);

          if (error) throw error;

          const { data: { publicUrl } } = supabase.storage
            .from('property-images')
            .getPublicUrl(fileName);

          return publicUrl;
        })
      );

      const combinedImages = property?.images || [];
      const propertyData = {
        ...values,
        images: [...combinedImages, ...imageUrls],
      };

      if (onSubmit) {
        onSubmit(propertyData);
      }
      
      toast({
        title: property ? "Imóvel atualizado!" : "Imóvel cadastrado!",
        description: property 
          ? "O imóvel foi atualizado com sucesso." 
          : "O imóvel foi cadastrado com sucesso.",
      });
      
      if (!property) {
        form.reset(defaultValues);
        setImages([]);
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o imóvel. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle>{property ? "Editar Imóvel" : "Cadastrar Novo Imóvel"}</CardTitle>
        <CardDescription>
          Preencha os dados do imóvel para {property ? "atualizar" : "cadastrar"}.
        </CardDescription>
      </CardHeader>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              placeholder="Ex: Apartamento de 3 quartos na zona sul"
              {...form.register("title")}
            />
            {form.formState.errors.title && (
              <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Descrição detalhada do imóvel"
              rows={4}
              {...form.register("description")}
            />
            {form.formState.errors.description && (
              <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="price">Preço (R$)</Label>
              <Input
                id="price"
                placeholder="Ex: 500000"
                {...form.register("price")}
              />
              {form.formState.errors.price && (
                <p className="text-sm text-red-500">{form.formState.errors.price.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="area">Área (m²)</Label>
              <Input
                id="area"
                placeholder="Ex: 120"
                {...form.register("area")}
              />
              {form.formState.errors.area && (
                <p className="text-sm text-red-500">{form.formState.errors.area.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Endereço</Label>
            <Input
              id="address"
              placeholder="Ex: Av. Paulista, 1000"
              {...form.register("address")}
            />
            {form.formState.errors.address && (
              <p className="text-sm text-red-500">{form.formState.errors.address.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                placeholder="Ex: São Paulo"
                {...form.register("city")}
              />
              {form.formState.errors.city && (
                <p className="text-sm text-red-500">{form.formState.errors.city.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">Estado</Label>
              <Input
                id="state"
                placeholder="Ex: SP"
                {...form.register("state")}
              />
              {form.formState.errors.state && (
                <p className="text-sm text-red-500">{form.formState.errors.state.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="zipCode">CEP</Label>
              <Input
                id="zipCode"
                placeholder="Ex: 01310-100"
                {...form.register("zipCode")}
              />
              {form.formState.errors.zipCode && (
                <p className="text-sm text-red-500">{form.formState.errors.zipCode.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="bedrooms">Quartos</Label>
              <Input
                id="bedrooms"
                type="number"
                min="0"
                {...form.register("bedrooms")}
              />
              {form.formState.errors.bedrooms && (
                <p className="text-sm text-red-500">{form.formState.errors.bedrooms.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bathrooms">Banheiros</Label>
              <Input
                id="bathrooms"
                type="number"
                min="0"
                {...form.register("bathrooms")}
              />
              {form.formState.errors.bathrooms && (
                <p className="text-sm text-red-500">{form.formState.errors.bathrooms.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="parkingSpaces">Vagas</Label>
              <Input
                id="parkingSpaces"
                type="number"
                min="0"
                {...form.register("parkingSpaces")}
              />
              {form.formState.errors.parkingSpaces && (
                <p className="text-sm text-red-500">{form.formState.errors.parkingSpaces.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select
                onValueChange={(value) => form.setValue("type", value as any)}
                defaultValue={form.getValues("type")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apartment">Apartamento</SelectItem>
                  <SelectItem value="house">Casa</SelectItem>
                  <SelectItem value="commercial">Comercial</SelectItem>
                  <SelectItem value="land">Terreno</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.type && (
                <p className="text-sm text-red-500">{form.formState.errors.type.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                onValueChange={(value) => form.setValue("status", value as any)}
                defaultValue={form.getValues("status")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="forSale">À Venda</SelectItem>
                  <SelectItem value="forRent">Para Alugar</SelectItem>
                  <SelectItem value="sold">Vendido</SelectItem>
                  <SelectItem value="rented">Alugado</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.status && (
                <p className="text-sm text-red-500">{form.formState.errors.status.message}</p>
              )}
            </div>

            <div className="flex items-center space-x-2 pt-8">
              <input
                type="checkbox"
                id="featured"
                className="h-4 w-4 rounded border-gray-300 text-propulse-600 focus:ring-propulse-500"
                {...form.register("featured")}
              />
              <Label htmlFor="featured" className="text-sm font-medium text-gray-700">
                Destacar imóvel
              </Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Imagens do Imóvel</Label>
            <div className="grid grid-cols-4 gap-2">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img 
                    src={URL.createObjectURL(image)} 
                    alt={`Imagem ${index + 1}`} 
                    className="w-full h-20 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full m-1"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              
              {property?.images && property.images.map((imageUrl, index) => (
                <div key={`existing-${index}`} className="relative">
                  <img 
                    src={imageUrl} 
                    alt={`Imagem existente ${index + 1}`} 
                    className="w-full h-20 object-cover rounded-md"
                  />
                </div>
              ))}
              
              {images.length < 20 && (
                <label className="flex items-center justify-center border-2 border-dashed rounded-md h-20 cursor-pointer hover:bg-gray-100">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <Plus className="h-6 w-6 text-gray-400" />
                </label>
              )}
            </div>
            {imageValidationError && (
              <p className="text-sm text-red-500">{imageValidationError}</p>
            )}
            <p className="text-xs text-gray-500">
              {images.length} imagens adicionadas. {property?.images ? property.images.length : 0} imagens existentes. 
              (Mínimo: 3, Máximo: 20)
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Salvando..." : property ? "Atualizar Imóvel" : "Cadastrar Imóvel"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
