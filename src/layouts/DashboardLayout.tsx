import { Outlet, Link, useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, Home } from 'lucide-react';
import { LanguageToggle } from '@/components/LanguageToggle';

export const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b bg-card/95 backdrop-blur px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <Link to="/" className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded bg-primary text-primary-foreground font-bold text-sm">M</div>
                <span className="hidden font-semibold text-foreground sm:inline">MarketMate</span>
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <LanguageToggle />
              <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
                <Home className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => { logout(); navigate('/'); }}>
                <LogOut className="mr-1 h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {user?.name.charAt(0)}
              </div>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
