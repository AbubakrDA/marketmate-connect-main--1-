import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getBuyerRequestsByUser, getOffersByRequest, acceptOffer, rejectOffer } from '@/data/mock';
import { OfferCard } from '@/components/OfferCard';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const MyOffers = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [, setRefresh] = useState(0);
  const requests = getBuyerRequestsByUser(user?.id || '');
  const allOffers = requests.flatMap(r => getOffersByRequest(r.id).map(o => ({ ...o, requestTitle: r.title })));

  const handleAccept = (offerId: string) => {
    const convo = acceptOffer(offerId, user?.id || '');
    setRefresh(r => r + 1);
    if (convo) {
      toast({ title: 'Offer Accepted!', description: 'Conversation started. Go to Messages to chat.' });
      navigate('/user/chat');
    }
  };

  const handleReject = (offerId: string) => {
    rejectOffer(offerId);
    setRefresh(r => r + 1);
    toast({ title: 'Offer Rejected' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Offers</h1>
        <p className="text-sm text-muted-foreground">All offers received across your requests</p>
      </div>
      {allOffers.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">No offers received yet.</p>
      ) : (
        <div className="space-y-3">
          {allOffers.map(o => (
            <div key={o.id}>
              <p className="mb-1.5 text-xs text-muted-foreground">
                For: <Badge variant="outline" className="ml-1">{o.requestTitle}</Badge>
              </p>
              <OfferCard
                offer={o}
                showActions
                onAccept={handleAccept}
                onReject={handleReject}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOffers;
