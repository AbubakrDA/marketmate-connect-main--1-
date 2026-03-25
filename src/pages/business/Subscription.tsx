import { useAuth } from '@/context/AuthContext';
import { getBusinessByOwner, getSubscriptionByBusiness } from '@/data/mock';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Crown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const plans = [
  { name: 'Free', price: 0, features: ['5 Active Listings', 'Basic Lead Inbox', 'Business Profile'] },
  { name: 'Pro', price: 200, features: ['Unlimited Listings', 'Advanced Analytics', 'AI Recommendations', 'Ad Campaigns', 'Priority Support', 'Detailed Reports'] },
];

const SubscriptionPage = () => {
  const { user } = useAuth();
  const biz = getBusinessByOwner(user?.id || '');
  const sub = biz ? getSubscriptionByBusiness(biz.id) : null;
  const { toast } = useToast();

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-2">Subscription</h1>
      {sub && <p className="text-muted-foreground mb-6">Current plan: <Badge variant={sub.planName === 'pro' ? 'default' : 'secondary'}>{sub.planName.toUpperCase()}</Badge></p>}
      <div className="grid gap-6 sm:grid-cols-2 max-w-2xl">
        {plans.map(plan => {
          const isCurrent = sub?.planName === plan.name.toLowerCase();
          return (
            <Card key={plan.name} className={isCurrent ? 'ring-2 ring-primary' : ''}>
              <CardHeader className="text-center">
                {plan.name === 'Pro' && <Crown className="mx-auto mb-2 h-8 w-8 text-gold" />}
                <CardTitle className="text-xl">{plan.name} Plan</CardTitle>
                <p className="text-3xl font-bold text-foreground">{plan.price === 0 ? 'Free' : `${plan.price} EGP`}<span className="text-sm font-normal text-muted-foreground">{plan.price > 0 ? '/month' : ''}</span></p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {plan.features.map(f => <li key={f} className="flex items-center gap-2 text-sm"><CheckCircle className="h-4 w-4 text-success" />{f}</li>)}
                </ul>
                {isCurrent ? (
                  <Button disabled className="w-full">Current Plan</Button>
                ) : (
                  <Button className="w-full bg-coral text-coral-foreground hover:bg-coral/90" onClick={() => toast({ title: `Upgraded to ${plan.name}! (simulated)` })}>
                    {plan.price === 0 ? 'Downgrade' : 'Upgrade'}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
export default SubscriptionPage;
