// src/app/(public)/layout.tsx
import type { ReactNode } from 'react';
import { PublicHeader } from '@/components/public-header';

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="bg-card text-center py-4 text-sm text-muted-foreground mt-auto">
        <p>&copy; {new Date().getFullYear()} CantinaCast - Universidade do Algarve. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
