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
                
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1 border-success text-success hover:bg-success hover:text-success-foreground"
                    onClick={async () => {
                      const phoneNumber = business.phone.replace(/\D/g, '');
                      await leadService.submit({
                        listingId: listing.id,
                        businessId: business.id,
                        lead_type: 'whatsapp'
                      });
                      window.open(`https://wa.me/${phoneNumber}?text=Hi, I am interested in ${listing.title}`, '_blank');
                    }}
                  >
                    <svg className="mr-2 h-4 w-4 fill-current" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    WhatsApp
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={async () => {
                      await leadService.submit({
                        listingId: listing.id,
                        businessId: business.id,
                        lead_type: 'call'
                      });
                      window.location.href = `tel:${business.phone}`;
                    }}
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    Call
                  </Button>
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
