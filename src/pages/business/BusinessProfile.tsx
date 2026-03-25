import { useAuth } from '@/context/AuthContext';
import { getBusinessByOwner } from '@/data/mock';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ImageUpload } from '@/components/ImageUpload';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

const BusinessProfilePage = () => {
  const { user } = useAuth();
  const biz = getBusinessByOwner(user?.id || '');
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: biz?.name || '', description: biz?.description || '', phone: biz?.phone || '',
    email: biz?.email || '', address: biz?.address || '', logoUrl: biz?.logoUrl || '',
  });

  if (!biz) return <p className="text-muted-foreground">No business profile found.</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-4">Business Profile</h1>
      <Card><CardContent className="p-6 space-y-4">
        <div><Label>Logo</Label><ImageUpload value={form.logoUrl} onChange={v => setForm(p => ({...p, logoUrl: v}))} /></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><Label>Business Name</Label><Input value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} /></div>
          <div><Label>Email</Label><Input value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))} /></div>
          <div><Label>Phone</Label><Input value={form.phone} onChange={e => setForm(p => ({...p, phone: e.target.value}))} /></div>
          <div><Label>Address</Label><Input value={form.address} onChange={e => setForm(p => ({...p, address: e.target.value}))} /></div>
        </div>
        <div><Label>Description</Label><Textarea value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))} rows={4} /></div>
        <Button onClick={() => toast({ title: 'Profile updated!' })}>Save Changes</Button>
      </CardContent></Card>
    </div>
  );
};
export default BusinessProfilePage;
