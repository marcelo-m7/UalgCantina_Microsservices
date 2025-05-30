// src/app/(admin)/layout.tsx
"use client";

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { AdminSidebar, MobileSheet } from '@/components/admin-sidebar';
import { CantinaCastLogo } from '@/components/icons';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="space-y-4 p-8 rounded-lg text-center">
          <CantinaCastLogo className="mx-auto h-16 w-16 text-primary animate-pulse" />
          <p className="text-lg font-semibold text-foreground">A carregar CantinaCast Admin...</p>
          <div className="space-y-2 mt-4 w-64 mx-auto">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    // This case should ideally be handled by the redirect, but as a fallback:
    return null; 
  }

  // Render the actual layout once user is confirmed
  return (
    <div className="flex h-screen bg-muted/40">
      <AdminSidebar />
      <div className="flex flex-1 flex-col md:ml-64"> {/* Adjust margin for desktop sidebar */}
        {/* Mobile Header */}
        <header className="md:hidden sticky top-0 z-20 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-2">
          <MobileSheet>
            {/* Pass the same content as desktop sidebar, but it will be rendered inside the sheet */}
            <div className="p-4 border-b border-sidebar-border">
              <Link href="/admin" className="flex items-center gap-2 text-primary-foreground">
                <CantinaCastLogo className="h-8 w-8 text-sidebar-primary-foreground" />
                <h2 className="text-xl font-semibold tracking-tight">CantinaCast</h2>
              </Link>
            </div>
            <AdminSidebar /> {/* This is a bit redundant, better to reconstruct nav for mobile sheet content if structure differs too much*/}
          </MobileSheet>
          <Link href="/admin" className="flex items-center gap-2 md:hidden">
            <CantinaCastLogo className="h-7 w-7 text-primary" />
            <span className="text-lg font-bold text-foreground">CantinaCast</span>
          </Link>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
