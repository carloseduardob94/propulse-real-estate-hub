import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut } from "lucide-react";
import { UserProfile } from "@/types/auth";

interface NavProfileProps {
  user: UserProfile;
  onProfileClick: () => void;
  onLogout: () => void;
}

export function NavProfile({ user, onProfileClick, onLogout }: NavProfileProps) {
  const getUserInitials = (name: string | null) => {
    if (!name) return '?';
    
    const nameParts = name.trim().split(' ');
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  };

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

  return (
    <div className="hidden md:flex items-center gap-4">
      <div 
        className="flex items-center gap-3 px-4 py-2 bg-propulse-50/50 backdrop-blur-sm rounded-full border shadow-sm hover:bg-propulse-100/50 transition-colors cursor-pointer group"
        onClick={onProfileClick}
      >
        <Avatar className="h-10 w-10 md:h-12 md:w-12 border-2 border-propulse-200 object-cover">
          <AvatarImage 
            src={user.avatar_url || (user.name ? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random` : undefined)} 
            alt="User avatar" 
            className="object-cover object-center rounded-full"
          />
          <AvatarFallback className="bg-propulse-100 text-propulse-700 text-lg font-semibold">
            {getUserInitials(user.name)}
          </AvatarFallback>
        </Avatar>
        <div className="hidden lg:block">
          <p className="text-sm font-medium text-gray-800 group-hover:text-propulse-700 transition-colors 
                        bg-gradient-to-r from-gray-800 to-propulse-700 bg-clip-text 
                        hover:text-transparent hover:bg-clip-text hover:from-propulse-700 hover:to-propulse-900">
            {user.name}
          </p>
          {user.plan && getPlanBadge(user.plan)}
        </div>
        <Button variant="ghost" size="icon" className="ml-1" onClick={(e) => {
          e.stopPropagation();
          onLogout();
        }}>
          <LogOut className="h-5 w-5 text-gray-500 hover:text-red-500 transition-colors" />
        </Button>
      </div>
    </div>
  );
}
