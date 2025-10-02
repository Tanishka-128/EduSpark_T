'use client';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Award,
  BookOpen,
  BotMessageSquare,
  BrainCircuit,
  Home,
  Loader2,
  LogIn,
  LogOut,
  Map,
  Rocket,
  Settings,
  Users,
  Video,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useAuth, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';
import { toast } from '@/hooks/use-toast';

const navItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/resources', label: 'Resources', icon: Rocket },
  { href: '/learn', label: 'Learn', icon: BrainCircuit },
  { href: '/roadmap', label: 'Roadmap', icon: Map },
  { href: '/chatbot', label: 'AI Tutor', icon: BotMessageSquare },
  { href: '/community', label: 'Community', icon: Users },
  { href: '/leaderboard', label: 'Leaderboard', icon: Award },
  { href: '/study-sessions', label: 'Study Sessions', icon: Video },
];

function UserProfile() {
  const auth = useAuth();
  const { user } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: 'Logged out successfully.' });
      router.push('/login');
    } catch (error) {
      toast({ variant: 'destructive', title: 'Failed to log out.' });
    }
  };
  
  if (!user) {
    return (
      <Link href="/login" className='w-full'>
        <Button variant="ghost" className="h-auto w-full justify-start gap-3 p-2 text-left">
          <Avatar className="h-9 w-9">
            <AvatarFallback>?</AvatarFallback>
          </Avatar>
          <div className="truncate">
            <p className="font-semibold text-sm text-primary-foreground">Guest</p>
            <p className="text-xs text-primary-foreground/70">Click to log in</p>
          </div>
        </Button>
      </Link>
    )
  }

  return (
     <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-auto w-full justify-start gap-3 p-2 text-left">
            <Avatar className="h-9 w-9">
              <AvatarImage data-ai-hint="person portrait" src={user.photoURL || `https://i.pravatar.cc/150?u=${user.uid}`} alt={user.displayName || 'User'} />
              <AvatarFallback>{user.displayName ? user.displayName[0] : 'U'}</AvatarFallback>
            </Avatar>
            <div className="truncate">
              <p className="font-semibold text-sm text-primary-foreground">{user.displayName || 'User'}</p>
              <p className="text-xs text-primary-foreground/70">{user.email}</p>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 mb-2" side="top" align="start">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
  )
}

function AppSidebar() {
  const pathname = usePathname();
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-foreground">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <h1 className="font-headline text-xl font-bold text-primary-foreground">EduSpark</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <Link href={item.href}>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  tooltip={{ children: item.label, side: 'right' }}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <UserProfile />
      </SidebarFooter>
    </Sidebar>
  );
}

function AppHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/80 px-6 backdrop-blur-sm">
      <SidebarTrigger className="md:hidden" />
      <div className="flex-1">
        {/* Breadcrumbs can be added here */}
      </div>
    </header>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If still loading, do nothing.
    if (isUserLoading) return;

    // If there's no user and we are not on the login page, redirect.
    if (!user && pathname !== '/login') {
      router.push('/login');
    }
  }, [user, isUserLoading, pathname, router]);

  if (isUserLoading && pathname !== '/login') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  // Allow access to login page even if not authenticated
  if (pathname === '/login') {
    return <main>{children}</main>;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
