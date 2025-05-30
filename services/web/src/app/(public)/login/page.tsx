// src/app/(public)/login/page.tsx
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CantinaCastLogo } from '@/components/icons';
import { ChromeIcon } from 'lucide-react'; // Using ChromeIcon as a generic Google icon

export default function LoginPage() {
  const { user, loading, signInWithGoogle } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/admin'); // Redirect if already logged in
    }
  }, [user, loading, router]);

  if (loading || (!loading && user)) {
    return <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">A verificar autenticação...</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)] py-12">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <CantinaCastLogo className="mx-auto h-16 w-16 text-primary mb-4" />
          <CardTitle className="text-3xl font-bold">Bem-vindo ao CantinaCast</CardTitle>
          <CardDescription className="text-md">Faça login para aceder ao painel de administração.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button 
            onClick={signInWithGoogle} 
            className="w-full text-lg py-6 bg-primary hover:bg-primary/90"
            disabled={loading}
            aria-label="Login com Google"
          >
            <ChromeIcon className="mr-3 h-6 w-6" /> {/* Using Chrome as placeholder for Google Icon */}
            {loading ? 'Aguarde...' : 'Login com Google'}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Ao continuar, concorda com os nossos Termos de Serviço e Política de Privacidade.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
