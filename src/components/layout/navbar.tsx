import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, Home, Building, Users, FileText, BadgeDollarSign, LogOut, UserCog } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Logo } from "@/components/brand/logo";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { UserProfile } from "@/types/auth";

interface NavbarProps {
  isAuthenticated?: boolean;
  user?: UserProfile | null;
  onLogout?: () => void;
}

export function Navbar({ isAuthenticated = false, user, onLogout }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    if (onLogout) {
      onLogout();
    } else {
      try {
        await supabase.auth.signOut();
        navigate('/login');
      } catch (error) {
        console.error("Logout error:", error);
      }
    }
    closeMenu();
  };

  const handleProfileClick = () => {
    navigate('/profile');
    closeMenu();
  };

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

  const isActive = (path: string) => {
    return location.pathname === path || 
           (path !== '/' && location.pathname.startsWith(path));
  };

  const navLinks = [
    { href: "/", label: "Início", icon: Home },
    { href: "/properties", label: "Imóveis", icon: Building },
    { href: "/leads", label: "Leads", icon: Users },
    { href: "/proposals", label: "Propostas", icon: FileText },
    { href: "/plans", label: "Planos", icon: BadgeDollarSign },
  ];

  const renderAuthButtons = () => {
    if (isAuthenticated && user) {
      return (
        <div className="hidden md:flex items-center gap-4">
          <div 
            className="flex items-center gap-3 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-full border shadow-sm hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={handleProfileClick}
          >
            <Avatar className="h-10 w-10 md:h-12 md:w-12 border-2 border-propulse-100 object-cover">
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
              <p className="text-sm font-medium">{user.name}</p>
              {user.plan && getPlanBadge(user.plan)}
            </div>
            <Button variant="ghost" size="icon" className="ml-1" onClick={(e) => {
              e.stopPropagation();
              handleLogout();
            }}>
              <LogOut className="h-5 w-5 text-gray-500 hover:text-red-500 transition-colors" />
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="hidden md:flex items-center gap-4">
        <Button variant="ghost" asChild>
          <Link to="/login">Entrar</Link>
        </Button>
        <Button asChild>
          <Link to="/login">Cadastre-se</Link>
        </Button>
      </div>
    );
  };

  const renderMobileMenu = () => (
    <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] sm:w-[350px]">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between py-4">
            <Link to="/" className="flex items-center gap-2" onClick={closeMenu}>
              <Logo />
            </Link>
            <Button variant="ghost" size="icon" onClick={closeMenu}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex-1 my-4">
            <nav className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-muted"
                  onClick={closeMenu}
                >
                  <link.icon className="h-5 w-5" />
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="border-t py-4">
            {isAuthenticated && user ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4 px-3">
                  <button onClick={handleProfileClick} className="flex items-center gap-3 w-full">
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
                  onClick={closeMenu}
                >
                  <UserCog className="h-5 w-5 mr-2" />
                  Editar Perfil
                </Link>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Sair
                </Button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2 px-3">
                <Button asChild>
                  <Link to="/login" onClick={closeMenu}>Entrar</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/login" onClick={closeMenu}>Cadastre-se</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );

  const renderDesktopMenu = () => (
    <div className="hidden md:flex items-center gap-6">
      {navLinks.map((link) => {
        const active = isActive(link.href);
        return (
          <Link
            key={link.href}
            to={link.href}
            className={`flex items-center gap-2 text-sm font-medium transition-colors px-3 py-2 rounded-md ${
              active 
                ? "text-propulse-600 bg-propulse-50"
                : "text-gray-600 hover:text-propulse-600 hover:bg-gray-50"
            }`}
          >
            <link.icon className={`h-4 w-4 ${active ? "text-propulse-600" : "text-gray-500"}`} />
            {link.label}
          </Link>
        );
      })}
    </div>
  );

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <Logo className="h-8 w-auto" />
          </Link>
          {renderDesktopMenu()}
        </div>

        {renderAuthButtons()}
        {renderMobileMenu()}
      </div>
    </header>
  );
}
