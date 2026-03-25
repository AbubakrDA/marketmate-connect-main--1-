import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { listings } from '@/data/mock';
import { ListingCard } from '@/components/ListingCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CATEGORIES, AREAS } from '@/types';
import { Search } from 'lucide-react';
import { useTranslation } from '@/i18n';

const Marketplace = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const initialCat = searchParams.get('category') || '';
  const initialSearch = searchParams.get('search') || '';

  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCat);
  const [area, setArea] = useState('');
  const [sort, setSort] = useState('newest');

  const filtered = useMemo(() => {
    let result = listings.filter(l => l.status === 'active');
    if (search) result = result.filter(l => l.title.toLowerCase().includes(search.toLowerCase()) || l.description.toLowerCase().includes(search.toLowerCase()));
    if (category) result = result.filter(l => l.category === category);
    if (area) result = result.filter(l => l.area === area);
    if (sort === 'price-asc') result.sort((a, b) => a.priceEgp - b.priceEgp);
    else if (sort === 'price-desc') result.sort((a, b) => b.priceEgp - a.priceEgp);
    else result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return result;
  }, [search, category, area, sort]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-foreground">{t('marketplace')}</h1>
      <p className="mt-1 text-muted-foreground">{t('browse_listings')} {filtered.length} {t('listings_count')}</p>

      <div className="mt-6 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder={t('search')} value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={category} onValueChange={v => setCategory(v === 'all' ? '' : v)}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder={t('category')} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('all_categories')}</SelectItem>
            {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={area} onValueChange={v => setArea(v === 'all' ? '' : v)}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder={t('area')} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('all_areas')}</SelectItem>
            {AREAS.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">{t('newest')}</SelectItem>
            <SelectItem value="price-asc">{t('price_low')}</SelectItem>
            <SelectItem value="price-desc">{t('price_high')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length > 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(l => <ListingCard key={l.id} listing={l} />)}
        </div>
      ) : (
        <div className="mt-16 text-center text-muted-foreground">{t('no_listings_found')}</div>
      )}
    </div>
  );
};

export default Marketplace;
