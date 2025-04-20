
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";
import { supabase } from "@/integrations/supabase/client";
import { NavProfile } from "./navbar/nav-profile";
import { NavLinks } from "./navbar/nav-links";
import { MobileMenu } from "./navbar/mobile-menu";
import { UserProfile } from "@/types/auth";

interface NavbarProps {
  isAuthenticated?: boolean;
  user?: UserProfile | null;
  onLogout?: () => void;
}

export function Navbar({ isAuthenticated = false, user, onLogout }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

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
    setIsMenuOpen(false);
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setIsMenuOpen(false);
  };

  const renderAuthButtons = () => {
    if (isAuthenticated && user) {
      return (
        <NavProfile 
          user={user}
          onProfileClick={handleProfileClick}
          onLogout={handleLogout}
        />
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

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <Logo className="h-8 w-auto" />
          </Link>
          <NavLinks />
        </div>

        {renderAuthButtons()}
        <MobileMenu 
          isOpen={isMenuOpen}
          onOpenChange={setIsMenuOpen}
          isAuthenticated={isAuthenticated}
          user={user}
          onProfileClick={handleProfileClick}
          onLogout={handleLogout}
        />
      </div>
    </header>
  );
}
