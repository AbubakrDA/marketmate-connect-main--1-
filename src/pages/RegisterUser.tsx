import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/i18n';

const RegisterUser = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await register({ ...form, role: 'user' });
    if (result.success) { toast({ title: t('account_created') }); navigate('/'); }
    else toast({ title: result.error || t('registration_failed'), variant: 'destructive' });
  };

  return (
    <div className="container mx-auto flex min-h-[70vh] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{t('create_account')}</CardTitle>
          <CardDescription>{t('create_account_desc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><Label>{t('full_name')}</Label><Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required /></div>
            <div><Label>{t('email')}</Label><Input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required /></div>
            <div><Label>{t('phone')}</Label><Input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} /></div>
            <div><Label>{t('password')}</Label><Input type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required /></div>
            <Button type="submit" className="w-full">{t('register')}</Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            {t('already_have_account')} <Link to="/login" className="text-primary underline">{t('sign_in')}</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterUser;
