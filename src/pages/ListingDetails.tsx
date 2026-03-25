import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { LeadForm } from '@/components/LeadForm';
import { ListingCard } from '@/components/ListingCard';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Phone, Mail, CheckCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/i18n';
import { listingService, businessService } from '@/lib/api';
import { Listing, Business } from '@/types';

const ListingDetails = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [listing, setListing] = useState<Listing | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [similar, setSimilar] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const lData = await listingService.getById(id);
        setListing(lData);
        
        const [bData, allListings] = await Promise.all([
          businessService.getById(lData.businessId),
          listingService.getAll()
        ]);
        setBusiness(bData);
        setSimilar(allListings.filter((l: Listing) => l.category === lData.category && l.id !== lData.id && l.status === 'active').slice(0, 3));
      } catch (error) {
        console.error('Error fetching listing details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="container mx-auto px-4 py-16 text-center">Loading details...</div>;
  if (!listing) return <div className="container mx-auto px-4 py-16 text-center text-muted-foreground">{t('listing_not_found')}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" asChild className="mb-4"><Link to="/marketplace"><ArrowLeft className="mr-1 h-4 w-4" /> {t('back_to_marketplace')}</Link></Button>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="relative overflow-hidden rounded-xl">
            <img src={listing.imageUrl} alt={listing.title} className="w-full aspect-video object-cover" />
            {listing.dealLabel && <Badge className="absolute left-4 top-4 bg-coral text-coral-foreground text-sm px-3 py-1">{listing.dealLabel}</Badge>}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge variant="secondary">{listing.category}</Badge>
              <Badge variant="outline">{listing.subCategory}</Badge>
              <span className="flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="h-3 w-3" />{listing.area}, {listing.city}</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground md:text-3xl">{listing.title}</h1>
            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-foreground">{listing.priceEgp.toLocaleString()} {t('egp')}</span>
              {listing.oldPriceEgp && <span className="text-lg text-muted-foreground line-through">{listing.oldPriceEgp.toLocaleString()} {t('egp')}</span>}
            </div>
            <p className="mt-4 text-muted-foreground leading-relaxed">{listing.description}</p>
          </div>
        </div>

        <div className="space-y-6">
          {business && (
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <img src={business.logoUrl} alt={business.name} className="h-12 w-12 rounded-lg" />
                  <div>
                    <div className="flex items-center gap-1">
                      <h3 className="font-semibold text-foreground">{business.name}</h3>
                      {business.verified && <CheckCircle className="h-4 w-4 text-success" />}
                    </div>
                    <p className="text-sm text-muted-foreground">{business.category}</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2"><Phone className="h-4 w-4" />{business.phone}</p>
                  <p className="flex items-center gap-2"><Mail className="h-4 w-4" />{business.email}</p>
                  <p className="flex items-center gap-2"><MapPin className="h-4 w-4" />{business.address}</p>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader><CardTitle className="text-lg">{t('send_inquiry')}</CardTitle></CardHeader>
            <CardContent>
              <LeadForm listingId={listing.id} businessId={listing.businessId} />
            </CardContent>
          </Card>
        </div>
      </div>

      {similar.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-foreground mb-4">{t('similar_listings')}</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{similar.map(l => <ListingCard key={l.id} listing={l} />)}</div>
        </div>
      )}
    </div>
  );
};

export default ListingDetails;
