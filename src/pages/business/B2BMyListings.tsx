import { useState } from 'react';
import { useTranslation } from '@/i18n';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { getBusinessByOwner, getB2BListingsByBusiness, addB2BListing, canBusinessPostB2B } from '@/data/mock';
import { CATEGORIES, CITIES } from '@/types';
import { Plus, Package, Lock } from 'lucide-react';

const B2BMyListings = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [createOpen, setCreateOpen] = useState(false);
  const [, forceUpdate] = useState(0);

  const biz = getBusinessByOwner(user?.id || '');
  const listings = getB2BListingsByBusiness(biz?.id || '');
  const check = canBusinessPostB2B(biz?.id || '');

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!check.allowed) { toast({ title: 'Error', description: check.reason, variant: 'destructive' }); return; }
    const fd = new FormData(e.currentTarget);
    addB2BListing({
      id: `b2bl${Date.now()}`,
      supplierBusinessId: biz?.id || '',
      title: fd.get('title') as string,
      description: fd.get('description') as string,
      category: fd.get('category') as string,
      minimumOrderQuantity: Number(fd.get('moq')),
      unitPrice: Number(fd.get('unitPrice')),
      city: fd.get('city') as string,
      status: 'active',
      createdAt: new Date().toISOString(),
    });
    toast({ title: t('b2b_listing_created') });
    setCreateOpen(false);
    forceUpdate(n => n + 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Package className="h-6 w-6 text-primary" />{t('b2b_my_listings')}</h1>
          <p className="text-muted-foreground">{t('b2b_my_listings_desc')}</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild><Button><Plus className="mr-1 h-4 w-4" />{t('b2b_create_listing')}</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{t('b2b_create_listing')}</DialogTitle></DialogHeader>
            {!check.allowed ? (
              <div className="text-center py-6 space-y-3">
                <Lock className="mx-auto h-12 w-12 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">{check.reason}</p>
              </div>
            ) : (
              <form onSubmit={handleCreate} className="space-y-4">
                <div><Label>{t('title')}</Label><Input name="title" required placeholder="e.g. Wholesale Egyptian Cotton Fabrics" /></div>
                <div><Label>{t('description')}</Label><Textarea name="description" required rows={3} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{t('category')}</Label>
                    <Select name="category" required>
                      <SelectTrigger><SelectValue placeholder={t('select_category')} /></SelectTrigger>
                      <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>{t('city')}</Label>
                    <Select name="city" required>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{CITIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Unit Price ({t('egp')})</Label><Input name="unitPrice" type="number" required /></div>
                  <div><Label>Min Order Qty</Label><Input name="moq" type="number" required /></div>
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

      {listings.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">{t('no_b2b_listings')}</CardContent></Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {listings.map(listing => (
            <Card key={listing.id}>
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between">
                  <h3 className="font-semibold">{listing.title}</h3>
                  <Badge variant={listing.status === 'active' ? 'default' : 'secondary'}>{listing.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{listing.description}</p>
                <div className="flex gap-2">
                  <Badge variant="secondary">{listing.category}</Badge>
                  <Badge variant="outline">{listing.unitPrice} {t('egp')}/unit</Badge>
                  <Badge variant="outline">MOQ: {listing.minimumOrderQuantity}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default B2BMyListings;
