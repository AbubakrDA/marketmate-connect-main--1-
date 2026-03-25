import { useAuth } from '@/context/AuthContext';
import { getBusinessByOwner, getDemandForBusiness, getDemandInsights, getDemandStats, getOpenBuyerRequests } from '@/data/mock';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/i18n';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';
import { Radar, TrendingUp, MapPin, DollarSign, Lightbulb } from 'lucide-react';

const COLORS = ['hsl(201 96% 32%)', 'hsl(152 69% 31%)', 'hsl(12 76% 61%)', 'hsl(45 93% 47%)', 'hsl(280 65% 50%)'];

const DemandRadar = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const biz = getBusinessByOwner(user?.id || '');
  const allStats = getDemandStats();
  const bizStats = biz ? getDemandForBusiness(biz.id) : allStats;
  const insights = biz ? getDemandInsights(biz.id) : [];

  // Top requested categories
  const catMap = new Map<string, number>();
  allStats.filter(d => d.month === 3 && d.year === 2024).forEach(d => {
    catMap.set(d.category, (catMap.get(d.category) || 0) + d.requestCount);
  });
  const categoryData = Array.from(catMap.entries()).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

  // Top areas
  const areaMap = new Map<string, number>();
  bizStats.filter(d => d.month === 3 && d.year === 2024).forEach(d => {
    areaMap.set(d.area, (areaMap.get(d.area) || 0) + d.requestCount);
  });
  const areaData = Array.from(areaMap.entries()).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

  // Average budget by sub-category
  const budgetData = bizStats
    .filter(d => d.month === 3 && d.year === 2024)
    .map(d => ({ name: d.subCategory || d.category, avgBudget: d.averagePrice, requests: d.requestCount }));

  // Trend data (month over month)
  const months = [2, 3];
  const trendData = months.map(m => {
    const monthStats = bizStats.filter(d => d.month === m && d.year === 2024);
    return {
      month: m === 2 ? 'Feb' : 'Mar',
      requests: monthStats.reduce((s, d) => s + d.requestCount, 0),
      avgPrice: monthStats.length > 0 ? Math.round(monthStats.reduce((s, d) => s + d.averagePrice, 0) / monthStats.length) : 0,
    };
  });

  const openReqs = biz ? getOpenBuyerRequests().filter(r => r.category === biz.category).length : getOpenBuyerRequests().length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Radar className="h-6 w-6 text-primary" />
          {t('demand_radar')}
        </h1>
        <p className="text-muted-foreground">{t('demand_radar_desc')}</p>
      </div>

      {/* Insight Alerts */}
      {insights.length > 0 && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">{t('demand_insights')}</h3>
            </div>
            {insights.map((insight, i) => (
              <p key={i} className="text-sm text-foreground">{insight}</p>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Stats Row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{openReqs}</p>
              <p className="text-xs text-muted-foreground">{t('open_requests_now')}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
              <MapPin className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{areaData.length}</p>
              <p className="text-xs text-muted-foreground">{t('active_areas')}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/50">
              <DollarSign className="h-5 w-5 text-secondary-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {budgetData.length > 0 ? Math.round(budgetData.reduce((s, d) => s + d.avgBudget, 0) / budgetData.length).toLocaleString() : 0} {t('egp')}
              </p>
              <p className="text-xs text-muted-foreground">{t('avg_buyer_budget')}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>{t('top_requested_categories')}</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>{t('top_areas_by_demand')}</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={areaData} layout="vertical">
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={80} />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(201 96% 32%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>{t('avg_buyer_budget_by_subcategory')}</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={budgetData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(v: number) => `${v.toLocaleString()} EGP`} />
                <Bar dataKey="avgBudget" fill="hsl(152 69% 31%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>{t('demand_trends')}</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="requests" stroke="hsl(201 96% 32%)" strokeWidth={2} name="Requests" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DemandRadar;
