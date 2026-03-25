import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '@/i18n';
import { getActiveGroupDeals, getGroupDealById, getBusinessById } from '@/data/mock';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Clock, Tag, MapPin } from 'lucide-react';
import { CATEGORIES, AREAS } from '@/types';

const GroupDeals = () => {
  const { t } = useTranslation();
  const [catFilter, setCatFilter] = useState('all');
  const [areaFilter, setAreaFilter] = useState('all');

  const deals = getActiveGroupDeals().filter(d =>
    (catFilter === 'all' || d.category === catFilter) &&
    (areaFilter === 'all' || d.area === areaFilter)
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">🤝 {t('group_deals')}</h1>
        <p className="text-muted-foreground">{t('group_deals_desc')}</p>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <Select value={catFilter} onValueChange={setCatFilter}>
          <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('all_categories')}</SelectItem>
            {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={areaFilter} onValueChange={setAreaFilter}>
          <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('all_areas')}</SelectItem>
            {AREAS.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {deals.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">{t('no_group_deals')}</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {deals.map(deal => {
            const biz = getBusinessById(deal.businessId);
            const pct = Math.round((deal.currentParticipants / deal.requiredParticipants) * 100);
            const remaining = deal.requiredParticipants - deal.currentParticipants;
            const discount = Math.round(((deal.originalPrice - deal.dealPrice) / deal.originalPrice) * 100);
            const daysLeft = Math.max(0, Math.ceil((new Date(deal.endDate).getTime() - Date.now()) / 86400000));

            return (
              <Link key={deal.id} to={`/group-deals/${deal.id}`}>
                <Card className="hover:shadow-lg transition-shadow h-full">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <Badge className="bg-coral text-coral-foreground">{discount}% {t('off')}</Badge>
                      {remaining <= 3 && <Badge variant="destructive" className="animate-pulse">🔥 {remaining} left!</Badge>}
                    </div>
                    <h3 className="font-bold text-foreground text-lg mb-1">{deal.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{deal.description}</p>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{deal.area}, {deal.city}</span>
                      <span className="mx-1">·</span>
                      <Tag className="h-3.5 w-3.5" />
                      <span>{deal.category}</span>
                    </div>

                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-2xl font-bold text-foreground">{deal.dealPrice} {t('egp')}</span>
                      <span className="text-sm text-muted-foreground line-through">{deal.originalPrice} {t('egp')}</span>
                    </div>

                    <div className="mb-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Users className="h-3.5 w-3.5" />
                          {deal.currentParticipants} / {deal.requiredParticipants}
                        </span>
                        <span className="text-muted-foreground">{pct}%</span>
                      </div>
                      <Progress value={pct} className="h-2.5" />
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{daysLeft} {t('days_left')}</span>
                      {biz && <span>{biz.name}</span>}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GroupDeals;
