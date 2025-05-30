// src/components/admin-sidebar.tsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/components/auth-provider';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Salad, // Using Salad for Dishes as per common food app iconography
  CalendarDays,
  ListFilter, // For Allergens
  Sparkles, // For AI Suggestions
  LogOut,
  Menu as MenuIcon,
  UserCircle,
  Settings
} from 'lucide-react';
import { CantinaCastLogo } from '@/components/icons';
import Image from 'next/image'; // For user avatar

const navItems = [
  { href: '/admin', label: 'Visão Geral', icon: LayoutDashboard },
  { href: '/admin/menus', label: 'Ementas', icon: CalendarDays },
  { href: '/admin/dishes', label: 'Pratos', icon: Salad },
  { href: '/admin/allergens', label: 'Alérgenos', icon: ListFilter },
  { href: '/admin/ai-suggestions', label: 'Sugestões AI', icon: Sparkles },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { user, signOut, loading } = useAuth();

  const navigationContent = (
    <>
      <div className="p-4 border-b border-sidebar-border">
        <Link href="/admin" className="flex items-center gap-2 text-primary-foreground">
          <CantinaCastLogo className="h-8 w-8 text-sidebar-primary-foreground" />
          <h2 className="text-xl font-semibold tracking-tight">CantinaCast</h2>
        </Link>
      </div>
      <ScrollArea className="flex-1 px-2 py-4">
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Button
              key={item.href}
              variant={pathname === item.href ? 'secondary' : 'ghost'}
              className={cn(
                "w-full justify-start text-sm",
                pathname === item.href 
                  ? "bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent/90" 
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              )}
              asChild
            >
              <Link href={item.href}>
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Link>
            </Button>
          ))}
        </nav>
      </ScrollArea>
      <div className="p-3 border-t border-sidebar-border mt-auto">
        {user && (
          <div className="flex items-center gap-2 mb-3 p-2 rounded-md bg-sidebar-accent/20">
            {user.photoURL ? (
              <Image src={user.photoURL} alt={user.displayName || "User"} width={32} height={32} className="rounded-full" />
            ) : (
              <UserCircle className="h-8 w-8 text-sidebar-foreground rounded-full" />
            )}
            <div className="text-xs">
              <p className="font-semibold text-sidebar-foreground">{user.displayName || "Utilizador"}</p>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>
        )}
         <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
          asChild
        >
          <Link href="/admin/settings">
            <Settings className="mr-2 h-4 w-4" />
            Configurações
          </Link>
        </Button>
        <Button
          onClick={signOut}
          variant="ghost"
          className="w-full justify-start text-destructive-foreground bg-destructive/80 hover:bg-destructive"
          disabled={loading}
          aria-label="Terminar Sessão"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Terminar Sessão
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border fixed top-0 left-0 h-full z-30">
        {navigationContent}
      </aside>

      {/* Mobile Sidebar Trigger (placed in AdminLayout Header) */}
    </>
  );
}

export function MobileSheet({ children }: { children: React.ReactNode }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden text-foreground">
          <MenuIcon className="h-6 w-6" />
          <span className="sr-only">Abrir Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-72 bg-sidebar text-sidebar-foreground border-r-0 flex flex-col">
        {children}
      </SheetContent>
    </Sheet>
  );
}
