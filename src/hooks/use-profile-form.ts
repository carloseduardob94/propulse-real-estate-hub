
import { useState } from "react";
import { ProfileFormData, defaultFormData } from "@/utils/profile-utils";
import { formatWhatsappForDisplay } from "@/utils/format-whatsapp";

export function useProfileForm() {
  const [formData, setFormData] = useState<ProfileFormData>(defaultFormData);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'whatsapp') {
      const input = value.replace(/\D/g, '');
      if (input.length <= 11) {
        const formattedInput = formatWhatsappForDisplay(input);
        setFormData(prev => ({
          ...prev,
          [name]: formattedInput,
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return {
    formData,
    setFormData,
    handleFormChange,
  };
}
