import { aiInsights } from '@/data/mock';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, TrendingUp, DollarSign, Target, AlertTriangle, Activity } from 'lucide-react';
import { useTranslation } from '@/i18n';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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

const UserAIInsights = () => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<AIInsight | null>(null);
  
  // Show market trends and demand insights to users
  const userInsights = aiInsights.filter(i => ['market_trend', 'demand', 'pricing'].includes(i.type));

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <Brain className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">{t('market_insights')}</h1>
      </div>
      <p className="text-muted-foreground mb-6">{t('market_insights_desc')}</p>

      <div className="grid gap-4 sm:grid-cols-2">
        {userInsights.map(insight => {
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
                      <h3 className="font-semibold text-foreground text-sm">{insight.title}</h3>
                      <Badge className={`shrink-0 text-xs ${impactColors[insight.impact]}`}>{insight.impact}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{insight.summary}</p>
                    {insight.metric && (
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{insight.metric}:</span>
                        <span className="font-bold text-foreground">{insight.metricValue}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <Badge className={`w-fit ${impactColors[selected.impact]}`}>{selected.impact} impact</Badge>
                <DialogTitle className="mt-2">{selected.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {selected.metric && (
                  <Card><CardContent className="flex items-center justify-between p-4">
                    <span className="text-sm text-muted-foreground">{selected.metric}</span>
                    <span className="text-2xl font-bold text-foreground">{selected.metricValue}</span>
                  </CardContent></Card>
                )}
                <p className="text-sm text-muted-foreground leading-relaxed">{selected.details}</p>
                <p className="text-xs text-muted-foreground">🤖 {t('ai_generated_note')}</p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserAIInsights;
