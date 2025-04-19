
import React from 'react';
import { Home, Users, FileText } from "lucide-react";

export const StatsSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center p-6 rounded-lg border bg-card shadow-sm">
            <div className="rounded-full bg-propulse-100 p-3 mr-4">
              <Home className="h-6 w-6 text-propulse-600" />
            </div>
            <div>
              <p className="text-3xl font-bold">Imóveis</p>
              <p className="text-muted-foreground">Cadastro e gestão de imóveis com informações completas</p>
            </div>
          </div>
          <div className="flex items-center p-6 rounded-lg border bg-card shadow-sm">
            <div className="rounded-full bg-success-100 p-3 mr-4">
              <Users className="h-6 w-6 text-success-600" />
            </div>
            <div>
              <p className="text-3xl font-bold">Leads</p>
              <p className="text-muted-foreground">Qualificação automática e priorização de leads</p>
            </div>
          </div>
          <div className="flex items-center p-6 rounded-lg border bg-card shadow-sm">
            <div className="rounded-full bg-blue-100 p-3 mr-4">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-3xl font-bold">Propostas</p>
              <p className="text-muted-foreground">Geração de propostas personalizadas com sua marca</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
