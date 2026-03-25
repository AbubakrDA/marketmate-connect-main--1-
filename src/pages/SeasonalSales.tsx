import { getActiveSaleCampaigns } from '@/data/mock';
import { SaleCampaignCard } from '@/components/SaleCampaignCard';
import { Percent } from 'lucide-react';
import { useTranslation } from '@/i18n';

const SeasonalSales = () => {
  const campaigns = getActiveSaleCampaigns();
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-coral/10">
            <Percent className="h-5 w-5 text-coral" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">{t('seasonal_sales')}</h1>
        </div>
        <p className="text-muted-foreground">{t('seasonal_sales_subtitle')}</p>
      </div>
      {campaigns.length === 0 ? (
        <p className="py-16 text-center text-muted-foreground">{t('no_active_sales')}</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {campaigns.map(c => <SaleCampaignCard key={c.id} campaign={c} />)}
        </div>
      )}
    </div>
  );
};

export default SeasonalSales;
