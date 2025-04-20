
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { UserCog, LogOut } from "lucide-react";
import { UserProfile } from "@/types/auth";

interface MobileProfileProps {
  user: UserProfile;
  onProfileClick: () => void;
  onLogout: () => void;
}

export function MobileProfile({ user, onProfileClick, onLogout }: MobileProfileProps) {
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
    <div className="space-y-4">
      <div className="flex items-center gap-4 px-3">
        <button onClick={onProfileClick} className="flex items-center gap-3 w-full">
          <Avatar className="h-10 w-10 border-2 border-propulse-200">
            <AvatarImage 
              src={user?.avatar_url || (user?.name ? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random` : undefined)} 
              alt="User avatar" 
              className="object-cover object-center rounded-full"
            />
            <AvatarFallback className="bg-propulse-100 text-propulse-700">{getUserInitials(user?.name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            {user.plan && getPlanBadge(user.plan)}
          </div>
        </button>
      </div>
      <Link 
        to="/profile" 
        className="flex items-center w-full px-3 py-2 text-sm rounded-md hover:bg-muted"
        onClick={onProfileClick}
      >
        <UserCog className="h-5 w-5 mr-2" />
        Editar Perfil
      </Link>
      <Button 
        variant="ghost" 
        className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
        onClick={onLogout}
      >
        <LogOut className="h-5 w-5 mr-2" />
        Sair
      </Button>
    </div>
  );
}
