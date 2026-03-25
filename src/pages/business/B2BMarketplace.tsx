import { useState } from 'react';
import { useTranslation } from '@/i18n';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getB2BListings, getOpenB2BRequests, getBusinessById, B2BListing, B2BRequest } from '@/data/mock';
import { CATEGORIES, CITIES } from '@/types';
import { Package, Search, ShoppingCart, Factory, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const B2BMarketplace = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');

  const listings = getB2BListings();
  const requests = getOpenB2BRequests();

  const filterItems = <T extends { title: string; category: string; city: string }>(items: T[]) =>
    items.filter(i =>
      (catFilter === 'all' || i.category === catFilter) &&
      (cityFilter === 'all' || i.city === cityFilter) &&
      (!search || i.title.toLowerCase().includes(search.toLowerCase()))
    );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><Factory className="h-6 w-6 text-primary" />{t('b2b_marketplace')}</h1>
        <p className="text-muted-foreground">{t('b2b_marketplace_desc')}</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder={t('search')} className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={catFilter} onValueChange={setCatFilter}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder={t('category')} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('all_categories')}</SelectItem>
            {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={cityFilter} onValueChange={setCityFilter}>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder={t('city')} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('all_cities')}</SelectItem>
            {CITIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="listings">
        <TabsList>
          <TabsTrigger value="listings"><Package className="mr-1 h-4 w-4" />{t('b2b_supplier_listings')} ({filterItems(listings).length})</TabsTrigger>
          <TabsTrigger value="requests"><ShoppingCart className="mr-1 h-4 w-4" />{t('b2b_supply_requests')} ({filterItems(requests).length})</TabsTrigger>
        </TabsList>

        <TabsContent value="listings" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filterItems(listings).map(listing => {
              const biz = getBusinessById(listing.supplierBusinessId);
              return (
                <Card key={listing.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/business/b2b/listing/${listing.id}`)}>
                  {listing.imageUrl && (
                    <div className="h-40 overflow-hidden rounded-t-lg">
                      <img src={listing.imageUrl} alt={listing.title} className="h-full w-full object-cover" />
                    </div>
                  )}
                  <CardContent className="p-4 space-y-2">
                    <h3 className="font-semibold line-clamp-1">{listing.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{listing.description}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary">{listing.category}</Badge>
                      <Badge variant="outline"><MapPin className="mr-1 h-3 w-3" />{listing.city}</Badge>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t">
                      <div>
                        <p className="text-lg font-bold text-primary">{listing.unitPrice} {t('egp')}<span className="text-xs text-muted-foreground">/unit</span></p>
                        <p className="text-xs text-muted-foreground">MOQ: {listing.minimumOrderQuantity}</p>
                      </div>
                      {biz && <p className="text-xs text-muted-foreground">{biz.name}</p>}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            {filterItems(listings).length === 0 && <p className="col-span-full text-center text-muted-foreground py-8">{t('no_b2b_listings')}</p>}
          </div>
        </TabsContent>

        <TabsContent value="requests" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            {filterItems(requests).map(req => {
              const biz = getBusinessById(req.requesterBusinessId);
              return (
                <Card key={req.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/business/b2b/request/${req.id}`)}>
                  <CardContent className="p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold">{req.title}</h3>
                      <Badge>{req.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{req.description}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary">{req.category}</Badge>
                      <Badge variant="outline">Qty: {req.quantity}</Badge>
                      {req.budgetMin && req.budgetMax && (
                        <Badge variant="outline">{req.budgetMin}–{req.budgetMax} {t('egp')}/unit</Badge>
                      )}
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t text-xs text-muted-foreground">
                      {biz && <span>{biz.name}</span>}
                      <span>{req.area}, {req.city}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            {filterItems(requests).length === 0 && <p className="col-span-full text-center text-muted-foreground py-8">{t('no_b2b_requests')}</p>}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default B2BMarketplace;
