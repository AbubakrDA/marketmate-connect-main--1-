import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from '@/i18n';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { getB2BRequestById, getB2BOffersByRequest, getBusinessById, getBusinessByOwner, addB2BOffer, acceptB2BOffer, canBusinessPostB2B } from '@/data/mock';
import { ArrowLeft, Send, Check, X, Package, MapPin, Lock } from 'lucide-react';

const B2BRequestDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [offerOpen, setOfferOpen] = useState(false);
  const [, forceUpdate] = useState(0);

  const request = getB2BRequestById(id || '');
  const offers = getB2BOffersByRequest(id || '');
  const myBiz = getBusinessByOwner(user?.id || '');
  const requesterBiz = request ? getBusinessById(request.requesterBusinessId) : null;
  const isOwner = myBiz?.id === request?.requesterBusinessId;
  const check = canBusinessPostB2B(myBiz?.id || '');

  if (!request) return <div className="p-8 text-center text-muted-foreground">Request not found</div>;

  const handleSendOffer = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!check.allowed) { toast({ title: 'Error', description: check.reason, variant: 'destructive' }); return; }
    const fd = new FormData(e.currentTarget);
    addB2BOffer({
      id: `b2bo${Date.now()}`,
      requestId: request.id,
      supplierBusinessId: myBiz?.id || '',
      message: fd.get('message') as string,
      pricePerUnit: Number(fd.get('pricePerUnit')),
      minimumOrderQuantity: Number(fd.get('moq')),
      totalPrice: Number(fd.get('pricePerUnit')) * request.quantity,
      status: 'pending',
      createdAt: new Date().toISOString(),
    });
    toast({ title: t('b2b_offer_sent'), description: `Offer sent for "${request.title}"` });
    setOfferOpen(false);
    forceUpdate(n => n + 1);
  };

  const handleAccept = (offerId: string) => {
    acceptB2BOffer(offerId);
    toast({ title: t('b2b_offer_accepted') });
    forceUpdate(n => n + 1);
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => navigate(-1)}><ArrowLeft className="mr-1 h-4 w-4" />{t('cancel')}</Button>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2"><Package className="h-5 w-5" />{request.title}</CardTitle>
              {requesterBiz && <p className="text-sm text-muted-foreground mt-1">{t('from')}: {requesterBiz.name}</p>}
            </div>
            <Badge>{request.status}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>{request.description}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div><p className="text-xs text-muted-foreground">{t('category')}</p><p className="font-medium">{request.category}</p></div>
            <div><p className="text-xs text-muted-foreground">Quantity</p><p className="font-medium">{request.quantity}</p></div>
            <div><p className="text-xs text-muted-foreground">Budget/unit</p><p className="font-medium">{request.budgetMin}–{request.budgetMax} {t('egp')}</p></div>
            <div><p className="text-xs text-muted-foreground"><MapPin className="inline h-3 w-3" /> Location</p><p className="font-medium">{request.area}, {request.city}</p></div>
          </div>

          {!isOwner && request.status === 'open' && (
            <Dialog open={offerOpen} onOpenChange={setOfferOpen}>
              <DialogTrigger asChild>
                <Button><Send className="mr-1 h-4 w-4" />{t('b2b_send_offer')}</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>{t('b2b_send_offer')}</DialogTitle></DialogHeader>
                {!check.allowed ? (
                  <div className="text-center py-6 space-y-3">
                    <Lock className="mx-auto h-12 w-12 text-muted-foreground/40" />
                    <p className="text-sm text-muted-foreground">{check.reason}</p>
                    <Button onClick={() => setOfferOpen(false)}>{t('cancel')}</Button>
                  </div>
                ) : (
                  <form onSubmit={handleSendOffer} className="space-y-4">
                    <div><Label>Message</Label><Textarea name="message" required rows={3} placeholder="Describe your supply capability..." /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><Label>Price per Unit ({t('egp')})</Label><Input name="pricePerUnit" type="number" required /></div>
                      <div><Label>Min Order Qty</Label><Input name="moq" type="number" required /></div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setOfferOpen(false)}>{t('cancel')}</Button>
                      <Button type="submit">{t('submit')}</Button>
                    </div>
                  </form>
                )}
              </DialogContent>
            </Dialog>
          )}
        </CardContent>
      </Card>

      {/* Offers */}
      <div>
        <h2 className="text-lg font-semibold mb-3">{t('b2b_supplier_offers')} ({offers.length})</h2>
        {offers.length === 0 ? (
          <p className="text-muted-foreground text-sm">{t('no_b2b_offers')}</p>
        ) : (
          <div className="space-y-3">
            {offers.map(offer => {
              const supplierBiz = getBusinessById(offer.supplierBusinessId);
              return (
                <Card key={offer.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <p className="font-medium">{supplierBiz?.name || 'Unknown Supplier'}</p>
                        <p className="text-sm text-muted-foreground">{offer.message}</p>
                        <div className="flex gap-3 text-sm">
                          <span className="font-semibold text-primary">{offer.pricePerUnit} {t('egp')}/unit</span>
                          <span>MOQ: {offer.minimumOrderQuantity}</span>
                          <span>Total: {offer.totalPrice} {t('egp')}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={offer.status === 'accepted' ? 'default' : offer.status === 'rejected' ? 'destructive' : 'secondary'}>
                          {offer.status}
                        </Badge>
                        {isOwner && offer.status === 'pending' && (
                          <Button size="sm" onClick={() => handleAccept(offer.id)}><Check className="mr-1 h-3 w-3" />Accept</Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default B2BRequestDetail;
