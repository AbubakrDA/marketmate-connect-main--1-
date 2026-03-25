import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { leadService, listingService, businessService } from '@/lib/api';
import { Lead } from '@/types';

const statusColor: Record<string, string> = { new: 'bg-info text-info-foreground', contacted: 'bg-gold text-gold-foreground', won: 'bg-success text-success-foreground', lost: 'bg-destructive text-destructive-foreground' };

const AdminLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [listingNames, setListingNames] = useState<Record<string, string>>({});
  const [businessNames, setBusinessNames] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const lData = await leadService.getAll();
        setLeads(lData);
        
        // Fetch listing and business names (simplified for MVP)
        const [listings, businesses] = await Promise.all([
          listingService.getAll(),
          businessService.getAll()
        ]);
        
        const lNames: Record<string, string> = {};
        listings.forEach((l: any) => lNames[l.id] = l.title);
        setListingNames(lNames);
        
        const bNames: Record<string, string> = {};
        businesses.forEach((b: any) => bNames[b.id] = b.name);
        setBusinessNames(bNames);
      } catch (error) {
        console.error('Error fetching admin leads:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statusCounts = { 
    new: leads.filter(l => l.status === 'new').length, 
    contacted: leads.filter(l => l.status === 'contacted').length, 
    won: leads.filter(l => l.status === 'won').length, 
    lost: leads.filter(l => l.status === 'lost').length 
  };

  if (loading) return <div className="p-8 text-center">Loading leads...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-4">Leads Overview</h1>
      <div className="grid gap-3 sm:grid-cols-4 mb-6">
        {Object.entries(statusCounts).map(([status, count]) => (
          <Card key={status}><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">{count}</p><Badge className={statusColor[status]}>{status}</Badge></CardContent></Card>
        ))}
      </div>
      <Table>
        <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Listing</TableHead><TableHead>Business</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead></TableRow></TableHeader>
        <TableBody>
          {leads.map(l => (
            <TableRow key={l.id}>
              <TableCell className="font-medium">{l.name}</TableCell>
              <TableCell>{listingNames[l.listing_id] || l.listing_id}</TableCell>
              <TableCell>{businessNames[l.business_id] || l.business_id}</TableCell>
              <TableCell><Badge className={statusColor[l.status]}>{l.status}</Badge></TableCell>
              <TableCell className="text-muted-foreground">{l.created_at || 'N/A'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
export default AdminLeads;
