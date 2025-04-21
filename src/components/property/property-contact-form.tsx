
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PropertyContactFormProps {
  propertyId: string;
  userId: string;
  propertyTitle: string;
  onClose?: () => void;
}

export function PropertyContactForm({ propertyId, userId, propertyTitle, onClose }: PropertyContactFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Form validation
      if (!formData.name || !formData.phone) {
        throw new Error("Nome e telefone são obrigatórios");
      }

      // Submit lead to database
      const { error } = await supabase.from('leads').insert([
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          user_id: userId,
          property_type: [propertyTitle], // Store property title in array for compatibility
          preferred_location: "Interesse via catálogo público",
          status: "new",
          budget: 0, // Default value as it's required in the DB
        },
      ]);

      if (error) throw error;

      toast({
        title: "Mensagem enviada com sucesso!",
        description: "O corretor entrará em contato em breve.",
      });

      // Reset form or close it
      if (onClose) {
        onClose();
      } else {
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: ""
        });
      }
    } catch (error: any) {
      console.error("Error submitting lead:", error);
      toast({
        title: "Erro ao enviar mensagem",
        description: error.message || "Ocorreu um erro ao enviar sua mensagem.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nome*</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Seu nome completo"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="seu.email@exemplo.com"
        />
      </div>
      
      <div>
        <Label htmlFor="phone">Telefone*</Label>
        <Input
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="(00) 00000-0000"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="message">Mensagem</Label>
        <Textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Gostaria de saber mais sobre este imóvel..."
          rows={3}
        />
      </div>
      
      <div className="flex gap-2 justify-end pt-2">
        {onClose && (
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
        )}
        <Button 
          type="submit" 
          className="bg-propulse-600 hover:bg-propulse-700 text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Enviando..." : "Enviar Mensagem"}
        </Button>
      </div>
    </form>
  );
}
