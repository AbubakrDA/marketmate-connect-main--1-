import { useAuth } from '@/context/AuthContext';
import { getBuyerRequestsByUser, getOffersByRequest } from '@/data/mock';
import { RequestCard } from '@/components/RequestCard';
import { CreateRequestDialog } from '@/components/CreateRequestDialog';
import { WalletBadge } from '@/components/WalletBadge';
import { Badge } from '@/components/ui/badge';

const MyRequests = () => {
  const { user } = useAuth();
  const requests = getBuyerRequestsByUser(user?.id || '');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Requests</h1>
          <p className="text-sm text-muted-foreground">Post what you need — businesses will send you offers</p>
        </div>
        <div className="flex items-center gap-3">
          <WalletBadge />
          <CreateRequestDialog />
        </div>
      </div>
      <div className="space-y-3">
        {requests.length === 0 ? (
          <p className="py-12 text-center text-muted-foreground">No requests yet. Post your first request!</p>
        ) : (
          requests.map(r => {
            const offerCount = getOffersByRequest(r.id).length;
            return (
              <div key={r.id} className="relative">
                <RequestCard request={r} linkTo={`/user/requests/${r.id}`} />
                {offerCount > 0 && (
                  <Badge className="absolute right-4 top-4 bg-coral text-coral-foreground">{offerCount} offer{offerCount > 1 ? 's' : ''}</Badge>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MyRequests;
