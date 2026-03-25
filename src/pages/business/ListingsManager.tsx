import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getBusinessByOwner, getListingsByBusiness } from '@/data/mock';
import { Listing } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/i18n';
import {
  PlusCircle, Pencil, Trash2, Eye, MapPin, DollarSign,
  ChevronRight, Image, ToggleLeft, ToggleRight
} from 'lucide-react';

const ListingsManager = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const biz = getBusinessByOwner(user?.id || '');
  const bListings = biz ? getListingsByBusiness(biz.id) : [];
  const { toast } = useToast();
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const activeCount = bListings.filter(l => l.status === 'active').length;
  const inactiveCount = bListings.filter(l => l.status !== 'active').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('listings')}</h1>
          <p className="text-sm text-muted-foreground">
            {activeCount} {t('active')} · {inactiveCount} {t('inactive')}
          </p>
        </div>
        <Button asChild>
          <Link to="/business/listings/create">
            <PlusCircle className="mr-1 h-4 w-4" /> {t('create_listing')}
          </Link>
        </Button>
      </div>

      {bListings.length === 0 ? (
        <div className="py-12 text-center">
          <Image className="mx-auto h-12 w-12 text-muted-foreground/30 mb-3" />
          <p className="text-muted-foreground">No listings yet. Create your first listing!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bListings.map(listing => (
            <Card
              key={listing.id}
              className="cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5"
              onClick={() => { setSelectedListing(listing); setDetailOpen(true); }}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <img
                    src={listing.imageUrl}
                    alt={listing.title}
                    className="h-16 w-16 rounded-lg object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-foreground">{listing.title}</h3>
                        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                          <Badge variant="secondary" className="text-[10px]">{listing.category}</Badge>
                          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{listing.area}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant={listing.status === 'active' ? 'default' : 'secondary'}>{listing.status}</Badge>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-bold text-foreground">{listing.priceEgp.toLocaleString()} {t('egp')}</span>
                      {listing.oldPriceEgp && (
                        <span className="text-sm text-muted-foreground line-through">{listing.oldPriceEgp.toLocaleString()} {t('egp')}</span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />Listing Details
            </DialogTitle>
          </DialogHeader>
          {selectedListing && (
            <div className="space-y-5">
              <img
                src={selectedListing.imageUrl}
                alt={selectedListing.title}
                className="w-full aspect-video rounded-lg object-cover"
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{selectedListing.category}</Badge>
                  <Badge variant="outline">{selectedListing.subCategory}</Badge>
                </div>
                <Badge variant={selectedListing.status === 'active' ? 'default' : 'secondary'}>
                  {selectedListing.status}
                </Badge>
              </div>

              <h3 className="text-xl font-bold text-foreground">{selectedListing.title}</h3>
              <p className="text-sm text-muted-foreground">{selectedListing.description}</p>

              <div className="rounded-lg bg-muted/50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Price</p>
                    <p className="text-2xl font-bold text-foreground">{selectedListing.priceEgp.toLocaleString()} {t('egp')}</p>
                  </div>
                  {selectedListing.oldPriceEgp && (
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Original</p>
                      <p className="text-lg text-muted-foreground line-through">{selectedListing.oldPriceEgp.toLocaleString()} {t('egp')}</p>
                    </div>
                  )}
                </div>
                {selectedListing.dealLabel && (
                  <Badge className="mt-2 bg-coral text-coral-foreground">{selectedListing.dealLabel}</Badge>
                )}
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />{selectedListing.area}, {selectedListing.city}
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" asChild>
                  <Link to={`/business/listings/edit/${selectedListing.id}`}>
                    <Pencil className="mr-1 h-4 w-4" />{t('edit')}
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    toast({ title: `Listing ${selectedListing.status === 'active' ? 'deactivated' : 'activated'}` });
                  }}
                >
                  {selectedListing.status === 'active'
                    ? <><ToggleLeft className="mr-1 h-4 w-4" />Deactivate</>
                    : <><ToggleRight className="mr-1 h-4 w-4" />Activate</>
                  }
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => {
                    toast({ title: 'Listing deleted (mock)' });
                    setDetailOpen(false);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ListingsManager;
