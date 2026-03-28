import { useAuth } from '@/context/AuthContext';
import { getRecommendationsByUser, getBuyerRequestsByUser, getOffersByRequest, getWalletByUser } from '@/data/mock';
import { ListingCard } from '@/components/ListingCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lightbulb, FileText, Send, Wallet, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { WalletBadge } from '@/components/WalletBadge';
import { useTranslation } from '@/i18n';
import { useState, useEffect } from 'react';
import { listingService, leadService, requestService, offerService } from '@/lib/api';
import { Listing, Lead } from '@/types';
import { isFeatureEnabled } from '@/lib/feature-flags';


const UserDashboard = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  
  const [myLeads, setMyLeads] = useState<Lead[]>([]);
  const [myRequests, setMyRequests] = useState<any[]>([]);
  const [recommended, setRecommended] = useState<Listing[]>([]);
  const [totalOffers, setTotalOffers] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      try {
        const [listings, leads, requests] = await Promise.all([
          listingService.getAll(),
          leadService.getAll(),
          requestService.getByUser(user.id)
        ]);
        
        setRecommended(listings.slice(0, 3));
        setMyLeads(leads.filter((l: any) => l.buyer_user_id === user?.id || l.user_id === user?.id));
        setMyRequests(requests);
        
        // Fetch offers for each request to get total count
        const allOffers = await Promise.all(requests.map((r: any) => offerService.getByRequest(r.id)));
        const offerCount = allOffers.reduce((sum, offers) => sum + offers.length, 0);
        setTotalOffers(offerCount);
      } catch (error) {
        console.error('Error fetching user dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.id]);

  const recs = getRecommendationsByUser(user?.id || '');

  if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">{t('welcome_user')} {user?.name}</h1>
        <WalletBadge />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card><CardContent className="p-5 text-center"><p className="text-3xl font-bold text-foreground">{myRequests.length}</p><p className="text-sm text-muted-foreground">{t('my_requests')}</p></CardContent></Card>
        <Card><CardContent className="p-5 text-center"><p className="text-3xl font-bold text-foreground">{totalOffers}</p><p className="text-sm text-muted-foreground">{t('offers_received')}</p></CardContent></Card>
        <Card><CardContent className="p-5 text-center"><p className="text-3xl font-bold text-foreground">{myLeads.length}</p><p className="text-sm text-muted-foreground">{t('my_inquiries')}</p></CardContent></Card>
        {isFeatureEnabled('enableAIInsights') && (
          <Card><CardContent className="p-5 text-center"><p className="text-3xl font-bold text-foreground">{recs.length}</p><p className="text-sm text-muted-foreground">{t('recommendations')}</p></CardContent></Card>
        )}

      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Link to="/user/requests">
          <Card className="group transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-coral/10">
                <FileText className="h-6 w-6 text-coral" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{t('post_what_you_need')}</h3>
                <p className="text-sm text-muted-foreground">{t('get_competing_offers')}</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </CardContent>
          </Card>
        </Link>
        <Link to="/user/offers">
          <Card className="group transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-info/10">
                <Send className="h-6 w-6 text-info" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{t('review_offers')}</h3>
                <p className="text-sm text-muted-foreground">{totalOffers} {t('offers_waiting')}</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </CardContent>
          </Card>
        </Link>
      </div>

      {isFeatureEnabled('enableAIInsights') && recs.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">{t('for_you')}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {recs.map(r => (
              <Card key={r.id}><CardContent className="flex gap-3 p-4"><Lightbulb className="h-5 w-5 text-gold mt-0.5" /><div><p className="font-medium text-foreground">{r.title}</p><p className="text-sm text-muted-foreground">{r.description}</p></div></CardContent></Card>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-lg font-semibold text-foreground mb-3">{t('recommended_listings')}</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{recommended.map(l => <ListingCard key={l.id} listing={l} />)}</div>
      </div>
    </div>
  );
};
export default UserDashboard;
