
export function formatWhatsappForDisplay(phoneNumber: string | null): string {
  if (!phoneNumber) return '';
  
  const numbers = phoneNumber.replace(/\D/g, '');
  if (numbers.length > 2) {
    let formatted = `(${numbers.substring(0, 2)})`;
    if (numbers.length > 7) {
      formatted = `(${numbers.substring(0, 2)}) ${numbers.substring(2, 7)}-${numbers.substring(7)}`;
    } else {
      formatted += numbers.substring(2);
    }
    return formatted;
  }
  return numbers;
}

export function formatWhatsappForStorage(phoneNumber: string | null): string | null {
  if (!phoneNumber) return null;
  const numbers = phoneNumber.replace(/\D/g, '');
  return numbers.length >= 10 && numbers.length <= 11 ? numbers : null;
}

export function validateWhatsapp(phoneNumber: string | null): boolean {
  if (!phoneNumber) return true;
  const numbers = phoneNumber.replace(/\D/g, '');
  return numbers.length >= 10 && numbers.length <= 11;
}
