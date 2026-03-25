import { useTranslation } from '@/i18n';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatsCard } from '@/components/StatsCard';
import { getB2BRequests, getBusinessById, b2bOffers, b2bListings } from '@/data/mock';
import { Package, Send, ShoppingCart, Factory } from 'lucide-react';

const AdminB2B = () => {
  const { t } = useTranslation();
  const requests = getB2BRequests();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><Factory className="h-6 w-6 text-primary" />{t('b2b_admin')}</h1>
        <p className="text-muted-foreground">{t('b2b_admin_desc')}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard title={t('b2b_supply_requests')} value={requests.length} icon={ShoppingCart} />
        <StatsCard title={t('b2b_supplier_offers')} value={b2bOffers.length} icon={Send} />
        <StatsCard title={t('b2b_supplier_listings')} value={b2bListings.filter(l => l.status === 'active').length} icon={Package} />
      </div>

      <Tabs defaultValue="requests">
        <TabsList>
          <TabsTrigger value="requests">{t('b2b_supply_requests')}</TabsTrigger>
          <TabsTrigger value="offers">{t('b2b_supplier_offers')}</TabsTrigger>
          <TabsTrigger value="listings">{t('b2b_supplier_listings')}</TabsTrigger>
        </TabsList>

        <TabsContent value="requests">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('title')}</TableHead>
                    <TableHead>Business</TableHead>
                    <TableHead>{t('category')}</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>{t('status')}</TableHead>
                    <TableHead>{t('date')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map(r => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">{r.title}</TableCell>
                      <TableCell>{getBusinessById(r.requesterBusinessId)?.name}</TableCell>
                      <TableCell>{r.category}</TableCell>
                      <TableCell>{r.quantity}</TableCell>
                      <TableCell><Badge>{r.status}</Badge></TableCell>
                      <TableCell>{r.createdAt}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="offers">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Request</TableHead>
                    <TableHead>Price/Unit</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>{t('status')}</TableHead>
                    <TableHead>{t('date')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {b2bOffers.map(o => (
                    <TableRow key={o.id}>
                      <TableCell>{getBusinessById(o.supplierBusinessId)?.name}</TableCell>
                      <TableCell>{requests.find(r => r.id === o.requestId)?.title}</TableCell>
                      <TableCell>{o.pricePerUnit} {t('egp')}</TableCell>
                      <TableCell>{o.totalPrice} {t('egp')}</TableCell>
                      <TableCell><Badge variant={o.status === 'accepted' ? 'default' : 'secondary'}>{o.status}</Badge></TableCell>
                      <TableCell>{o.createdAt}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="listings">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('title')}</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>{t('category')}</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>MOQ</TableHead>
                    <TableHead>{t('status')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {b2bListings.map(l => (
                    <TableRow key={l.id}>
                      <TableCell className="font-medium">{l.title}</TableCell>
                      <TableCell>{getBusinessById(l.supplierBusinessId)?.name}</TableCell>
                      <TableCell>{l.category}</TableCell>
                      <TableCell>{l.unitPrice} {t('egp')}</TableCell>
                      <TableCell>{l.minimumOrderQuantity}</TableCell>
                      <TableCell><Badge>{l.status}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminB2B;
