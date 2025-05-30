// src/app/(admin)/admin/settings/page.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings as SettingsIcon } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <SettingsIcon className="mr-2 h-6 w-6 text-primary" />
            Configurações
          </CardTitle>
          <CardDescription>
            Gestão de configurações da aplicação CantinaCast. (Funcionalidade em desenvolvimento)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Esta página permitirá configurar diversos aspetos da aplicação, como integrações, notificações,
            e preferências gerais do sistema.
          </p>
          <div className="mt-6 p-8 border-2 border-dashed border-border rounded-lg text-center">
            <h3 className="text-xl font-semibold text-foreground">Em Breve</h3>
            <p className="text-muted-foreground mt-2">
              Mais opções de configuração serão adicionadas futuramente.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
