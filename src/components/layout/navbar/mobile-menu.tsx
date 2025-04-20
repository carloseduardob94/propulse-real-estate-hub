
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/brand/logo";
import { NavLinks } from "./nav-links";
import { MobileProfile } from "./mobile-profile";
import { UserProfile } from "@/types/auth";

interface MobileMenuProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isAuthenticated: boolean;
  user: UserProfile | null;
  onProfileClick: () => void;
  onLogout: () => void;
}

export function MobileMenu({ 
  isOpen,
  onOpenChange,
  isAuthenticated,
  user,
  onProfileClick,
  onLogout
}: MobileMenuProps) {
  const closeMenu = () => onOpenChange(false);

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
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
            <NavLinks isMobile onMobileClick={closeMenu} />
          </div>

          <div className="border-t py-4">
            {isAuthenticated && user ? (
              <MobileProfile 
                user={user}
                onProfileClick={() => {
                  onProfileClick();
                  closeMenu();
                }}
                onLogout={() => {
                  onLogout();
                  closeMenu();
                }}
              />
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
}
