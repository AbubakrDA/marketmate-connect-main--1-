import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getDealHuntersByUser } from '@/data/mock';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CATEGORIES, AREAS } from '@/types';
import { Search, PlusCircle, MapPin, DollarSign, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const DealHunters = () => {
  const { user } = useAuth();
  const hunters = getDealHuntersByUser(user?.id || '');
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({ title: 'Deal Hunter Created!', description: 'You\'ll be notified when matching deals appear.' });
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Deal Hunters</h1>
          <p className="text-sm text-muted-foreground">Auto-search for deals matching your criteria</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><PlusCircle className="mr-2 h-4 w-4" />New Deal Hunter</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Deal Hunter</DialogTitle></DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div><Label>Label</Label><Input required placeholder="e.g. Affordable Dentist" /></div>
              <div><Label>Category</Label>
                <Select required>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Area</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Any area" /></SelectTrigger>
                  <SelectContent>{AREAS.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Min Price</Label><Input type="number" placeholder="0" /></div>
                <div><Label>Max Price</Label><Input type="number" placeholder="0" /></div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit">Create</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {hunters.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">No deal hunters yet.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {hunters.map(h => (
            <Card key={h.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-coral" />
                    <h3 className="font-semibold text-foreground">{h.label}</h3>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <Badge variant="secondary">{h.category}</Badge>
                  {h.area && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{h.area}</span>}
                  {(h.minPrice || h.maxPrice) && (
                    <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />{h.minPrice?.toLocaleString()} – {h.maxPrice?.toLocaleString()} EGP</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DealHunters;
