import { dashboardService } from '@/lib/api';
import { StatsCard } from '@/components/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Building2, FileText, Inbox, Megaphone, CreditCard, ShoppingBag, Send, DollarSign, Mail } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from 'recharts';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const COLORS = ['hsl(201 96% 32%)', 'hsl(152 69% 31%)', 'hsl(12 76% 61%)', 'hsl(45 93% 47%)'];

const AdminDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await dashboardService.getAdminStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading || !stats) return <div className="p-8 text-center text-foreground">Loading dashboard data...</div>;

  const { counts, revenue, invitations, category_distribution, time_series } = stats;

  const quickLinks = [
    { label: 'Manage Users', url: '/admin/users', icon: Users },
    { label: 'Manage Businesses', url: '/admin/businesses', icon: Building2 },
    { label: 'Buyer Requests', url: '/admin/requests', icon: ShoppingBag },
    { label: 'Payments', url: '/admin/payments', icon: DollarSign },
    { label: 'Invitations', url: '/admin/invitations', icon: Mail },
    { label: 'Business Directory', url: '/admin/directory', icon: FileText },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatsCard title="Users" value={counts.users} icon={Users} />
        <StatsCard title="Businesses" value={counts.businesses} icon={Building2} />
        <StatsCard title="Listings" value={counts.listings} icon={FileText} />
        <StatsCard title="Buyer Requests" value={counts.requests} icon={ShoppingBag} />
        <StatsCard title="Offers" value={counts.offers} icon={Send} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Leads" value={counts.leads} icon={Inbox} />
        <StatsCard title="Pro Subscriptions" value={revenue.pro_subscriptions} icon={CreditCard} />
        <StatsCard title="Revenue" value={`${revenue.total} EGP`} icon={DollarSign} />
        <StatsCard title="Invitations Sent" value={invitations.total} icon={Mail} />
      </div>

      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {quickLinks.map(link => (
          <Link key={link.url} to={link.url}>
            <Card className="transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer">
              <CardContent className="flex flex-col items-center gap-2 p-4 text-center">
                <link.icon className="h-6 w-6 text-primary" />
                <span className="text-sm font-medium text-foreground">{link.label}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Listings by Category</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={category_distribution} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {category_distribution.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Leads & Requests Over Time</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={time_series}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="leads" fill="hsl(201 96% 32%)" radius={[4, 4, 0, 0]} name="Leads" />
                <Bar dataKey="requests" fill="hsl(152 69% 31%)" radius={[4, 4, 0, 0]} name="Requests" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Invitation Funnel</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center justify-around text-center">
            <div>
              <p className="text-3xl font-bold text-foreground">{invitations.sent}</p>
              <p className="text-sm text-muted-foreground">Sent</p>
            </div>
            <span className="text-2xl text-muted-foreground">→</span>
            <div>
              <p className="text-3xl font-bold text-foreground">{invitations.opened}</p>
              <p className="text-sm text-muted-foreground">Opened</p>
            </div>
            <span className="text-2xl text-muted-foreground">→</span>
            <div>
              <p className="text-3xl font-bold text-foreground">{invitations.joined}</p>
              <p className="text-sm text-muted-foreground">Joined</p>
            </div>
            <span className="text-2xl text-muted-foreground">→</span>
            <div>
              <p className="text-3xl font-bold text-foreground">
                {invitations.total > 0 ? Math.round((invitations.joined / invitations.total) * 100) : 0}%
              </p>
              <p className="text-sm text-muted-foreground">Conversion</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
