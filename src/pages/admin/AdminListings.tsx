import { listings, getBusinessById } from '@/data/mock';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const AdminListings = () => (
  <div>
    <h1 className="text-2xl font-bold text-foreground mb-4">Listings Overview</h1>
    <Table>
      <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Business</TableHead><TableHead>Category</TableHead><TableHead>Price</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead></TableRow></TableHeader>
      <TableBody>
        {listings.map(l => (
          <TableRow key={l.id}>
            <TableCell className="font-medium">{l.title}</TableCell>
            <TableCell>{getBusinessById(l.businessId)?.name}</TableCell>
            <TableCell><Badge variant="secondary">{l.category}</Badge></TableCell>
            <TableCell>{l.priceEgp.toLocaleString()} EGP</TableCell>
            <TableCell><Badge variant={l.status === 'active' ? 'default' : 'secondary'}>{l.status}</Badge></TableCell>
            <TableCell className="text-muted-foreground">{l.createdAt}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);
export default AdminListings;
