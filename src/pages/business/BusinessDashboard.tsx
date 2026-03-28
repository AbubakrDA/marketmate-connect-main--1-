import { useAuth } from '@/context/AuthContext';
import { getAdsByBusiness, getOffersByBusiness, getOpenBuyerRequests } from '@/data/mock';
import { StatsCard } from '@/components/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { List, Inbox, TrendingUp, Megaphone, ShoppingBag, Send, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';
import { useTranslation } from '@/i18n';
import { useState, useEffect } from 'react';
import { businessService, listingService, leadService, dashboardService } from '@/lib/api';
import { Business, Listing, Lead } from '@/types';

const BusinessDashboard = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  
  const [biz, setBiz] = useState<Business | null>(null);
  const [bListings, setBListings] = useState<Listing[]>([]);
  const [bLeads, setBLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      try {
        const business = await businessService.getByOwner(user.id);
        setBiz(business);
        
        const [listings, leads, bizStats] = await Promise.all([
          listingService.getByBusiness(business.id),
          leadService.getByBusiness(business.id),
          dashboardService.getBusinessStats(business.id)
        ]);
        setBListings(listings);
        setBLeads(leads);
        setStats(bizStats);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.id]);

  // Keep some mock defaults for features not yet fully implemented in backend endpoints
  const bAds = biz ? getAdsByBusiness(biz.id) : [];
  const bOffers = stats ? { length: stats.counts.offers } : { length: 0 };
  const matchingRequests = biz ? getOpenBuyerRequests().filter(r => r.category === biz.category) : [];
  const won = bLeads.filter(l => l.status === 'won').length;
  const convRate = bLeads.length > 0 ? Math.round((won / bLeads.length) * 100) : 0;

  const chartData = stats ? [
    { name: t('new'), value: stats.leads.new },
    { name: t('contacted'), value: stats.leads.contacted },
    { name: t('closed'), value: stats.leads.closed },
  ] : [];

  if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">{t('business_dashboard')}</h1>
      {biz ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard title={t('listings')} value={bListings.length} icon={List} />
            <StatsCard title={t('total_leads')} value={stats?.leads?.total || bLeads.length} icon={Inbox} />
            <StatsCard 
              title={t('leads_remaining')} 
              value={stats?.subscription?.leads_remaining ?? 'N/A'} 
              icon={ShoppingBag} 
              description={stats?.subscription?.plan ? `${stats.subscription.plan} plan` : undefined}
            />
            <StatsCard title={t('conversion')} value={`${convRate}%`} icon={TrendingUp} />
          </div>

          {matchingRequests.length > 0 && (
            <Link to="/business/requests">
              <Card className="border-coral/30 bg-coral/5 transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-coral/10">
                    <ShoppingBag className="h-6 w-6 text-coral" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">
                      {matchingRequests.length} {t('buyer_requests_matching')}
                    </h3>
                    <p className="text-sm text-muted-foreground">{t('send_them_offer')}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-coral" />
                </CardContent>
              </Card>
            </Link>
          )}

          <Card><CardHeader><CardTitle>{t('leads_breakdown')}</CardTitle></CardHeader><CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="value" fill="hsl(222 47% 11%)" radius={[4,4,0,0]} /></BarChart>
            </ResponsiveContainer>
          </CardContent></Card>
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-3">{t('recent_leads')}</h2>
            <div className="space-y-2">
              {bLeads.slice(0, 5).map(l => (
                <Card key={l.id}><CardContent className="flex items-center justify-between p-4">
                  <div><p className="font-medium text-foreground">{l.name}</p><p className="text-sm text-muted-foreground truncate max-w-xs">{l.message || 'No message'}</p></div>
                  <Badge variant="secondary">{l.status}</Badge>
                </CardContent></Card>
              ))}
            </div>
          </div>
        </>
      ) : <p className="text-muted-foreground">{t('no_business_profile')}</p>}
    </div>
  );
};
export default BusinessDashboard;
