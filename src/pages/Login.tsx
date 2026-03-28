import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/i18n';

const Login = () => {
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already logged in
  useState(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'business') navigate('/business');
      else navigate('/user');
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        toast({ title: t('welcome_back') + '!' });
        // Smart redirection based on role
        const currentUser = result.user || user; // Check both in case state update is async
        if (currentUser?.role === 'admin') navigate('/admin');
        else if (currentUser?.role === 'business') navigate('/business');
        else navigate('/user');
      } else {
        toast({ title: result.error || t('login_failed'), variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: t('login_failed'), variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto flex min-h-[70vh] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{t('welcome_back')}</CardTitle>
          <CardDescription>{t('sign_in_desc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><Label>{t('email')}</Label><Input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" /></div>
            <div><Label>{t('password')}</Label><Input type="password" value={password} onChange={e => setPassword(e.target.value)} required /></div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? t('loading') : t('sign_in')}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            {t('dont_have_account')}{' '}
            <Link to="/register" className="text-primary underline">{t('register')}</Link> {' '}
            <Link to="/register/business" className="text-primary underline">{t('register_as_business')}</Link>
          </div>
          <div className="mt-4 rounded-lg bg-muted p-3 text-xs text-muted-foreground">
            <p className="font-semibold mb-1">{t('demo_accounts')}:</p>
            <p>Admin: admin@marketmate.eg / admin123</p>
            <p>User: ahmed@example.com / user123</p>
            <p>Business: sarah@clinic.eg / business123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
