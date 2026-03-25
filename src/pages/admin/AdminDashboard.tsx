import { users, businesses, listings, leads, adCampaigns, subscriptions, buyerRequests, offers, paymentTransactions, getInvitationStats } from '@/data/mock';
import { StatsCard } from '@/components/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Building2, FileText, Inbox, Megaphone, CreditCard, ShoppingBag, Send, DollarSign, Mail } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from 'recharts';
import { Link } from 'react-router-dom';

const COLORS = ['hsl(201 96% 32%)', 'hsl(152 69% 31%)', 'hsl(12 76% 61%)', 'hsl(45 93% 47%)'];

const AdminDashboard = () => {
  const catData = [
    { name: 'Clinics', value: listings.filter(l => l.category === 'Clinics').length },
    { name: 'Real Estate', value: listings.filter(l => l.category === 'Real Estate').length },
    { name: 'Fashion', value: listings.filter(l => l.category === 'Fashion').length },
  ];

  const leadsByMonth = [
    { month: 'Jan', leads: 2, requests: 1 },
    { month: 'Feb', leads: 4, requests: 3 },
    { month: 'Mar', leads: leads.length, requests: buyerRequests.length },
  ];

  const invStats = getInvitationStats();
  const totalRevenue = paymentTransactions.reduce((s, t) => s + t.amount, 0);
  const proSubs = subscriptions.filter(s => s.planName === 'pro' && s.status === 'active').length;

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
        <StatsCard title="Users" value={users.length} icon={Users} />
        <StatsCard title="Businesses" value={businesses.length} icon={Building2} />
        <StatsCard title="Listings" value={listings.length} icon={FileText} />
        <StatsCard title="Buyer Requests" value={buyerRequests.length} icon={ShoppingBag} />
        <StatsCard title="Offers" value={offers.length} icon={Send} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Leads" value={leads.length} icon={Inbox} />
        <StatsCard title="Pro Subscriptions" value={proSubs} icon={CreditCard} />
        <StatsCard title="Revenue" value={`${totalRevenue} EGP`} icon={DollarSign} />
        <StatsCard title="Invitations Sent" value={invStats.total} icon={Mail} />
      </div>

      {/* Quick Links */}
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
                <Pie data={catData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {catData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
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
              <BarChart data={leadsByMonth}>
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

      {/* Invitation Funnel */}
      <Card>
        <CardHeader><CardTitle>Invitation Funnel</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center justify-around text-center">
            <div>
              <p className="text-3xl font-bold text-foreground">{invStats.sent}</p>
              <p className="text-sm text-muted-foreground">Sent</p>
            </div>
            <span className="text-2xl text-muted-foreground">→</span>
            <div>
              <p className="text-3xl font-bold text-foreground">{invStats.opened}</p>
              <p className="text-sm text-muted-foreground">Opened</p>
            </div>
            <span className="text-2xl text-muted-foreground">→</span>
            <div>
              <p className="text-3xl font-bold text-foreground">{invStats.joined}</p>
              <p className="text-sm text-muted-foreground">Joined</p>
            </div>
            <span className="text-2xl text-muted-foreground">→</span>
            <div>
              <p className="text-3xl font-bold text-foreground">
                {invStats.total > 0 ? Math.round((invStats.joined / invStats.total) * 100) : 0}%
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
