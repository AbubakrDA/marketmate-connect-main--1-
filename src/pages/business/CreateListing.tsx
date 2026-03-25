import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageUpload } from '@/components/ImageUpload';
import { CATEGORIES, SUBCATEGORIES, AREAS, CITIES } from '@/types';
import { useToast } from '@/hooks/use-toast';

const CreateListing = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [form, setForm] = useState({ title: '', description: '', category: '', subCategory: '', area: '', city: '', priceEgp: '', oldPriceEgp: '', imageUrl: '', videoUrl: '' });
  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const dealLabel = form.oldPriceEgp && form.priceEgp && Number(form.oldPriceEgp) > Number(form.priceEgp)
    ? `${Math.round((1 - Number(form.priceEgp) / Number(form.oldPriceEgp)) * 100)}% Off` : '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: 'Listing created successfully!' });
    navigate('/business/listings');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-4">Create Listing</h1>
      <Card><CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><Label>Title</Label><Input value={form.title} onChange={e => set('title', e.target.value)} required /></div>
          <div><Label>Description</Label><Textarea value={form.description} onChange={e => set('description', e.target.value)} rows={4} required /></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label>Category</Label>
              <Select value={form.category} onValueChange={v => { set('category', v); set('subCategory', ''); }}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Sub-Category</Label>
              <Select value={form.subCategory} onValueChange={v => set('subCategory', v)}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{(SUBCATEGORIES[form.category] || []).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Area</Label><Select value={form.area} onValueChange={v => set('area', v)}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{AREAS.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent></Select></div>
            <div><Label>City</Label><Select value={form.city} onValueChange={v => set('city', v)}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{CITIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div>
            <div><Label>Price (EGP)</Label><Input type="number" value={form.priceEgp} onChange={e => set('priceEgp', e.target.value)} required /></div>
            <div><Label>Old Price (EGP)</Label><Input type="number" value={form.oldPriceEgp} onChange={e => set('oldPriceEgp', e.target.value)} />{dealLabel && <p className="text-xs text-coral mt-1">Deal: {dealLabel}</p>}</div>
          </div>
          <div><Label>Cover Image</Label><ImageUpload value={form.imageUrl} onChange={v => set('imageUrl', v)} /></div>
          <div><Label>Video URL (optional)</Label><Input value={form.videoUrl} onChange={e => set('videoUrl', e.target.value)} placeholder="https://youtube.com/..." /></div>
          <div className="flex gap-3"><Button type="submit">Create Listing</Button><Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button></div>
        </form>
      </CardContent></Card>
    </div>
  );
};
export default CreateListing;
