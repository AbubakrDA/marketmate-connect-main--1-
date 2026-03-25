import { useAuth } from '@/context/AuthContext';
import { getLeadsByUser, getListingById, getBusinessById } from '@/data/mock';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const statusColor: Record<string, string> = { new: 'bg-info text-info-foreground', contacted: 'bg-gold text-gold-foreground', won: 'bg-success text-success-foreground', lost: 'bg-destructive text-destructive-foreground' };

const MyLeads = () => {
  const { user } = useAuth();
  const myLeads = getLeadsByUser(user?.id || '');

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-4">My Inquiries</h1>
      {myLeads.length === 0 ? <p className="text-muted-foreground">You haven't sent any inquiries yet.</p> : (
        <Table>
          <TableHeader><TableRow><TableHead>Listing</TableHead><TableHead>Business</TableHead><TableHead>Message</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead></TableRow></TableHeader>
          <TableBody>
            {myLeads.map(lead => {
              const listing = getListingById(lead.listingId);
              const biz = getBusinessById(lead.businessId);
              return (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">{listing?.title || 'N/A'}</TableCell>
                  <TableCell>{biz?.name || 'N/A'}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{lead.message}</TableCell>
                  <TableCell><Badge className={statusColor[lead.status]}>{lead.status}</Badge></TableCell>
                  <TableCell className="text-muted-foreground">{lead.createdAt}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
};
export default MyLeads;
