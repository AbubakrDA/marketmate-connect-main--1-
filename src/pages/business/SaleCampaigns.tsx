import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getBusinessByOwner, getSaleCampaignsByBusiness } from '@/data/mock';
import { SaleCampaignCard } from '@/components/SaleCampaignCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CATEGORIES, SEASONS } from '@/types';
import { PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SaleCampaigns = () => {
  const { user } = useAuth();
  const biz = getBusinessByOwner(user?.id || '');
  const campaigns = biz ? getSaleCampaignsByBusiness(biz.id) : [];
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({ title: 'Sale Campaign Created!', description: 'Your seasonal sale is now live.' });
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Sale Campaigns</h1>
          <p className="text-sm text-muted-foreground">Create seasonal sales and promotions</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-coral text-coral-foreground hover:bg-coral/90">
              <PlusCircle className="mr-2 h-4 w-4" />New Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Create Sale Campaign</DialogTitle></DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div><Label>Title</Label><Input required placeholder="e.g. Winter Health Special" /></div>
              <div><Label>Description</Label><Textarea required rows={3} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Category</Label>
                  <Select required><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select>
                </div>
                <div><Label>Season</Label>
                  <Select required><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{SEASONS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div><Label>Original Price</Label><Input type="number" required /></div>
                <div><Label>Sale Price</Label><Input type="number" required /></div>
                <div><Label>Discount %</Label><Input type="number" required /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Start Date</Label><Input type="date" required /></div>
                <div><Label>End Date</Label><Input type="date" required /></div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-coral text-coral-foreground hover:bg-coral/90">Create Campaign</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {campaigns.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">No sale campaigns yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {campaigns.map(c => <SaleCampaignCard key={c.id} campaign={c} />)}
        </div>
      )}
    </div>
  );
};

export default SaleCampaigns;
