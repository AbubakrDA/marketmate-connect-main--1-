import { useState } from 'react';
import { businesses } from '@/data/mock';
import { BusinessCard } from '@/components/BusinessCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { CATEGORIES, CITIES } from '@/types';
import { Search } from 'lucide-react';
import { useTranslation } from '@/i18n';

const BusinessesDirectory = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [city, setCity] = useState('');

  const filtered = businesses.filter(b => {
    if (search && !b.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (category && b.category !== category) return false;
    if (city && b.city !== city) return false;
    return true;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-foreground">{t('businesses_directory')}</h1>
      <p className="mt-1 text-muted-foreground">{filtered.length} {t('businesses_found')}</p>

      <div className="mt-6 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder={t('search_businesses')} value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={category} onValueChange={v => setCategory(v === 'all' ? '' : v)}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder={t('category')} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('all_categories')}</SelectItem>
            {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={city} onValueChange={v => setCity(v === 'all' ? '' : v)}>
          <SelectTrigger className="w-[130px]"><SelectValue placeholder={t('city')} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('all_cities')}</SelectItem>
            {CITIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {filtered.map(b => <BusinessCard key={b.id} business={b} />)}
      </div>
      {filtered.length === 0 && <p className="mt-16 text-center text-muted-foreground">{t('no_businesses_found')}</p>}
    </div>
  );
};

export default BusinessesDirectory;
