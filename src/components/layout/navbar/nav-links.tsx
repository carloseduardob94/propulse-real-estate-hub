
import { Link, useLocation } from "react-router-dom";
import { Home, Building, Users, FileText, BadgeDollarSign } from "lucide-react";
import { ReactNode } from "react";

interface NavLink {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navLinks: NavLink[] = [
  { href: "/", label: "Início", icon: Home },
  { href: "/properties", label: "Imóveis", icon: Building },
  { href: "/leads", label: "Leads", icon: Users },
  { href: "/proposals", label: "Propostas", icon: FileText },
  { href: "/plans", label: "Planos", icon: BadgeDollarSign },
];

interface NavLinksProps {
  isMobile?: boolean;
  onMobileClick?: () => void;
}

export function NavLinks({ isMobile = false, onMobileClick }: NavLinksProps) {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path || 
           (path !== '/' && location.pathname.startsWith(path));
  };

  if (isMobile) {
    return (
      <nav className="flex flex-col space-y-1">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            to={link.href}
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-muted"
            onClick={onMobileClick}
          >
            <link.icon className="h-5 w-5" />
            {link.label}
          </Link>
        ))}
      </nav>
    );
  }

  return (
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
}
