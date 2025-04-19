
import { UserProfile } from "@/types/auth";

export const getUserSlug = (profile: UserProfile) => {
  const baseSlug = profile.company_name || profile.name || profile.id;
  return baseSlug.toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
};
