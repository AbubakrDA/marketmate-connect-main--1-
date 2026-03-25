import { Offer } from '@/types';
import { getBusinessById } from '@/data/mock';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, DollarSign, Check, X } from 'lucide-react';

interface Props {
  offer: Offer;
  showActions?: boolean;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
}

const statusColors: Record<string, string> = {
  pending: 'bg-gold/10 text-gold border-gold/20',
  accepted: 'bg-success/10 text-success border-success/20',
  rejected: 'bg-destructive/10 text-destructive border-destructive/20',
};

export const OfferCard = ({ offer, showActions, onAccept, onReject }: Props) => {
  const biz = getBusinessById(offer.businessId);

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground">{offer.offerTitle}</h3>
            <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="h-3.5 w-3.5" />
              <span>{biz?.name || 'Business'}</span>
            </div>
          </div>
          <Badge className={statusColors[offer.status]}>{offer.status}</Badge>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{offer.offerMessage}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="flex items-center gap-1 text-lg font-bold text-foreground">
            <DollarSign className="h-4 w-4" />
            {offer.offerPrice.toLocaleString()} EGP
          </span>
          {showActions && offer.status === 'pending' && (
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => onReject?.(offer.id)}>
                <X className="mr-1 h-3.5 w-3.5" />Reject
              </Button>
              <Button size="sm" className="bg-success text-success-foreground hover:bg-success/90" onClick={() => onAccept?.(offer.id)}>
                <Check className="mr-1 h-3.5 w-3.5" />Accept
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
