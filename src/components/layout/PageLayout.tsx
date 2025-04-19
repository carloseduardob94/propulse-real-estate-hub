
import { ReactNode } from "react";
import { Navbar } from "@/components/layout/navbar";
import { UserProfile } from "@/types/auth";

interface PageLayoutProps {
  isAuthenticated: boolean;
  user: UserProfile;
  onLogout: () => void;
  title: string;
  description: string;
  actionButton?: ReactNode;
  children: ReactNode;
}

export function PageLayout({ 
  isAuthenticated,
  user,
  onLogout,
  title,
  description,
  actionButton,
  children 
}: PageLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar 
        isAuthenticated={isAuthenticated} 
        user={user}
        onLogout={onLogout}
      />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">{title}</h1>
            <p className="text-muted-foreground">
              {description}
            </p>
          </div>
          
          {actionButton}
        </div>
        
        {children}
      </main>
      
      <footer className="py-6 bg-white border-t">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} MeuCorretorPRO. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
