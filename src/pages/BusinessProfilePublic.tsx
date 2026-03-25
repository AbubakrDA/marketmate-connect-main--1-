import { useParams } from 'react-router-dom';
import { getBusinessById, getListingsByBusiness } from '@/data/mock';
import { ListingCard } from '@/components/ListingCard';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Phone, Mail, CheckCircle } from 'lucide-react';
import { StarRating } from '@/components/StarRating';
import { ReviewSection } from '@/components/ReviewSection';

const BusinessProfile = () => {
  const { id } = useParams();
  const business = getBusinessById(id || '');
  const bListings = business ? getListingsByBusiness(business.id) : [];

  if (!business) return <div className="container mx-auto px-4 py-16 text-center text-muted-foreground">Business not found.</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardContent className="flex flex-col items-center gap-4 p-8 sm:flex-row sm:items-start">
          <img src={business.logoUrl} alt={business.name} className="h-24 w-24 rounded-xl" />
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center gap-2 sm:justify-start">
              <h1 className="text-2xl font-bold text-foreground">{business.name}</h1>
              {business.verified && <CheckCircle className="h-5 w-5 text-success" />}
            </div>
            <StarRating rating={business.rating} reviewCount={business.reviewCount} size="md" className="mt-1 justify-center sm:justify-start" />
            <div className="mt-2 flex flex-wrap justify-center gap-2 sm:justify-start">
              <Badge variant="secondary">{business.category}</Badge>
              <Badge variant="outline">{business.subCategory}</Badge>
            </div>
            <p className="mt-3 text-muted-foreground max-w-lg">{business.description}</p>
            <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{business.address}</span>
              <span className="flex items-center gap-1"><Phone className="h-4 w-4" />{business.phone}</span>
              <span className="flex items-center gap-1"><Mail className="h-4 w-4" />{business.email}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <h2 className="mt-8 text-xl font-bold text-foreground">Listings ({bListings.length})</h2>
      <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {bListings.map(l => <ListingCard key={l.id} listing={l} />)}
      </div>

      <ReviewSection businessId={business.id} />
    </div>
  );
};

export default BusinessProfile;
