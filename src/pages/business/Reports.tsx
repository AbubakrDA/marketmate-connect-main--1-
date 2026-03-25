import { useAuth } from '@/context/AuthContext';
import { getBusinessByOwner, getListingsByBusiness, getLeadsByBusiness } from '@/data/mock';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/StatsCard';
import { List, Inbox, DollarSign, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const COLORS = ['hsl(201 96% 32%)', 'hsl(43 96% 56%)', 'hsl(152 69% 31%)', 'hsl(0 84% 60%)'];

const Reports = () => {
  const { user } = useAuth();
  const biz = getBusinessByOwner(user?.id || '');
  const bListings = biz ? getListingsByBusiness(biz.id) : [];
  const bLeads = biz ? getLeadsByBusiness(biz.id) : [];
  const avgPrice = bListings.length > 0 ? Math.round(bListings.reduce((s, l) => s + l.priceEgp, 0) / bListings.length) : 0;
  const won = bLeads.filter(l => l.status === 'won').length;
  const convRate = bLeads.length > 0 ? Math.round((won / bLeads.length) * 100) : 0;

  const leadPie = [
    { name: 'New', value: bLeads.filter(l => l.status === 'new').length },
    { name: 'Contacted', value: bLeads.filter(l => l.status === 'contacted').length },
    { name: 'Won', value: won },
    { name: 'Lost', value: bLeads.filter(l => l.status === 'lost').length },
  ];

  const listingBar = bListings.map(l => ({ name: l.title.substring(0, 15), price: l.priceEgp }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Reports & Analytics</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Listings" value={bListings.length} icon={List} />
        <StatsCard title="Leads" value={bLeads.length} icon={Inbox} />
        <StatsCard title="Avg. Price" value={`${avgPrice.toLocaleString()} EGP`} icon={DollarSign} />
        <StatsCard title="Conversion" value={`${convRate}%`} icon={TrendingUp} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card><CardHeader><CardTitle>Lead Status Distribution</CardTitle></CardHeader><CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart><Pie data={leadPie} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
              {leadPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie></PieChart>
          </ResponsiveContainer>
        </CardContent></Card>
        <Card><CardHeader><CardTitle>Listing Prices</CardTitle></CardHeader><CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={listingBar}><XAxis dataKey="name" fontSize={10} /><YAxis /><Tooltip /><Bar dataKey="price" fill="hsl(222 47% 11%)" radius={[4,4,0,0]} /></BarChart>
          </ResponsiveContainer>
        </CardContent></Card>
      </div>
    </div>
  );
};
export default Reports;
