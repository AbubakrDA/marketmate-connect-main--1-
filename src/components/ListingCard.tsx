import { Link } from 'react-router-dom';
import { Listing, Business } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';
import { StarRating } from '@/components/StarRating';
import { getBusinessById } from '@/data/mock';
import { useTranslation } from '@/i18n';

interface Props {
  listing: Listing;
  business?: Business;
}

export const ListingCard = ({ listing, business: propsBusiness }: Props) => {
  const { t } = useTranslation();
  const business = propsBusiness || listing.business || getBusinessById(listing.businessId);

  return (
    <Link to={`/listing/${listing.id}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img src={listing.imageUrl} alt={listing.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" loading="lazy" />
          {listing.dealLabel && (
            <Badge className="absolute left-3 top-3 bg-coral text-coral-foreground">{listing.dealLabel}</Badge>
          )}
          <Badge variant="secondary" className="absolute right-3 top-3">{listing.category}</Badge>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-foreground line-clamp-1">{listing.title}</h3>
          {business && (
            <StarRating rating={business.rating} reviewCount={business.reviewCount} size="sm" className="mt-1" />
          )}
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{listing.description}</p>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="text-lg font-bold text-foreground">{listing.priceEgp.toLocaleString()} {t('egp')}</span>
              {listing.oldPriceEgp && (
                <span className="text-sm text-muted-foreground line-through">{listing.oldPriceEgp.toLocaleString()}</span>
              )}
            </div>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />{listing.area}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
