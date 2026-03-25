import { useState } from 'react';
import { BuyerRequest } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Send, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { getBusinessByOwner, canBusinessSendOffer, addOffer } from '@/data/mock';

interface Props {
  request: BuyerRequest;
}

export const SendOfferDialog = ({ request }: Props) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const biz = getBusinessByOwner(user?.id || '');
  const check = canBusinessSendOffer(biz?.id || '');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const recheck = canBusinessSendOffer(biz?.id || '');
    if (!recheck.allowed) {
      toast({ title: 'Cannot send offer', description: recheck.reason, variant: 'destructive' });
      return;
    }
    const fd = new FormData(e.currentTarget);
    addOffer({
      id: `of${Date.now()}`,
      requestId: request.id,
      businessId: biz?.id || '',
      offerTitle: fd.get('offerTitle') as string,
      offerMessage: fd.get('offerMessage') as string,
      offerPrice: Number(fd.get('offerPrice')),
      listingReference: (fd.get('listingRef') as string) || undefined,
      status: 'pending',
      createdAt: new Date().toISOString(),
    });
    toast({ title: 'Offer Sent!', description: `Your offer has been sent to the user for "${request.title}".` });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><Send className="mr-1 h-3.5 w-3.5" />Send Offer</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Offer for: {request.title}</DialogTitle>
        </DialogHeader>

        {!check.allowed ? (
          <div className="space-y-4 py-6 text-center">
            <Lock className="mx-auto h-12 w-12 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">{check.reason}</p>
            <Button onClick={() => setOpen(false)}>Close</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Offer Title</Label>
              <Input name="offerTitle" required placeholder="e.g. Premium Apartment Available" />
            </div>
            <div>
              <Label>Message</Label>
              <Textarea name="offerMessage" required placeholder="Describe your offer in detail..." rows={4} />
            </div>
            <div>
              <Label>Offer Price (EGP)</Label>
              <Input name="offerPrice" type="number" required placeholder="0" />
            </div>
            <div>
              <Label>Listing Reference (optional)</Label>
              <Input name="listingRef" placeholder="Listing ID if applicable" />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit">Send Offer</Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
