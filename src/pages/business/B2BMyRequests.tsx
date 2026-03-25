import { useState } from 'react';
import { useTranslation } from '@/i18n';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { getBusinessByOwner, getB2BRequestsByBusiness, getB2BOffersByRequest, addB2BRequest, canBusinessPostB2B } from '@/data/mock';
import { CATEGORIES, CITIES, AREAS } from '@/types';
import { Plus, Package, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const B2BMyRequests = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [createOpen, setCreateOpen] = useState(false);
  const [, forceUpdate] = useState(0);

  const biz = getBusinessByOwner(user?.id || '');
  const requests = getB2BRequestsByBusiness(biz?.id || '');
  const check = canBusinessPostB2B(biz?.id || '');

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!check.allowed) { toast({ title: 'Error', description: check.reason, variant: 'destructive' }); return; }
    const fd = new FormData(e.currentTarget);
    addB2BRequest({
      id: `b2br${Date.now()}`,
      requesterBusinessId: biz?.id || '',
      title: fd.get('title') as string,
      description: fd.get('description') as string,
      category: fd.get('category') as string,
      quantity: Number(fd.get('quantity')),
      budgetMin: Number(fd.get('budgetMin')) || undefined,
      budgetMax: Number(fd.get('budgetMax')) || undefined,
      city: fd.get('city') as string,
      area: fd.get('area') as string,
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    toast({ title: t('b2b_request_posted') });
    setCreateOpen(false);
    forceUpdate(n => n + 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Package className="h-6 w-6 text-primary" />{t('b2b_my_requests')}</h1>
          <p className="text-muted-foreground">{t('b2b_my_requests_desc')}</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild><Button><Plus className="mr-1 h-4 w-4" />{t('b2b_post_request')}</Button></DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{t('b2b_post_request')}</DialogTitle></DialogHeader>
            {!check.allowed ? (
              <div className="text-center py-6 space-y-3">
                <Lock className="mx-auto h-12 w-12 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">{check.reason}</p>
              </div>
            ) : (
              <form onSubmit={handleCreate} className="space-y-4">
                <div><Label>{t('title')}</Label><Input name="title" required placeholder="e.g. Winter jackets supplier — 200 units" /></div>
                <div><Label>{t('description')}</Label><Textarea name="description" required rows={3} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{t('category')}</Label>
                    <Select name="category" required>
                      <SelectTrigger><SelectValue placeholder={t('select_category')} /></SelectTrigger>
                      <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div><Label>Quantity</Label><Input name="quantity" type="number" required /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>{t('min_budget')}/unit</Label><Input name="budgetMin" type="number" /></div>
                  <div><Label>{t('max_budget')}/unit</Label><Input name="budgetMax" type="number" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{t('city')}</Label>
                    <Select name="city" required>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{CITIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>{t('area')}</Label>
                    <Select name="area" required>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{AREAS.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>{t('cancel')}</Button>
                  <Button type="submit">{t('submit')}</Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {requests.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">{t('no_b2b_requests')}</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {requests.map(req => {
            const offerCount = getB2BOffersByRequest(req.id).length;
            return (
              <Card key={req.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/business/b2b/request/${req.id}`)}>
                <CardContent className="p-4 flex justify-between items-center">
                  <div className="space-y-1">
                    <h3 className="font-semibold">{req.title}</h3>
                    <div className="flex gap-2 text-sm">
                      <Badge variant="secondary">{req.category}</Badge>
                      <Badge variant="outline">Qty: {req.quantity}</Badge>
                      <span className="text-muted-foreground">{req.area}, {req.city}</span>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <Badge>{req.status}</Badge>
                    <p className="text-sm text-muted-foreground">{offerCount} offer(s)</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default B2BMyRequests;
