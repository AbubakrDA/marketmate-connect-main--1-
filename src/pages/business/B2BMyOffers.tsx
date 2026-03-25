import { useTranslation } from '@/i18n';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getBusinessByOwner, getB2BOffersBySupplier, getB2BRequestById, getBusinessById } from '@/data/mock';
import { Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const B2BMyOffers = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const biz = getBusinessByOwner(user?.id || '');
  const offers = getB2BOffersBySupplier(biz?.id || '');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><Send className="h-6 w-6 text-primary" />{t('b2b_my_offers')}</h1>
        <p className="text-muted-foreground">{t('b2b_my_offers_desc')}</p>
      </div>

      {offers.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">{t('no_b2b_offers')}</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {offers.map(offer => {
            const req = getB2BRequestById(offer.requestId);
            const requesterBiz = req ? getBusinessById(req.requesterBusinessId) : null;
            return (
              <Card key={offer.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/business/b2b/request/${offer.requestId}`)}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h3 className="font-semibold">{req?.title || 'Unknown Request'}</h3>
                      <p className="text-sm text-muted-foreground">{t('from')}: {requesterBiz?.name || t('unknown')}</p>
                      <p className="text-sm">{offer.message}</p>
                      <div className="flex gap-3 text-sm font-medium">
                        <span className="text-primary">{offer.pricePerUnit} {t('egp')}/unit</span>
                        <span>Total: {offer.totalPrice} {t('egp')}</span>
                      </div>
                    </div>
                    <Badge variant={offer.status === 'accepted' ? 'default' : offer.status === 'rejected' ? 'destructive' : 'secondary'}>
                      {offer.status}
                    </Badge>
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

export default B2BMyOffers;
