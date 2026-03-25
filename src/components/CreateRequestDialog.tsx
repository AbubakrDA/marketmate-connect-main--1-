import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CATEGORIES, SUBCATEGORIES, AREAS, CITIES } from '@/types';
import { PlusCircle, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/i18n';
import { useAuth } from '@/context/AuthContext';
import { canUserPostRequest, consumeRequestCredit, buyerRequests, getWalletByUser } from '@/data/mock';

interface Props {
  onCreated?: () => void;
}

export const CreateRequestDialog = ({ onCreated }: Props) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [category, setCategory] = useState('');

  const check = canUserPostRequest(user?.id || '');
  const wallet = getWalletByUser(user?.id || '');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const recheck = canUserPostRequest(user?.id || '');
    if (!recheck.allowed) {
      toast({ title: 'Cannot post request', description: recheck.reason, variant: 'destructive' });
      return;
    }
    consumeRequestCredit(user?.id || '');
    const fd = new FormData(e.currentTarget);
    buyerRequests.push({
      id: `br${Date.now()}`,
      userId: user?.id || '',
      title: fd.get('title') as string,
      description: fd.get('description') as string,
      category: fd.get('category') as string || category,
      city: fd.get('city') as string || 'Cairo',
      area: fd.get('area') as string || '',
      status: 'open',
      createdAt: new Date().toISOString().split('T')[0],
    });
    toast({ title: t('request_posted'), description: t('request_posted_desc') });
    setOpen(false);
    onCreated?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-coral text-coral-foreground hover:bg-coral/90">
          <PlusCircle className="mr-2 h-4 w-4" />{t('post_request')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{t('what_do_you_need')}</DialogTitle>
        </DialogHeader>

        {!check.allowed ? (
          <div className="space-y-4 py-6 text-center">
            <Lock className="mx-auto h-12 w-12 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">{check.reason}</p>
            <p className="text-xs text-muted-foreground">Credits: {wallet?.requestCredits || 0} | Free used: {wallet?.freeRequestsUsed || 0}/3</p>
            <Button onClick={() => { setOpen(false); toast({ title: 'Purchase credits coming soon!' }); }}>
              Buy Request Credits
            </Button>
          </div>
        ) : (
          <>
            <p className="text-xs text-muted-foreground">
              {wallet && wallet.freeRequestsUsed < 3
                ? `Free requests remaining: ${3 - wallet.freeRequestsUsed}`
                : `Credits remaining: ${wallet?.requestCredits || 0}`}
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>{t('title')}</Label>
                <Input name="title" required placeholder="" />
              </div>
              <div>
                <Label>{t('description')}</Label>
                <Textarea name="description" required rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>{t('category')}</Label>
                  <Select name="category" required onValueChange={setCategory}>
                    <SelectTrigger><SelectValue placeholder={t('select')} /></SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>{t('sub_category')}</Label>
                  <Select name="subCategory">
                    <SelectTrigger><SelectValue placeholder={t('select')} /></SelectTrigger>
                    <SelectContent>
                      {(SUBCATEGORIES[category] || []).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>{t('city')}</Label>
                  <Select name="city" required>
                    <SelectTrigger><SelectValue placeholder={t('select')} /></SelectTrigger>
                    <SelectContent>
                      {CITIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>{t('area')}</Label>
                  <Select name="area" required>
                    <SelectTrigger><SelectValue placeholder={t('select')} /></SelectTrigger>
                    <SelectContent>
                      {AREAS.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>{t('min_budget')}</Label>
                  <Input name="minPrice" type="number" placeholder="0" />
                </div>
                <div>
                  <Label>{t('max_budget')}</Label>
                  <Input name="maxPrice" type="number" placeholder="0" />
                </div>
              </div>
              <div>
                <Label>{t('date_needed')}</Label>
                <Input name="dateNeeded" type="date" />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>{t('cancel')}</Button>
                <Button type="submit" className="bg-coral text-coral-foreground hover:bg-coral/90">{t('post_request')}</Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
