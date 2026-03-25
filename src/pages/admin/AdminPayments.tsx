import { paymentTransactions, subscriptions, getUserById, getBusinessById, users } from '@/data/mock';
import { StatsCard } from '@/components/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, CreditCard, TrendingUp, Receipt } from 'lucide-react';
import { useTranslation } from '@/i18n';

const AdminPayments = () => {
  const { t } = useTranslation();
  const totalRevenue = paymentTransactions.reduce((s, t) => s + t.amount, 0);
  const subRevenue = subscriptions.filter(s => s.planName === 'pro' && s.status === 'active').reduce((s, sub) => s + sub.monthlyPriceEgp, 0);
  const activeSubs = subscriptions.filter(s => s.status === 'active' && s.planName === 'pro').length;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
        <DollarSign className="h-6 w-6" /> {t('payments_subscriptions')}
      </h1>

      <div className="grid gap-4 sm:grid-cols-4">
        <StatsCard title={t('total_revenue')} value={`${totalRevenue.toLocaleString()} EGP`} icon={DollarSign} />
        <StatsCard title={t('monthly_sub_revenue')} value={`${subRevenue.toLocaleString()} EGP`} icon={TrendingUp} />
        <StatsCard title={t('active_pro_subs')} value={activeSubs} icon={CreditCard} />
        <StatsCard title={t('total_transactions')} value={paymentTransactions.length} icon={Receipt} />
      </div>

      <Tabs defaultValue="subscriptions">
        <TabsList>
          <TabsTrigger value="subscriptions">{t('subscriptions_tab')}</TabsTrigger>
          <TabsTrigger value="transactions">{t('transactions_tab')}</TabsTrigger>
        </TabsList>

        <TabsContent value="subscriptions">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('business_name')}</TableHead>
                    <TableHead>{t('plan')}</TableHead>
                    <TableHead>{t('price')}</TableHead>
                    <TableHead>{t('status')}</TableHead>
                    <TableHead>{t('start_date')}</TableHead>
                    <TableHead>{t('end_date')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscriptions.map(sub => {
                    const biz = getBusinessById(sub.businessId);
                    return (
                      <TableRow key={sub.id}>
                        <TableCell className="font-medium">{biz?.name || sub.businessId}</TableCell>
                        <TableCell>
                          <Badge variant={sub.planName === 'pro' ? 'default' : 'secondary'}>
                            {sub.planName === 'pro' ? 'Pro' : 'Free'}
                          </Badge>
                        </TableCell>
                        <TableCell>{sub.monthlyPriceEgp} EGP/mo</TableCell>
                        <TableCell>
                          <Badge variant={sub.status === 'active' ? 'default' : 'secondary'}>{sub.status}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{sub.startDate}</TableCell>
                        <TableCell className="text-muted-foreground">{sub.endDate}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('user')}</TableHead>
                    <TableHead>{t('type')}</TableHead>
                    <TableHead>{t('amount')}</TableHead>
                    <TableHead>{t('description')}</TableHead>
                    <TableHead>{t('date')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentTransactions.map(tx => {
                    const u = getUserById(tx.userId);
                    return (
                      <TableRow key={tx.id}>
                        <TableCell className="font-medium">{u?.name || tx.userId}</TableCell>
                        <TableCell><Badge variant="outline">{tx.type.replace(/_/g, ' ')}</Badge></TableCell>
                        <TableCell className="font-semibold">{tx.amount} EGP</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{tx.description}</TableCell>
                        <TableCell className="text-muted-foreground">{tx.createdAt}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPayments;
