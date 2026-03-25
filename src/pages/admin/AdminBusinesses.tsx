import { businessService } from '@/lib/api';
import { Business } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';

const AdminBusinesses = () => {
  const { toast } = useToast();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const data = await businessService.getAll();
        setBusinesses(data);
      } catch (error) {
        console.error('Error fetching admin businesses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBusinesses();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading businesses...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-4">Businesses Management</h1>
      <Table>
        <TableHeader><TableRow><TableHead>Business</TableHead><TableHead>Category</TableHead><TableHead>Area</TableHead><TableHead>Verified</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
        <TableBody>
          {businesses.map(b => (
            <TableRow key={b.id}>
              <TableCell><div className="flex items-center gap-2"><img src={b.logo_url || '/placeholder-logo.png'} alt={b.name} className="h-8 w-8 rounded" /><span className="font-medium">{b.name}</span></div></TableCell>
              <TableCell><Badge variant="secondary">{b.category}</Badge></TableCell>
              <TableCell>{b.area}, {b.city}</TableCell>
              <TableCell>{b.verified ? <CheckCircle className="h-5 w-5 text-success" /> : <XCircle className="h-5 w-5 text-muted-foreground" />}</TableCell>
              <TableCell><Button size="sm" variant="outline" onClick={() => toast({ title: `Toggled verification for ${b.name}` })}>{b.verified ? 'Revoke' : 'Verify'}</Button></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
export default AdminBusinesses;
