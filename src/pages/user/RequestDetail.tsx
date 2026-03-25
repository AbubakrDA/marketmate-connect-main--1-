import { useParams, useNavigate } from 'react-router-dom';
import { getBuyerRequestById, getOffersByRequest } from '@/data/mock';
import { RequestCard } from '@/components/RequestCard';
import { OfferCard } from '@/components/OfferCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const RequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const request = getBuyerRequestById(id || '');
  const requestOffers = getOffersByRequest(id || '');

  if (!request) {
    return <p className="py-12 text-center text-muted-foreground">Request not found.</p>;
  }

  const handleAccept = (offerId: string) => {
    toast({ title: 'Offer Accepted!', description: 'A conversation has been started with the business.' });
  };

  const handleReject = (offerId: string) => {
    toast({ title: 'Offer Rejected', description: 'The business has been notified.' });
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => navigate('/user/requests')}>
        <ArrowLeft className="mr-1 h-4 w-4" />Back to Requests
      </Button>
      <RequestCard request={request} />
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-3">
          Offers Received ({requestOffers.length})
        </h2>
        {requestOffers.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">No offers yet. Businesses are reviewing your request.</p>
        ) : (
          <div className="space-y-3">
            {requestOffers.map(o => (
              <OfferCard key={o.id} offer={o} showActions onAccept={handleAccept} onReject={handleReject} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestDetail;
