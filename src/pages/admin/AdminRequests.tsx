import { buyerRequests, offers, getUserById, getBusinessById } from '@/data/mock';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Send } from 'lucide-react';

const AdminRequests = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Buyer Requests & Offers</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        <Card><CardContent className="p-5 text-center"><p className="text-3xl font-bold text-foreground">{buyerRequests.length}</p><p className="text-sm text-muted-foreground">Total Requests</p></CardContent></Card>
        <Card><CardContent className="p-5 text-center"><p className="text-3xl font-bold text-foreground">{buyerRequests.filter(r => r.status === 'open').length}</p><p className="text-sm text-muted-foreground">Open Requests</p></CardContent></Card>
        <Card><CardContent className="p-5 text-center"><p className="text-3xl font-bold text-foreground">{offers.length}</p><p className="text-sm text-muted-foreground">Total Offers</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" />All Requests</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Area</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {buyerRequests.map(r => {
                const u = getUserById(r.userId);
                return (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.title}</TableCell>
                    <TableCell>{u?.name}</TableCell>
                    <TableCell><Badge variant="secondary">{r.category}</Badge></TableCell>
                    <TableCell>{r.area}</TableCell>
                    <TableCell><Badge variant="outline">{r.status}</Badge></TableCell>
                    <TableCell>{r.createdAt}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Send className="h-5 w-5" />All Offers</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Offer Title</TableHead>
                <TableHead>Business</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {offers.map(o => {
                const biz = getBusinessById(o.businessId);
                return (
                  <TableRow key={o.id}>
                    <TableCell className="font-medium">{o.offerTitle}</TableCell>
                    <TableCell>{biz?.name}</TableCell>
                    <TableCell>{o.offerPrice.toLocaleString()} EGP</TableCell>
                    <TableCell><Badge variant="outline">{o.status}</Badge></TableCell>
                    <TableCell>{o.createdAt}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminRequests;
