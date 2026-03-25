import { Link, useNavigate } from 'react-router-dom';
import { getActiveSaleCampaigns, getOpenBuyerRequests } from '@/data/mock';
import { ListingCard } from '@/components/ListingCard';
import { SaleCampaignCard } from '@/components/SaleCampaignCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Stethoscope, Building, Shirt, ArrowRight, Users, Store, TrendingUp, Megaphone, FileText } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/i18n';
import { listingService, businessService } from '@/lib/api';
import { Listing, Business } from '@/types';

const Home = () => {
  const [search, setSearch] = useState('');
  const [featured, setFeatured] = useState<Listing[]>([]);
  const [businessesCount, setBusinessesCount] = useState(0);
  const [listingsCount, setListingsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lData, bData] = await Promise.all([
          listingService.getAll(),
          businessService.getAll()
        ]);
        setFeatured(lData.slice(0, 6));
        setListingsCount(lData.length);
        setBusinessesCount(bData.length);
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const sales = getActiveSaleCampaigns().slice(0, 3);
  const openRequests = getOpenBuyerRequests().length;

  const categories = [
    { name: t('clinics'), key: 'Clinics', icon: Stethoscope, color: 'bg-info/10 text-info', count: featured.filter(l => l.category === 'Clinics').length },
    { name: t('real_estate'), key: 'Real Estate', icon: Building, color: 'bg-success/10 text-success', count: featured.filter(l => l.category === 'Real Estate').length },
    { name: t('fashion'), key: 'Fashion', icon: Shirt, color: 'bg-coral/10 text-coral', count: featured.filter(l => l.category === 'Fashion').length },
  ];

  const stats = [
    { label: t('businesses_stat'), value: businessesCount, icon: Store },
    { label: t('listings_stat'), value: listingsCount, icon: TrendingUp },
    { label: t('happy_users'), value: '500+', icon: Users },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/marketplace?search=${encodeURIComponent(search)}`);
  };

  return (
    <div>
      {/* Hero */}
      <section className="gradient-hero py-20 md:py-28">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mx-auto max-w-3xl text-3xl font-extrabold text-primary-foreground md:text-5xl lg:text-6xl animate-fade-in">
            {t('hero_title')}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/80 md:text-xl">
            {t('hero_subtitle')}
          </p>
          <form onSubmit={handleSearch} className="mx-auto mt-8 flex max-w-lg gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={t('search_placeholder')}
                className="h-12 pl-10 bg-background/95 text-foreground"
              />
            </div>
            <Button type="submit" className="h-12 bg-coral text-coral-foreground hover:bg-coral/90 px-6">{t('search')}</Button>
          </form>
        </div>
      </section>

      {/* Post What You Need CTA */}
      <section className="border-b bg-coral/5 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
            <div className="text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                <Megaphone className="h-6 w-6 text-coral" />
                <h2 className="text-2xl font-bold text-foreground">{t('post_what_you_need')}</h2>
              </div>
              <p className="text-muted-foreground max-w-lg">{t('post_request_desc')}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                <Badge variant="secondary" className="mr-1">{openRequests}</Badge> {t('active_requests_count')}
              </p>
            </div>
            <div className="flex gap-3">
              {isAuthenticated && user?.role === 'user' ? (
                <Button className="bg-coral text-coral-foreground hover:bg-coral/90" size="lg" onClick={() => navigate('/user/requests')}>
                  <FileText className="mr-2 h-4 w-4" />{t('post_request')}
                </Button>
              ) : (
                <Button className="bg-coral text-coral-foreground hover:bg-coral/90" size="lg" onClick={() => navigate('/register')}>
                  {t('get_started')} <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b bg-card py-8">
        <div className="container mx-auto grid grid-cols-3 gap-4 px-4 text-center">
          {stats.map(s => (
            <div key={s.label} className="animate-fade-in">
              <s.icon className="mx-auto mb-2 h-6 w-6 text-coral" />
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-foreground md:text-3xl">{t('browse_categories')}</h2>
          <p className="mt-2 text-muted-foreground">{t('find_what_you_need')}</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {categories.map(cat => (
              <Link key={cat.key} to={`/marketplace?category=${encodeURIComponent(cat.key)}`}
                className="group flex items-center gap-4 rounded-xl border bg-card p-6 transition-all hover:shadow-lg hover:-translate-y-1">
                <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${cat.color}`}>
                  <cat.icon className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{cat.name}</h3>
                  <p className="text-sm text-muted-foreground">{cat.count} {t('listings_count')}</p>
                </div>
                <ArrowRight className="ml-auto h-5 w-5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Seasonal Sales */}
      {sales.length > 0 && (
        <section className="bg-muted/50 py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground md:text-3xl">{t('seasonal_sales_title')}</h2>
                <p className="mt-2 text-muted-foreground">{t('seasonal_sales_desc')}</p>
              </div>
              <Button variant="outline" asChild><Link to="/seasonal-sales">{t('view_all')} <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sales.map(s => <SaleCampaignCard key={s.id} campaign={s} />)}
            </div>
          </div>
        </section>
      )}

      {/* Featured */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground md:text-3xl">{t('featured_listings')}</h2>
              <p className="mt-2 text-muted-foreground">{t('top_deals')}</p>
            </div>
            <Button variant="outline" asChild><Link to="/marketplace">{t('view_all')} <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              <p>Loading featured deals...</p>
            ) : (
              featured.map(l => <ListingCard key={l.id} listing={l} />)
            )}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-foreground md:text-3xl">{t('how_it_works')}</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-4">
            {[
              { step: '1', title: t('step_1_title'), desc: t('step_1_desc') },
              { step: '2', title: t('step_2_title'), desc: t('step_2_desc') },
              { step: '3', title: t('step_3_title'), desc: t('step_3_desc') },
              { step: '4', title: t('step_4_title'), desc: t('step_4_desc') },
            ].map(item => (
              <div key={item.step} className="animate-fade-in">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-coral text-coral-foreground text-xl font-bold">{item.step}</div>
                <h3 className="font-semibold text-foreground text-lg">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-primary-foreground md:text-3xl">{t('business_owner_cta')}</h2>
          <p className="mx-auto mt-3 max-w-lg text-primary-foreground/80">{t('business_owner_desc')}</p>
          <Button asChild className="mt-6 bg-coral text-coral-foreground hover:bg-coral/90" size="lg">
            <Link to="/register/business">{t('register_business')} <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
