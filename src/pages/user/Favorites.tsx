import { useAuth } from '@/context/AuthContext';
import { getFavoritesByUser, getBusinessById, getListingById, removeFavorite, getSpecialOffersByUser, getBusinessesThatFavoritedUser } from '@/data/mock';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Building2, MapPin, Trash2, Gift, Bell, Star } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { useTranslation } from '@/i18n';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Favorites = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [, refresh] = useState(0);
  const favs = getFavoritesByUser(user?.id || '');
  const specialOffers = getSpecialOffersByUser(user?.id || '');
  const businessesThatFavoritedMe = getBusinessesThatFavoritedUser(user?.id || '');

  const bizFavs = favs.filter(f => f.targetType === 'business');
  const listingFavs = favs.filter(f => f.targetType === 'listing');

  const handleRemove = (targetId: string) => {
    removeFavorite(user!.id, targetId);
    refresh(n => n + 1);
    toast.success(t('removed_from_favorites'));
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Heart className="h-6 w-6 text-coral" />
        <h1 className="text-2xl font-bold text-foreground">{t('favorites')}</h1>
      </div>
      <p className="text-muted-foreground mb-6">{t('favorites_desc')}</p>

      {/* Special offers banner */}
      {specialOffers.length > 0 && (
        <Card className="mb-6 border-gold/30 bg-gold/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Gift className="h-5 w-5 text-gold" />
              <h3 className="font-semibold text-foreground">{t('exclusive_offers_for_you')} ({specialOffers.length})</h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {specialOffers.map(offer => {
                const biz = getBusinessById(offer.businessId);
                return (
                  <div key={offer.id} className="rounded-lg border border-gold/20 bg-background p-3">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="font-medium text-foreground text-sm">{offer.title}</h4>
                      <Badge className="bg-gold/10 text-gold border-gold/20 text-xs">{offer.discountPercent}% off</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{offer.message}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{t('from')}: {biz?.name || t('unknown')}</span>
                      <span>{t('expires')}: {offer.expiresAt}</span>
                    </div>
                    {offer.listingId && (
                      <Button size="sm" variant="outline" className="mt-2 w-full" asChild>
                        <Link to={`/listing/${offer.listingId}`}>{t('view_listing')}</Link>
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Businesses that favorited me */}
      {businessesThatFavoritedMe.length > 0 && (
        <Card className="mb-6 border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Star className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">{t('businesses_following_you')} ({businessesThatFavoritedMe.length})</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {businessesThatFavoritedMe.map(bf => {
                const biz = getBusinessById(bf.businessId);
                if (!biz) return null;
                return (
                  <Badge key={bf.id} variant="secondary" className="px-3 py-1.5">
                    <Building2 className="h-3 w-3 mr-1" />
                    <Link to={`/businesses/${biz.id}`} className="hover:underline">{biz.name}</Link>
                  </Badge>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              <Bell className="inline h-3 w-3 mr-1" />{t('businesses_following_you_desc')}
            </p>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="businesses">
        <TabsList>
          <TabsTrigger value="businesses">{t('businesses')} ({bizFavs.length})</TabsTrigger>
          <TabsTrigger value="listings">{t('listings')} ({listingFavs.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="businesses" className="mt-4">
          {bizFavs.length === 0 ? <p className="text-muted-foreground">{t('no_favorites_yet')}</p> : (
            <div className="grid gap-4 sm:grid-cols-2">
              {bizFavs.map(fav => {
                const biz = getBusinessById(fav.targetId);
                if (!biz) return null;
                const hasOffers = specialOffers.some(o => o.businessId === biz.id);
                return (
                  <Card key={fav.id} className={`transition-all hover:shadow-md ${hasOffers ? 'ring-1 ring-gold/30' : ''}`}>
                    <CardContent className="flex items-start gap-4 p-5">
                      <img src={biz.logoUrl} alt={biz.name} className="h-14 w-14 rounded-lg" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground truncate">{biz.name}</h3>
                          {biz.verified && <Badge variant="secondary" className="text-xs">✓</Badge>}
                          {hasOffers && <Badge className="bg-gold/10 text-gold border-gold/20 text-xs"><Gift className="h-3 w-3 mr-1" />{t('has_offers')}</Badge>}
                        </div>
                        <Badge variant="outline" className="mt-1">{biz.category}</Badge>
                        <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />{biz.area}, {biz.city}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">★ {biz.rating} ({biz.reviewCount} {t('reviews')})</p>
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" variant="outline" asChild>
                            <Link to={`/businesses/${biz.id}`}>{t('view_profile')}</Link>
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleRemove(fav.targetId)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="listings" className="mt-4">
          {listingFavs.length === 0 ? <p className="text-muted-foreground">{t('no_favorites_yet')}</p> : (
            <div className="grid gap-4 sm:grid-cols-2">
              {listingFavs.map(fav => {
                const listing = getListingById(fav.targetId);
                if (!listing) return null;
                return (
                  <Card key={fav.id} className="transition-all hover:shadow-md overflow-hidden">
                    <img src={listing.imageUrl} alt={listing.title} className="w-full h-36 object-cover" />
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary">{listing.category}</Badge>
                        {listing.dealLabel && <Badge className="bg-coral text-coral-foreground text-xs">{listing.dealLabel}</Badge>}
                      </div>
                      <h3 className="font-semibold text-foreground truncate">{listing.title}</h3>
                      <p className="text-lg font-bold text-foreground mt-1">{listing.priceEgp.toLocaleString()} {t('egp')}</p>
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="outline" asChild>
                          <Link to={`/listing/${listing.id}`}>{t('view_details')}</Link>
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleRemove(fav.targetId)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Favorites;