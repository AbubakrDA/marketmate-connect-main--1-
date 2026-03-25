import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getBusinessByOwner, getOpenBuyerRequests, getUserById, getOffersByRequest } from '@/data/mock';
import { BuyerRequest } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { SendOfferDialog } from '@/components/SendOfferDialog';
import { useTranslation } from '@/i18n';
import {
  Inbox, MapPin, Calendar, DollarSign, User, ShoppingBag, Eye,
  ChevronRight, Clock, Send, Star, Filter
} from 'lucide-react';

const BrowseRequests = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const biz = getBusinessByOwner(user?.id || '');
  const allOpen = getOpenBuyerRequests();
  const matching = allOpen.filter(r => r.category === biz?.category);
  const others = allOpen.filter(r => r.category !== biz?.category);
  const [selectedRequest, setSelectedRequest] = useState<BuyerRequest | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const openDetail = (req: BuyerRequest) => {
    setSelectedRequest(req);
    setDetailOpen(true);
  };

  const selectedBuyer = selectedRequest ? getUserById(selectedRequest.userId) : null;
  const selectedOffers = selectedRequest ? getOffersByRequest(selectedRequest.id) : [];
  const alreadySent = selectedRequest ? selectedOffers.some(o => o.businessId === biz?.id) : false;

  const RequestRow = ({ request, isMatching }: { request: BuyerRequest; isMatching: boolean }) => {
    const buyer = getUserById(request.userId);
    const existingOffers = getOffersByRequest(request.id);
    const hasSent = existingOffers.some(o => o.businessId === biz?.id);

    return (
      <Card
        className="cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5"
        onClick={() => openDetail(request)}
      >
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${isMatching ? 'bg-coral/10' : 'bg-muted'}`}>
              <ShoppingBag className={`h-5 w-5 ${isMatching ? 'text-coral' : 'text-muted-foreground'}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{request.title}</h3>
                    {isMatching && <Badge className="bg-coral/10 text-coral border-coral/20 text-[10px]">Match</Badge>}
                    {hasSent && <Badge variant="outline" className="text-[10px]">Offer Sent</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">{request.description}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <Badge variant="secondary">{request.category}</Badge>
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{request.area}, {request.city}</span>
                {(request.minPrice || request.maxPrice) && (
                  <span className="flex items-center gap-1 font-medium text-foreground">
                    <DollarSign className="h-3 w-3" />
                    {request.minPrice?.toLocaleString()} – {request.maxPrice?.toLocaleString()} {t('egp')}
                  </span>
                )}
                {buyer && <span className="flex items-center gap-1"><User className="h-3 w-3" />{buyer.name}</span>}
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{request.createdAt}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('buyer_requests')}</h1>
          <p className="text-sm text-muted-foreground">Browse requests from users looking for services — send your best offer!</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setShowAll(!showAll)}>
          <Filter className="mr-1 h-3.5 w-3.5" />
          {showAll ? 'Show Matching First' : 'Show All'}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card><CardContent className="p-4 text-center">
          <p className="text-3xl font-bold text-foreground">{allOpen.length}</p>
          <p className="text-xs text-muted-foreground">Open Requests</p>
        </CardContent></Card>
        <Card className="border-coral/20"><CardContent className="p-4 text-center">
          <p className="text-3xl font-bold text-coral">{matching.length}</p>
          <p className="text-xs text-muted-foreground">Match Your Category</p>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <p className="text-3xl font-bold text-foreground">{others.length}</p>
          <p className="text-xs text-muted-foreground">Other Categories</p>
        </CardContent></Card>
      </div>

      {showAll ? (
        <div className="space-y-3">
          {allOpen.map(r => <RequestRow key={r.id} request={r} isMatching={r.category === biz?.category} />)}
        </div>
      ) : (
        <>
          {matching.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                <Star className="h-5 w-5 text-coral" />
                Matching Your Category
                <Badge className="bg-coral text-coral-foreground">{matching.length}</Badge>
              </h2>
              <div className="space-y-3">
                {matching.map(r => <RequestRow key={r.id} request={r} isMatching={true} />)}
              </div>
            </div>
          )}
          {others.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-3">Other Requests</h2>
              <div className="space-y-3">
                {others.map(r => <RequestRow key={r.id} request={r} isMatching={false} />)}
              </div>
            </div>
          )}
        </>
      )}

      {allOpen.length === 0 && (
        <div className="py-12 text-center">
          <Inbox className="mx-auto h-12 w-12 text-muted-foreground/30 mb-3" />
          <p className="text-muted-foreground">No open requests right now. Check back soon!</p>
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              Request Details
            </DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">{selectedRequest.category}</Badge>
                  <Badge className="bg-success/10 text-success border-success/20">{selectedRequest.status}</Badge>
                </div>
                <h3 className="font-semibold text-lg text-foreground">{selectedRequest.title}</h3>
                <p className="text-sm text-muted-foreground">{selectedRequest.description}</p>
                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{selectedRequest.area}, {selectedRequest.city}</span>
                  {selectedRequest.dateNeeded && (
                    <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />Needed by {selectedRequest.dateNeeded}</span>
                  )}
                </div>
                {(selectedRequest.minPrice || selectedRequest.maxPrice) && (
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="text-xs text-muted-foreground mb-1">Budget Range</p>
                    <p className="text-lg font-bold text-foreground">
                      {selectedRequest.minPrice?.toLocaleString()} – {selectedRequest.maxPrice?.toLocaleString()} {t('egp')}
                    </p>
                  </div>
                )}
              </div>

              {/* Buyer */}
              {selectedBuyer && (
                <Card className="bg-muted/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <User className="h-4 w-4 text-info" />Buyer
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1 text-sm">
                    <p><span className="text-muted-foreground">Name:</span> <span className="font-medium text-foreground">{selectedBuyer.name}</span></p>
                    <p><span className="text-muted-foreground">Email:</span> <span className="text-foreground">{selectedBuyer.email}</span></p>
                    {selectedBuyer.rating && (
                      <p><span className="text-muted-foreground">Rating:</span> ⭐ {selectedBuyer.rating} ({selectedBuyer.reviewCount} reviews)</p>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Existing Offers */}
              {selectedOffers.length > 0 && (
                <div className="text-sm">
                  <p className="text-muted-foreground mb-1">{selectedOffers.length} offer(s) already sent for this request</p>
                  {alreadySent && <Badge className="bg-info/10 text-info border-info/20">You've already sent an offer</Badge>}
                </div>
              )}

              {/* Send Offer Action */}
              {!alreadySent && selectedRequest.status === 'open' && (
                <SendOfferDialog request={selectedRequest} />
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BrowseRequests;
