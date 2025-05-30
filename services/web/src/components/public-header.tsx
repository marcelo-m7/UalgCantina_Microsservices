// src/components/public-header.tsx
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CantinaCastLogo } from '@/components/icons';
import { useAuth } from '@/components/auth-provider';
import { UserCircle, LogIn } from 'lucide-react';

export function PublicHeader() {
  const { user, loading } = useAuth();

  return (
    <header className="bg-card shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/menu" className="flex items-center gap-2 text-primary hover:text-accent transition-colors">
          <CantinaCastLogo className="h-8 w-8" />
          <h1 className="text-2xl font-bold tracking-tight">CantinaCast</h1>
        </Link>
        <nav>
          <ul className="flex items-center gap-4">
            <li>
              <Button variant="ghost" asChild>
                <Link href="/menu">Ementa Semanal</Link>
              </Button>
            </li>
            <li>
              {loading ? (
                 <Button variant="outline" disabled>Loading...</Button>
              ) : user ? (
                <Button variant="outline" asChild>
                  <Link href="/admin" className="flex items-center gap-2">
                    <UserCircle size={18} /> Dashboard
                  </Link>
                </Button>
              ) : (
                <Button variant="default" asChild>
                  <Link href="/login" className="flex items-center gap-2">
                    <LogIn size={18} /> Login
                  </Link>
                </Button>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
