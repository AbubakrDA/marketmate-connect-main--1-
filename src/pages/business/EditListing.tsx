import { useParams, useNavigate } from 'react-router-dom';
import { getListingById } from '@/data/mock';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

const EditListing = () => {
  const { id } = useParams();
  const listing = getListingById(id || '');
  const navigate = useNavigate();
  const { toast } = useToast();
  const [form, setForm] = useState({
    title: listing?.title || '', description: listing?.description || '',
    priceEgp: listing?.priceEgp?.toString() || '', oldPriceEgp: listing?.oldPriceEgp?.toString() || '',
  });

  if (!listing) return <p className="text-muted-foreground p-4">Listing not found.</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-4">Edit Listing</h1>
      <Card><CardContent className="p-6 space-y-4">
        <div><Label>Title</Label><Input value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))} /></div>
        <div><Label>Description</Label><Textarea value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))} rows={4} /></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><Label>Price (EGP)</Label><Input type="number" value={form.priceEgp} onChange={e => setForm(p => ({...p, priceEgp: e.target.value}))} /></div>
          <div><Label>Old Price (EGP)</Label><Input type="number" value={form.oldPriceEgp} onChange={e => setForm(p => ({...p, oldPriceEgp: e.target.value}))} /></div>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => { toast({ title: 'Listing updated!' }); navigate('/business/listings'); }}>Save</Button>
          <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
        </div>
      </CardContent></Card>
    </div>
  );
};
export default EditListing;
