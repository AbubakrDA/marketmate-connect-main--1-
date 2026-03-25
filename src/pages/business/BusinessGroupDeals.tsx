import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/i18n';
import { getBusinessByOwner, getGroupDealsByBusiness, addGroupDeal, getGroupDealParticipants, getUserById } from '@/data/mock';
import type { GroupDeal } from '@/data/mock';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Users, Clock } from 'lucide-react';
import { CATEGORIES, AREAS, CITIES } from '@/types';

const BusinessGroupDeals = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { toast } = useToast();
  const biz = getBusinessByOwner(user?.id || '');
  const [, setRefresh] = useState(0);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', category: '', city: 'Cairo', area: '', originalPrice: '', dealPrice: '', requiredParticipants: '', endDate: '' });

  if (!biz) return <div className="p-8 text-muted-foreground">{t('no_business_profile')}</div>;

  const deals = getGroupDealsByBusiness(biz.id);

  const handleCreate = () => {
    if (!form.title || !form.category || !form.originalPrice || !form.dealPrice || !form.requiredParticipants) {
      toast({ title: t('fill_required'), variant: 'destructive' }); return;
    }
    const deal: GroupDeal = {
      id: `gd${Date.now()}`,
      businessId: biz.id,
      title: form.title,
      description: form.description,
      category: form.category,
      city: form.city,
      area: form.area,
      originalPrice: Number(form.originalPrice),
      dealPrice: Number(form.dealPrice),
      requiredParticipants: Number(form.requiredParticipants),
      currentParticipants: 0,
      startDate: new Date().toISOString().split('T')[0],
      endDate: form.endDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    addGroupDeal(deal);
    toast({ title: t('group_deal_created') });
    setOpen(false);
    setForm({ title: '', description: '', category: '', city: 'Cairo', area: '', originalPrice: '', dealPrice: '', requiredParticipants: '', endDate: '' });
    setRefresh(r => r + 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('group_deals')}</h1>
          <p className="text-muted-foreground">{t('manage_group_deals_desc')}</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-coral text-coral-foreground hover:bg-coral/90"><PlusCircle className="mr-2 h-4 w-4" />{t('create_group_deal')}</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{t('create_group_deal')}</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>{t('title')}</Label><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
              <div><Label>{t('description')}</Label><Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>{t('category')}</Label>
                  <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                    <SelectTrigger><SelectValue placeholder={t('select_category')} /></SelectTrigger>
                    <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>{t('area')}</Label>
                  <Select value={form.area} onValueChange={v => setForm(f => ({ ...f, area: v }))}>
                    <SelectTrigger><SelectValue placeholder={t('area')} /></SelectTrigger>
                    <SelectContent>{AREAS.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div><Label>{t('original_price')} ({t('egp')})</Label><Input type="number" value={form.originalPrice} onChange={e => setForm(f => ({ ...f, originalPrice: e.target.value }))} /></div>
                <div><Label>{t('group_price')} ({t('egp')})</Label><Input type="number" value={form.dealPrice} onChange={e => setForm(f => ({ ...f, dealPrice: e.target.value }))} /></div>
                <div><Label>{t('required_participants')}</Label><Input type="number" value={form.requiredParticipants} onChange={e => setForm(f => ({ ...f, requiredParticipants: e.target.value }))} /></div>
              </div>
              <div><Label>{t('end_date')}</Label><Input type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} /></div>
              <Button onClick={handleCreate} className="w-full">{t('create_group_deal')}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">{t('active')} ({deals.filter(d => d.status === 'active').length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({deals.filter(d => d.status === 'completed').length})</TabsTrigger>
          <TabsTrigger value="all">{t('all')} ({deals.length})</TabsTrigger>
        </TabsList>

        {['active', 'completed', 'all'].map(tab => (
          <TabsContent key={tab} value={tab}>
            <div className="grid gap-4">
              {deals.filter(d => tab === 'all' || d.status === tab).map(deal => {
                const pct = Math.round((deal.currentParticipants / deal.requiredParticipants) * 100);
                const participants = getGroupDealParticipants(deal.id);
                return (
                  <Card key={deal.id}>
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-bold text-foreground">{deal.title}</h3>
                          <p className="text-sm text-muted-foreground">{deal.area} · {deal.category}</p>
                        </div>
                        <Badge variant={deal.status === 'active' ? 'default' : deal.status === 'completed' ? 'secondary' : 'outline'}>
                          {deal.status}
                        </Badge>
                      </div>
                      <div className="flex gap-4 text-sm text-muted-foreground mb-3">
                        <span className="line-through">{deal.originalPrice} {t('egp')}</span>
                        <span className="font-semibold text-foreground">{deal.dealPrice} {t('egp')}</span>
                      </div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{deal.currentParticipants} / {deal.requiredParticipants}</span>
                        <span>{pct}%</span>
                      </div>
                      <Progress value={pct} className="h-2 mb-3" />
                      {participants.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {participants.map(p => {
                            const u = getUserById(p.userId);
                            return <Badge key={p.id} variant="outline" className="text-[10px]">{u?.name || 'User'}</Badge>;
                          })}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default BusinessGroupDeals;
