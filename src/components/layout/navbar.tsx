import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, Home, Users, FileText, BadgeDollarSign, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Logo } from "@/components/brand/logo";

interface NavbarProps {
  isAuthenticated?: boolean;
  user?: {
    name: string;
    email: string;
    plan: 'free' | 'monthly' | 'yearly';
  };
  onLogout?: () => void;
}

export function Navbar({ isAuthenticated = false, user, onLogout }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const getPlanBadge = (plan: 'free' | 'monthly' | 'yearly') => {
    switch (plan) {
      case 'free':
        return <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">Free</span>;
      case 'monthly':
        return <span className="ml-2 text-xs bg-propulse-100 text-propulse-600 px-2 py-1 rounded-full">Mensal</span>;
      case 'yearly':
        return <span className="ml-2 text-xs bg-success-100 text-success-600 px-2 py-1 rounded-full">Anual</span>;
      default:
        return null;
    }
  };

  const navLinks = [
    { href: "/", label: "Início", icon: Home },
    { href: "/properties", label: "Imóveis", icon: Home },
    { href: "/leads", label: "Leads", icon: Users },
    { href: "/proposals", label: "Propostas", icon: FileText },
    { href: "/plans", label: "Planos", icon: BadgeDollarSign },
  ];

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
            {isAuthenticated ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4 px-3">
                  <Avatar className="border-2 border-propulse-200">
                    <AvatarImage src={user?.name ? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random` : undefined} />
                    <AvatarFallback className="bg-propulse-100 text-propulse-700">{user?.name?.charAt(0) || '?'}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                    {user?.plan && getPlanBadge(user.plan)}
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={() => {
                    if (onLogout) onLogout();
                    closeMenu();
                  }}
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
                  <Link to="/login" onClick={() => { setIsMenuOpen(false); }}>Cadastre-se</Link>
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
      {navLinks.map((link) => (
        <Link
          key={link.href}
          to={link.href}
          className="text-sm font-medium hover:text-propulse-600 transition-colors"
        >
          {link.label}
        </Link>
      ))}
    </div>
  );

  const renderAuthButtons = () => {
    if (isAuthenticated) {
      return (
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-3 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-full border shadow-sm">
            <Avatar className="h-8 w-8 border-2 border-propulse-100">
              <AvatarImage src={user?.name ? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random` : undefined} />
              <AvatarFallback className="bg-propulse-100 text-propulse-700">{user?.name?.charAt(0) || '?'}</AvatarFallback>
            </Avatar>
            <div className="hidden lg:block">
              <p className="text-sm font-medium">{user?.name}</p>
              {user?.plan && getPlanBadge(user.plan)}
            </div>
            <Button variant="ghost" size="icon" className="ml-1" onClick={onLogout}>
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

function Logo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center ${className}`}>
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mr-2"
      >
        <rect width="32" height="32" rx="6" fill="#4b4ae4" />
        <path
          d="M8 9.33333H12L16 22.6667H20L24 9.33333"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7 18.6667H25"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
      <span className="font-bold text-xl text-propulse-800">MeuCorretorPRO</span>
    </div>
  );
}
