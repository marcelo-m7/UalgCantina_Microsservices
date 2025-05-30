// src/app/(admin)/admin/page.tsx
"use client";

import { useAuth } from '@/components/auth-provider';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FileText, Utensils, ChefHat, BarChart3, AlertTriangle } from 'lucide-react';

export default function AdminDashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <Card className="shadow-lg border-primary border-l-4">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary">
            Bem-vindo ao Painel de Administração, {user?.displayName?.split(' ')[0] || 'Administrador'}!
          </CardTitle>
          <CardDescription className="text-md text-muted-foreground">
            Gestão centralizada da ementa da cantina da Universidade do Algarve.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Utilize o menu lateral para navegar entre as secções de gestão de ementas, pratos, alérgenos e para aceder a sugestões inteligentes para os seus menus.</p>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <DashboardCard
          title="Gerir Ementas"
          description="Crie, visualize e atualize as ementas semanais."
          icon={FileText}
          link="/admin/menus"
          actionText="Ver Ementas"
        />
        <DashboardCard
          title="Gerir Pratos"
          description="Adicione e edite pratos, incluindo detalhes nutricionais e alérgenos."
          icon={Utensils}
          link="/admin/dishes"
          actionText="Ver Pratos"
        />
        <DashboardCard
          title="Gerir Alérgenos"
          description="Mantenha a lista de alérgenos atualizada."
          icon={AlertTriangle}
          link="/admin/allergens"
          actionText="Ver Alérgenos"
        />
        <DashboardCard
          title="Sugestões AI"
          description="Receba sugestões de combinações de pratos com base em IA."
          icon={ChefHat}
          link="/admin/ai-suggestions"
          actionText="Obter Sugestões"
        />
        <DashboardCard
          title="Estatísticas (Brevemente)"
          description="Visualize métricas de popularidade e consumo."
          icon={BarChart3}
          link="#"
          actionText="Ver Estatísticas"
          disabled
        />
      </div>
    </div>
  );
}

interface DashboardCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  link: string;
  actionText: string;
  disabled?: boolean;
}

function DashboardCard({ title, description, icon: Icon, link, actionText, disabled }: DashboardCardProps) {
  return (
    <Card className="hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
        <Icon className="h-6 w-6 text-accent" />
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full" disabled={disabled}>
          <Link href={link}>{actionText}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
