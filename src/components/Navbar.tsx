import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/i18n';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, LogOut, User, LayoutDashboard, Percent } from 'lucide-react';
import { LanguageToggle } from './LanguageToggle';
import { useState } from 'react';
import { CreateRequestDialog } from './CreateRequestDialog';

export const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardPath = () => {
    if (!user) return '/';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'business') return '/business';
    return '/user';
  };

  const navLinks = [
    { to: '/', label: t('home') },
    { to: '/marketplace', label: t('marketplace') },
    { to: '/seasonal-sales', label: t('sales') },
    { to: '/group-deals', label: t('group_deals') },
    { to: '/businesses', label: t('businesses') },
    { to: '/map', label: t('map') },
    { to: '/smart-map', label: t('smart_map') },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">M</div>
          <span className="text-xl font-bold text-foreground">{t('app_name')}</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated && user?.role === 'user' && <CreateRequestDialog />}
          <LanguageToggle />
          {isAuthenticated ? (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate(getDashboardPath())}>
                <LayoutDashboard className="mr-1 h-4 w-4" />
                {t('dashboard')}
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="mr-1 h-4 w-4" />
                {t('logout')}
              </Button>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {user?.name.charAt(0)}
              </div>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>{t('login')}</Button>
              <Button size="sm" className="bg-coral text-coral-foreground hover:bg-coral/90" onClick={() => navigate('/register')}>{t('register')}</Button>
            </>
          )}
        </div>

        {/* Mobile menu */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon"><Menu /></Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="mt-8 flex flex-col gap-4">
                {navLinks.map(link => (
                  <Link key={link.to} to={link.to} onClick={() => setOpen(false)} className="text-lg font-medium text-foreground">{link.label}</Link>
                ))}
                <hr className="my-2" />
                <LanguageToggle />
                {isAuthenticated ? (
                  <>
                    {user?.role === 'user' && <CreateRequestDialog />}
                    <Button variant="ghost" onClick={() => { navigate(getDashboardPath()); setOpen(false); }}>
                      <LayoutDashboard className="mr-2 h-4 w-4" />{t('dashboard')}
                    </Button>
                    <Button variant="ghost" onClick={() => { handleLogout(); setOpen(false); }}>
                      <LogOut className="mr-2 h-4 w-4" />{t('logout')}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" onClick={() => { navigate('/login'); setOpen(false); }}>{t('login')}</Button>
                    <Button className="bg-coral text-coral-foreground" onClick={() => { navigate('/register'); setOpen(false); }}>{t('register')}</Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};
