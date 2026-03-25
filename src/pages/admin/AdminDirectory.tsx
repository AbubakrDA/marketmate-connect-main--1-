import { useState } from 'react';
import { getDirectoryBusinesses, addDirectoryBusiness, DirectoryBusiness } from '@/data/mock';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CATEGORIES, CITIES, AREAS } from '@/types';
import { Building2, Plus, Search, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/i18n';

const AdminDirectory = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [items, setItems] = useState(getDirectoryBusinesses());
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', category: '', subCategory: '', city: '', area: '', phone: '', email: '', source: '' });

  const filtered = items.filter(b => {
    if (search && !b.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (catFilter && b.category !== catFilter) return false;
    return true;
  });

  const handleAdd = () => {
    if (!form.name || !form.category || !form.email) {
      toast({ title: t('fill_required'), variant: 'destructive' });
      return;
    }
    const newBiz: DirectoryBusiness = {
      id: `db${Date.now()}`,
      ...form,
      isRegistered: false,
      createdAt: new Date().toISOString(),
    };
    addDirectoryBusiness(newBiz);
    setItems([...getDirectoryBusinesses()]);
    setOpen(false);
    setForm({ name: '', category: '', subCategory: '', city: '', area: '', phone: '', email: '', source: '' });
    toast({ title: t('directory_business_added') });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Building2 className="h-6 w-6" /> {t('business_directory')}
          </h1>
          <p className="text-muted-foreground">{t('business_directory_desc')}</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> {t('add_business')}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{t('add_directory_business')}</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>{t('business_name')}</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
              <div><Label>{t('category')}</Label>
                <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue placeholder={t('select_category')} /></SelectTrigger>
                  <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div><Label>{t('city')}</Label>
                  <Select value={form.city} onValueChange={v => setForm({ ...form, city: v })}>
                    <SelectTrigger><SelectValue placeholder={t('city')} /></SelectTrigger>
                    <SelectContent>{CITIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>{t('area')}</Label>
                  <Select value={form.area} onValueChange={v => setForm({ ...form, area: v })}>
                    <SelectTrigger><SelectValue placeholder={t('area')} /></SelectTrigger>
                    <SelectContent>{AREAS.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div><Label>{t('email')}</Label><Input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
              <div><Label>{t('phone')}</Label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
              <div><Label>Source</Label><Input placeholder="e.g. Google Maps" value={form.source} onChange={e => setForm({ ...form, source: e.target.value })} /></div>
              <Button className="w-full" onClick={handleAdd}>{t('add_business')}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder={t('search_businesses')} value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={catFilter} onValueChange={v => setCatFilter(v === 'all' ? '' : v)}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder={t('category')} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('all_categories')}</SelectItem>
            {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('business_name')}</TableHead>
                <TableHead>{t('category')}</TableHead>
                <TableHead>{t('area')}</TableHead>
                <TableHead>{t('email')}</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>{t('status')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(b => (
                <TableRow key={b.id}>
                  <TableCell className="font-medium">{b.name}</TableCell>
                  <TableCell>{b.category}</TableCell>
                  <TableCell>{b.area}, {b.city}</TableCell>
                  <TableCell>{b.email}</TableCell>
                  <TableCell><Badge variant="outline">{b.source}</Badge></TableCell>
                  <TableCell>
                    {b.isRegistered ? (
                      <Badge className="bg-green-100 text-green-800"><CheckCircle className="mr-1 h-3 w-3" /> Registered</Badge>
                    ) : (
                      <Badge variant="secondary"><XCircle className="mr-1 h-3 w-3" /> Not Registered</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDirectory;
