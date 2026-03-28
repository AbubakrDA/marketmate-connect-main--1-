import { useAuth } from '@/context/AuthContext';
import { getBusinessByOwner, getSubscriptionByBusiness } from '@/data/mock';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Crown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const plans = [
  { name: 'Basic', price: 199, leads: 30, features: ['30 Leads included', 'Basic Analytics', 'WhatsApp & Call tracking'] },
  { name: 'Pro', price: 599, leads: 100, features: ['100 Leads included', 'Advanced AI Insights', 'Priority Support', 'Ad Campaigns'] },
  { name: 'Premium', price: 1499, leads: 'Unlimited', features: ['Unlimited Leads', 'Full AI Router Access', 'Market Demand Radar', 'Premium Support'] },
];

import { useState, useEffect } from 'react';
import { businessService, dashboardService } from '@/lib/api';
import { Progress } from '@/components/ui/progress';

const SubscriptionPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      try {
        const business = await businessService.getByOwner(user.id);
        const bizStats = await dashboardService.getBusinessStats(business.id);
        setStats(bizStats);
      } catch (error) {
        console.error('Error fetching subscription data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.id]);

  if (loading) return <div className="p-8 text-center">Loading subscription...</div>;
  
  const sub = stats?.subscription;

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-2">Subscription</h1>
      {sub && <p className="text-muted-foreground mb-6">Current plan: <Badge variant={sub.planName === 'pro' ? 'default' : 'secondary'}>{sub.planName.toUpperCase()}</Badge></p>}
      {sub && (
        <Card className="mb-8 border-coral/20 bg-coral/5">
          <CardHeader>
            <CardTitle className="text-lg">Usage Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Leads Used: <strong>{sub.leads_used}</strong></span>
              <span>Remaining: <strong>{sub.leads_remaining}</strong></span>
            </div>
            <Progress value={(sub.leads_used / (sub.leads_used + sub.leads_remaining)) * 100} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {sub.leads_remaining === 0 ? "You have reached your limit. Additional leads will be charged at 10 EGP/lead." : "Your next lead will be deducted from your quota."}
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 sm:grid-cols-3">
        {plans.map(plan => {
          const isCurrent = sub?.plan.toLowerCase() === plan.name.toLowerCase();
          return (
            <Card key={plan.name} className={isCurrent ? 'ring-2 ring-coral' : ''}>
              <CardHeader className="text-center p-6">
                {plan.name === 'Premium' && <Crown className="mx-auto mb-2 h-8 w-8 text-gold" />}
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="mt-2 text-3xl font-bold">{plan.price} <span className="text-sm font-normal text-muted-foreground">EGP/mo</span></div>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <ul className="space-y-3 mb-8">
                  {plan.features.map(f => <li key={f} className="flex items-center gap-2 text-sm font-medium"><CheckCircle className="h-4 w-4 text-success" />{f}</li>)}
                </ul>
                <Button 
                  className={`w-full ${isCurrent ? 'bg-muted' : 'bg-coral text-coral-foreground hover:bg-coral/90'}`}
                  disabled={isCurrent}
                  onClick={() => toast({ title: `Contacting Sales for ${plan.name} upgrade...` })}
                >
                  {isCurrent ? 'Current Plan' : 'Select Plan'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
export default SubscriptionPage;
