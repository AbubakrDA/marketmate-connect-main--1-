import { leads, getListingById, getBusinessById } from '@/data/mock';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const statusColor: Record<string, string> = { new: 'bg-info text-info-foreground', contacted: 'bg-gold text-gold-foreground', won: 'bg-success text-success-foreground', lost: 'bg-destructive text-destructive-foreground' };

const AdminLeads = () => {
  const statusCounts = { new: leads.filter(l => l.status === 'new').length, contacted: leads.filter(l => l.status === 'contacted').length, won: leads.filter(l => l.status === 'won').length, lost: leads.filter(l => l.status === 'lost').length };

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
              <TableCell>{getListingById(l.listingId)?.title}</TableCell>
              <TableCell>{getBusinessById(l.businessId)?.name}</TableCell>
              <TableCell><Badge className={statusColor[l.status]}>{l.status}</Badge></TableCell>
              <TableCell className="text-muted-foreground">{l.createdAt}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
export default AdminLeads;
