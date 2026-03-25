import { useAuth } from '@/context/AuthContext';
import { getBusinessByOwner, getRecommendationsByBusiness } from '@/data/mock';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, TrendingUp, MapPin, DollarSign } from 'lucide-react';

const iconMap: Record<string, any> = { pricing: DollarSign, area: MapPin, improvement: TrendingUp, promotion: Lightbulb };

const Recommendations = () => {
  const { user } = useAuth();
  const biz = getBusinessByOwner(user?.id || '');
  const recs = biz ? getRecommendationsByBusiness(biz.id) : [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-2">Recommendations</h1>
      <p className="text-muted-foreground mb-6">AI-powered insights to grow your business</p>
      <div className="grid gap-4 sm:grid-cols-2">
        {recs.map(r => {
          const Icon = iconMap[r.type] || Lightbulb;
          return (
            <Card key={r.id} className="transition-all hover:shadow-md">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10"><Icon className="h-5 w-5 text-gold" /></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between"><h3 className="font-semibold text-foreground">{r.title}</h3><Badge variant="outline">{r.score}% match</Badge></div>
                    <p className="mt-1 text-sm text-muted-foreground">{r.description}</p>
                    <Badge variant="secondary" className="mt-2">{r.type}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
export default Recommendations;
