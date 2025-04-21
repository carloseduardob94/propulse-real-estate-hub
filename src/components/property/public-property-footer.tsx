
interface PublicPropertyFooterProps {
  companyName: string | null;
  name: string | null;
}

export function PublicPropertyFooter({ companyName, name }: PublicPropertyFooterProps) {
  return (
    <footer className="bg-white border-t py-6 mt-12 animate-fade-in">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} {companyName || name}. Todos os direitos reservados.</p>
        <p className="mt-1">Powered by MeuCorretorPRO</p>
      </div>
    </footer>
  );
}
