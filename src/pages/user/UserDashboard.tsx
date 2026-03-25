import { useAuth } from '@/context/AuthContext';
import { getRecommendationsByUser, getLeadsByUser, listings, getBuyerRequestsByUser, getOffersByRequest, getWalletByUser } from '@/data/mock';
import { ListingCard } from '@/components/ListingCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lightbulb, FileText, Send, Wallet, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { WalletBadge } from '@/components/WalletBadge';
import { useTranslation } from '@/i18n';

const UserDashboard = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const recs = getRecommendationsByUser(user?.id || '');
  const myLeads = getLeadsByUser(user?.id || '');
  const requests = getBuyerRequestsByUser(user?.id || '');
  const totalOffers = requests.reduce((sum, r) => sum + getOffersByRequest(r.id).length, 0);
  const wallet = getWalletByUser(user?.id || '');
  const recommended = listings.filter(l => l.status === 'active').slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">{t('welcome_user')} {user?.name}</h1>
        <WalletBadge />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card><CardContent className="p-5 text-center"><p className="text-3xl font-bold text-foreground">{requests.length}</p><p className="text-sm text-muted-foreground">{t('my_requests')}</p></CardContent></Card>
        <Card><CardContent className="p-5 text-center"><p className="text-3xl font-bold text-foreground">{totalOffers}</p><p className="text-sm text-muted-foreground">{t('offers_received')}</p></CardContent></Card>
        <Card><CardContent className="p-5 text-center"><p className="text-3xl font-bold text-foreground">{myLeads.length}</p><p className="text-sm text-muted-foreground">{t('my_inquiries')}</p></CardContent></Card>
        <Card><CardContent className="p-5 text-center"><p className="text-3xl font-bold text-foreground">{recs.length}</p><p className="text-sm text-muted-foreground">{t('recommendations')}</p></CardContent></Card>
      </div>

      {/* Quick Actions */}
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

      {recs.length > 0 && (
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
