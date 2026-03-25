import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getBusinessByOwner, getOffersByBusiness, getBuyerRequestById, getUserById } from '@/data/mock';
import { Offer, BuyerRequest } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from '@/i18n';
import {
  Building2, DollarSign, MapPin, Calendar, Clock, User, FileText,
  Send, CheckCircle, XCircle, AlertCircle, Eye, MessageSquare, ChevronRight
} from 'lucide-react';

const statusConfig: Record<string, { color: string; icon: any; label: string }> = {
  pending: { color: 'bg-gold/10 text-gold border-gold/20', icon: AlertCircle, label: 'Pending' },
  accepted: { color: 'bg-success/10 text-success border-success/20', icon: CheckCircle, label: 'Accepted' },
  rejected: { color: 'bg-destructive/10 text-destructive border-destructive/20', icon: XCircle, label: 'Rejected' },
};

const BusinessOffers = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const biz = getBusinessByOwner(user?.id || '');
  const bizOffers = biz ? getOffersByBusiness(biz.id) : [];
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredOffers = filterStatus === 'all'
    ? bizOffers
    : bizOffers.filter(o => o.status === filterStatus);

  const stats = {
    total: bizOffers.length,
    pending: bizOffers.filter(o => o.status === 'pending').length,
    accepted: bizOffers.filter(o => o.status === 'accepted').length,
    rejected: bizOffers.filter(o => o.status === 'rejected').length,
  };

  const openDetail = (offer: Offer) => {
    setSelectedOffer(offer);
    setDetailOpen(true);
  };

  const selectedRequest = selectedOffer ? getBuyerRequestById(selectedOffer.requestId) : null;
  const selectedBuyer = selectedRequest ? getUserById(selectedRequest.userId) : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t('offers_sent')}</h1>
        <p className="text-sm text-muted-foreground">Track and manage all offers you've sent to buyers</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4 text-center">
          <p className="text-3xl font-bold text-foreground">{stats.total}</p>
          <p className="text-xs text-muted-foreground">Total Offers</p>
        </CardContent></Card>
        <Card className="border-gold/20"><CardContent className="p-4 text-center">
          <p className="text-3xl font-bold text-gold">{stats.pending}</p>
          <p className="text-xs text-muted-foreground">Pending</p>
        </CardContent></Card>
        <Card className="border-success/20"><CardContent className="p-4 text-center">
          <p className="text-3xl font-bold text-success">{stats.accepted}</p>
          <p className="text-xs text-muted-foreground">Accepted</p>
        </CardContent></Card>
        <Card className="border-destructive/20"><CardContent className="p-4 text-center">
          <p className="text-3xl font-bold text-destructive">{stats.rejected}</p>
          <p className="text-xs text-muted-foreground">Rejected</p>
        </CardContent></Card>
      </div>

      {/* Filter Tabs */}
      <Tabs value={filterStatus} onValueChange={setFilterStatus}>
        <TabsList>
          <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
          <TabsTrigger value="accepted">Accepted ({stats.accepted})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({stats.rejected})</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Offers List */}
      {filteredOffers.length === 0 ? (
        <div className="py-12 text-center">
          <Send className="mx-auto h-12 w-12 text-muted-foreground/30 mb-3" />
          <p className="text-muted-foreground">No offers found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOffers.map(offer => {
            const req = getBuyerRequestById(offer.requestId);
            const buyer = req ? getUserById(req.userId) : null;
            const config = statusConfig[offer.status];
            const StatusIcon = config.icon;

            return (
              <Card
                key={offer.id}
                className="cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5"
                onClick={() => openDetail(offer)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${offer.status === 'pending' ? 'bg-gold/10' : offer.status === 'accepted' ? 'bg-success/10' : 'bg-destructive/10'}`}>
                      <StatusIcon className={`h-5 w-5 ${offer.status === 'pending' ? 'text-gold' : offer.status === 'accepted' ? 'text-success' : 'text-destructive'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-foreground">{offer.offerTitle}</h3>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            In response to: <span className="text-foreground font-medium">{req?.title || 'Unknown Request'}</span>
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge className={config.color}>{config.label}</Badge>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{offer.offerMessage}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1 font-semibold text-foreground text-sm">
                          <DollarSign className="h-3.5 w-3.5" />
                          {offer.offerPrice.toLocaleString()} {t('egp')}
                        </span>
                        {buyer && (
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />{buyer.name}
                          </span>
                        )}
                        {req && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />{req.area}, {req.city}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />{offer.createdAt}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              Offer Details
            </DialogTitle>
          </DialogHeader>
          {selectedOffer && (
            <div className="space-y-5">
              {/* Offer Info */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg text-foreground">{selectedOffer.offerTitle}</h3>
                  <Badge className={statusConfig[selectedOffer.status].color}>
                    {statusConfig[selectedOffer.status].label}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{selectedOffer.offerMessage}</p>
                <div className="flex items-center gap-2 text-lg font-bold text-foreground">
                  <DollarSign className="h-5 w-5" />
                  {selectedOffer.offerPrice.toLocaleString()} {t('egp')}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  Sent on {selectedOffer.createdAt}
                </div>
                {selectedOffer.listingReference && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <FileText className="h-3 w-3" />
                    Listing Reference: {selectedOffer.listingReference}
                  </div>
                )}
              </div>

              {/* Original Request */}
              {selectedRequest && (
                <Card className="bg-muted/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <FileText className="h-4 w-4 text-coral" />
                      Original Buyer Request
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <h4 className="font-semibold text-foreground">{selectedRequest.title}</h4>
                    <p className="text-sm text-muted-foreground">{selectedRequest.description}</p>
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <Badge variant="secondary">{selectedRequest.category}</Badge>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />{selectedRequest.area}, {selectedRequest.city}
                      </span>
                      {(selectedRequest.minPrice || selectedRequest.maxPrice) && (
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          {selectedRequest.minPrice?.toLocaleString()} – {selectedRequest.maxPrice?.toLocaleString()} {t('egp')}
                        </span>
                      )}
                      {selectedRequest.dateNeeded && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />Needed by {selectedRequest.dateNeeded}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Buyer Info */}
              {selectedBuyer && (
                <Card className="bg-muted/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <User className="h-4 w-4 text-info" />
                      Buyer Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1.5 text-sm">
                    <p><span className="text-muted-foreground">Name:</span> <span className="font-medium text-foreground">{selectedBuyer.name}</span></p>
                    <p><span className="text-muted-foreground">Email:</span> <span className="text-foreground">{selectedBuyer.email}</span></p>
                    <p><span className="text-muted-foreground">Phone:</span> <span className="text-foreground">{selectedBuyer.phone}</span></p>
                    {selectedBuyer.rating && (
                      <p><span className="text-muted-foreground">Rating:</span> <span className="text-foreground">⭐ {selectedBuyer.rating}</span></p>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Actions */}
              {selectedOffer.status === 'accepted' && (
                <Button className="w-full" variant="outline">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Open Chat with Buyer
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BusinessOffers;
