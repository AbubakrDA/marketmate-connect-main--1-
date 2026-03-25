import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Send } from 'lucide-react';
import { useTranslation } from '@/i18n';

interface Props {
  listingId: string;
  businessId: string;
  onSubmit?: () => void;
}

export const LeadForm = ({ listingId, businessId, onSubmit }: Props) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast({ title: t('fill_required'), variant: 'destructive' });
      return;
    }
    toast({ title: t('inquiry_sent'), description: t('business_will_contact') });
    setForm(prev => ({ ...prev, message: '' }));
    onSubmit?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="lead-name">{t('name')} *</Label>
          <Input id="lead-name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
        </div>
        <div>
          <Label htmlFor="lead-email">{t('email')} *</Label>
          <Input id="lead-email" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
        </div>
      </div>
      <div>
        <Label htmlFor="lead-phone">{t('phone')}</Label>
        <Input id="lead-phone" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
      </div>
      <div>
        <Label htmlFor="lead-message">{t('message')} *</Label>
        <Textarea id="lead-message" value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} placeholder={t('interested_placeholder')} rows={4} required />
      </div>
      <Button type="submit" className="w-full bg-coral text-coral-foreground hover:bg-coral/90">
        <Send className="mr-2 h-4 w-4" /> {t('send_inquiry')}
      </Button>
    </form>
  );
};
