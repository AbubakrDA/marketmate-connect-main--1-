import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CATEGORIES } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/i18n';

const RegisterBusiness = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', businessName: '', category: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = register({ name: form.name, email: form.email, password: form.password, phone: form.phone, role: 'business' });
    if (result.success) { toast({ title: t('business_registered') }); navigate('/business'); }
    else toast({ title: result.error || t('registration_failed'), variant: 'destructive' });
  };

  return (
    <div className="container mx-auto flex min-h-[70vh] items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{t('register_business')}</CardTitle>
          <CardDescription>{t('register_business_desc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><Label>{t('your_name')}</Label><Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required /></div>
            <div><Label>{t('business_name')}</Label><Input value={form.businessName} onChange={e => setForm(p => ({ ...p, businessName: e.target.value }))} required /></div>
            <div>
              <Label>{t('category')}</Label>
              <Select value={form.category} onValueChange={v => setForm(p => ({ ...p, category: v }))}>
                <SelectTrigger><SelectValue placeholder={t('select_category')} /></SelectTrigger>
                <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>{t('email')}</Label><Input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required /></div>
            <div><Label>{t('phone')}</Label><Input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} required /></div>
            <div><Label>{t('password')}</Label><Input type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required /></div>
            <Button type="submit" className="w-full bg-coral text-coral-foreground hover:bg-coral/90">{t('register_business')}</Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            {t('already_registered')} <Link to="/login" className="text-primary underline">{t('sign_in')}</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterBusiness;
