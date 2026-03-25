import { useAuth } from '@/context/AuthContext';
import { getBusinessByOwner, getListingsByBusiness, getLeadsByBusiness, aiInsights, getSubscriptionByBusiness } from '@/data/mock';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatsCard } from '@/components/StatsCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, TrendingUp, DollarSign, BarChart3, AlertTriangle, Zap, Target, Activity, Lock, CreditCard } from 'lucide-react';
import { useTranslation } from '@/i18n';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import type { AIInsight } from '@/data/mock';

const impactColors: Record<string, string> = {
  high: 'bg-destructive/10 text-destructive border-destructive/20',
  medium: 'bg-gold/10 text-gold border-gold/20',
  low: 'bg-success/10 text-success border-success/20',
};

const typeIcons: Record<string, any> = {
  business_performance: Activity,
  market_trend: TrendingUp,
  pricing: DollarSign,
  demand: Target,
  competitor: AlertTriangle,
};

const AIAnalytics = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const biz = getBusinessByOwner(user?.id || '');
  const sub = biz ? getSubscriptionByBusiness(biz.id) : undefined;
  const isPro = sub?.planName === 'pro' && sub?.status === 'active';
  const bListings = biz ? getListingsByBusiness(biz.id) : [];
  const bLeads = biz ? getLeadsByBusiness(biz.id) : [];
  const [selected, setSelected] = useState<AIInsight | null>(null);

  const relevantInsights = aiInsights.filter(i =>
    !i.category || (biz && i.category === biz.category)
  );
  const highImpact = relevantInsights.filter(i => i.impact === 'high').length;

  // Free users see basic stats only
  if (!isPro) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Brain className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t('ai_analytics')}</h1>
            <p className="text-muted-foreground text-sm">{t('ai_analytics_desc')}</p>
          </div>
        </div>

        {/* Basic stats available for free */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard title={t('listings')} value={bListings.length} icon={BarChart3} />
          <StatsCard title={t('total_leads')} value={bLeads.length} icon={Target} />
          <StatsCard title={t('conversion')} value={`${bLeads.length > 0 ? Math.round((bLeads.filter(l => l.status === 'won').length / bLeads.length) * 100) : 0}%`} icon={TrendingUp} />
          <StatsCard title={t('active')} value={bListings.filter(l => l.status === 'active').length} icon={Activity} />
        </div>

        {/* Pro upgrade prompt */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="flex flex-col items-center text-center py-12 px-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
              <Lock className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">{t('unlock_ai_analytics')}</h2>
            <p className="text-muted-foreground max-w-md mb-6">{t('unlock_ai_analytics_desc')}</p>
            <div className="grid gap-3 sm:grid-cols-3 mb-6 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Brain className="h-4 w-4 text-primary" />
                <span>{t('ai_market_trends')}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <DollarSign className="h-4 w-4 text-primary" />
                <span>{t('ai_pricing_insights')}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <AlertTriangle className="h-4 w-4 text-primary" />
                <span>{t('ai_competitor_alerts')}</span>
              </div>
            </div>
            <Button asChild size="lg">
              <Link to="/business/subscription">
                <CreditCard className="mr-2 h-4 w-4" />
                {t('upgrade')}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Pro users get full AI analytics
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Brain className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('ai_analytics')}</h1>
          <p className="text-muted-foreground text-sm">{t('ai_analytics_desc')}</p>
        </div>
        <Badge className="ml-auto bg-gold/10 text-gold border-gold/20">PRO</Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title={t('total_insights')} value={relevantInsights.length} icon={Brain} />
        <StatsCard title={t('high_impact')} value={highImpact} icon={Zap} />
        <StatsCard title={t('listings')} value={bListings.length} icon={BarChart3} />
        <StatsCard title={t('total_leads')} value={bLeads.length} icon={Target} />
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">{t('all')} ({relevantInsights.length})</TabsTrigger>
          <TabsTrigger value="market_trend">{t('market_trends')}</TabsTrigger>
          <TabsTrigger value="business_performance">{t('performance')}</TabsTrigger>
          <TabsTrigger value="pricing">{t('price')}</TabsTrigger>
          <TabsTrigger value="demand">{t('demand')}</TabsTrigger>
        </TabsList>

        {['all', 'market_trend', 'business_performance', 'pricing', 'demand'].map(tab => (
          <TabsContent key={tab} value={tab} className="mt-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {(tab === 'all' ? relevantInsights : relevantInsights.filter(i => i.type === tab)).map(insight => {
                const Icon = typeIcons[insight.type] || Brain;
                return (
                  <Card key={insight.id} className="cursor-pointer transition-all hover:shadow-md" onClick={() => setSelected(insight)}>
                    <CardContent className="p-5">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-semibold text-foreground text-sm leading-tight">{insight.title}</h3>
                            <Badge className={`shrink-0 text-xs ${impactColors[insight.impact]}`}>{insight.impact}</Badge>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{insight.summary}</p>
                          {insight.metric && (
                            <div className="mt-3 flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">{insight.metric}:</span>
                              <span className="text-sm font-bold text-foreground">{insight.metricValue}</span>
                            </div>
                          )}
                          <div className="mt-2 flex gap-2">
                            {insight.category && <Badge variant="outline" className="text-xs">{insight.category}</Badge>}
                            <Badge variant="secondary" className="text-xs">{insight.type.replace('_', ' ')}</Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <Badge className={impactColors[selected.impact]}>{selected.impact} impact</Badge>
                  {selected.category && <Badge variant="outline">{selected.category}</Badge>}
                </div>
                <DialogTitle className="mt-2">{selected.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {selected.metric && (
                  <Card><CardContent className="flex items-center justify-between p-4">
                    <span className="text-sm text-muted-foreground">{selected.metric}</span>
                    <span className="text-2xl font-bold text-foreground">{selected.metricValue}</span>
                  </CardContent></Card>
                )}
                <div>
                  <h4 className="font-medium text-foreground mb-2">{t('ai_analysis')}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{selected.details}</p>
                </div>
                <p className="text-xs text-muted-foreground">🤖 {t('ai_generated_note')}</p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AIAnalytics;
