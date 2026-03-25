import { useState, useMemo, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getBusinessByOwner, getAdsByBusiness, adCampaigns } from '@/data/mock';
import { AdCampaign, AdStatus, AdContentType } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  PlusCircle, Pause, Play, Trash2, Pencil, TrendingUp, Eye, MousePointer,
  DollarSign, BarChart3, Image, Video, Type, Upload, X, ExternalLink
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdsManager = () => {
  const { user } = useAuth();
  const biz = getBusinessByOwner(user?.id || '');
  const { toast } = useToast();

  const [campaigns, setCampaigns] = useState<AdCampaign[]>(() =>
    biz ? getAdsByBusiness(biz.id) : []
  );
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<AdCampaign | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formBudget, setFormBudget] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formContentType, setFormContentType] = useState<AdContentType>('image');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formVideoUrl, setFormVideoUrl] = useState('');
  const [formCallToAction, setFormCallToAction] = useState('Learn More');
  const [formLinkUrl, setFormLinkUrl] = useState('');
  const imageInputRef = useRef<HTMLInputElement>(null);

  const filteredCampaigns = useMemo(() =>
    filterStatus === 'all' ? campaigns : campaigns.filter(c => c.status === filterStatus),
    [campaigns, filterStatus]
  );

  const stats = useMemo(() => ({
    totalBudget: campaigns.reduce((s, c) => s + c.budgetEgp, 0),
    totalImpressions: campaigns.reduce((s, c) => s + c.impressions, 0),
    totalClicks: campaigns.reduce((s, c) => s + c.clicks, 0),
    activeCampaigns: campaigns.filter(c => c.status === 'active').length,
    avgCtr: campaigns.length > 0
      ? (campaigns.reduce((s, c) => s + (c.impressions > 0 ? (c.clicks / c.impressions) * 100 : 0), 0) / campaigns.length).toFixed(1)
      : '0',
  }), [campaigns]);

  const resetForm = () => {
    setFormTitle('');
    setFormBudget('');
    setFormDescription('');
    setFormContentType('image');
    setFormImageUrl('');
    setFormVideoUrl('');
    setFormCallToAction('Learn More');
    setFormLinkUrl('');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setFormImageUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleCreate = () => {
    if (!formTitle.trim() || !formBudget.trim()) {
      toast({ title: 'Please fill in title and budget', variant: 'destructive' });
      return;
    }
    if (formContentType === 'image' && !formImageUrl) {
      toast({ title: 'Please upload an image for your ad', variant: 'destructive' });
      return;
    }
    if (formContentType === 'video' && !formVideoUrl) {
      toast({ title: 'Please provide a video URL', variant: 'destructive' });
      return;
    }
    const newCampaign: AdCampaign = {
      id: `ad${Date.now()}`,
      businessId: biz?.id || '',
      title: formTitle.trim(),
      budgetEgp: Number(formBudget),
      status: 'active',
      impressions: 0,
      clicks: 0,
      createdAt: new Date().toISOString().split('T')[0],
      contentType: formContentType,
      description: formDescription,
      imageUrl: formImageUrl,
      videoUrl: formVideoUrl,
      callToAction: formCallToAction,
      linkUrl: formLinkUrl,
    };
    setCampaigns(prev => [newCampaign, ...prev]);
    adCampaigns.push(newCampaign);
    toast({ title: 'Campaign created successfully!' });
    resetForm();
    setCreateOpen(false);
  };

  const handleEdit = () => {
    if (!selectedCampaign || !formTitle.trim() || !formBudget.trim()) {
      toast({ title: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }
    setCampaigns(prev => prev.map(c =>
      c.id === selectedCampaign.id
        ? {
            ...c, title: formTitle.trim(), budgetEgp: Number(formBudget),
            description: formDescription, contentType: formContentType,
            imageUrl: formImageUrl, videoUrl: formVideoUrl,
            callToAction: formCallToAction, linkUrl: formLinkUrl,
          }
        : c
    ));
    toast({ title: 'Campaign updated successfully!' });
    resetForm();
    setEditOpen(false);
    setSelectedCampaign(null);
  };

  const handleToggleStatus = (campaign: AdCampaign) => {
    const newStatus: AdStatus = campaign.status === 'active' ? 'paused' : 'active';
    setCampaigns(prev => prev.map(c =>
      c.id === campaign.id ? { ...c, status: newStatus } : c
    ));
    toast({ title: `Campaign ${newStatus === 'active' ? 'resumed' : 'paused'}` });
  };

  const handleDelete = () => {
    if (!selectedCampaign) return;
    setCampaigns(prev => prev.filter(c => c.id !== selectedCampaign.id));
    toast({ title: 'Campaign deleted' });
    setDeleteOpen(false);
    setSelectedCampaign(null);
  };

  const openEdit = (campaign: AdCampaign) => {
    setSelectedCampaign(campaign);
    setFormTitle(campaign.title);
    setFormBudget(String(campaign.budgetEgp));
    setFormDescription(campaign.description || '');
    setFormContentType(campaign.contentType || 'text');
    setFormImageUrl(campaign.imageUrl || '');
    setFormVideoUrl(campaign.videoUrl || '');
    setFormCallToAction(campaign.callToAction || 'Learn More');
    setFormLinkUrl(campaign.linkUrl || '');
    setEditOpen(true);
  };

  const openPreview = (campaign: AdCampaign) => {
    setSelectedCampaign(campaign);
    setPreviewOpen(true);
  };

  const statusBadgeVariant = (status: AdStatus) => {
    switch (status) {
      case 'active': return 'default' as const;
      case 'paused': return 'secondary' as const;
      case 'ended': return 'outline' as const;
    }
  };

  const contentTypeIcon = (type?: AdContentType) => {
    switch (type) {
      case 'image': return <Image className="h-3.5 w-3.5" />;
      case 'video': return <Video className="h-3.5 w-3.5" />;
      default: return <Type className="h-3.5 w-3.5" />;
    }
  };

  /* Shared media form section */
  const MediaFormSection = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Content Type</Label>
        <Tabs value={formContentType} onValueChange={v => setFormContentType(v as AdContentType)} className="w-full">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="image" className="gap-1.5"><Image className="h-4 w-4" /> Image</TabsTrigger>
            <TabsTrigger value="video" className="gap-1.5"><Video className="h-4 w-4" /> Video</TabsTrigger>
            <TabsTrigger value="text" className="gap-1.5"><Type className="h-4 w-4" /> Text Only</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {formContentType === 'image' && (
        <div className="space-y-2">
          <Label>Ad Image *</Label>
          {formImageUrl ? (
            <div className="relative rounded-lg overflow-hidden border border-border">
              <img src={formImageUrl} alt="Ad preview" className="w-full h-48 object-cover" />
              <Button
                variant="destructive" size="icon"
                className="absolute top-2 right-2 h-7 w-7"
                onClick={() => setFormImageUrl('')}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              className="flex h-48 w-full items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <div className="text-center">
                <Upload className="mx-auto mb-2 h-8 w-8" />
                <span className="text-sm font-medium">Upload poster or image</span>
                <span className="block text-xs mt-1">JPG, PNG — recommended 1200×628</span>
              </div>
            </button>
          )}
          <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        </div>
      )}

      {formContentType === 'video' && (
        <div className="space-y-2">
          <Label>Video URL *</Label>
          <Input
            value={formVideoUrl}
            onChange={e => setFormVideoUrl(e.target.value)}
            placeholder="https://youtube.com/watch?v=... or direct video URL"
          />
          {formVideoUrl && (
            <div className="rounded-lg overflow-hidden border border-border bg-muted/30 p-4 text-center">
              <Video className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-xs text-muted-foreground truncate">{formVideoUrl}</p>
            </div>
          )}
        </div>
      )}

      {formContentType === 'text' && (
        <div className="rounded-lg border border-border bg-muted/30 p-4 text-center">
          <Type className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">Text-only ad — your title and description will be displayed as sponsored content</p>
        </div>
      )}
    </div>
  );

  /* Ad Preview Card */
  const AdPreviewCard = ({ campaign }: { campaign: AdCampaign }) => (
    <div className="max-w-md mx-auto rounded-xl border border-border bg-card overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 p-3 pb-2">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
          {biz?.name?.charAt(0) || 'B'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-foreground truncate">{biz?.name || 'Business'}</p>
          <p className="text-xs text-muted-foreground">Sponsored · {campaign.createdAt}</p>
        </div>
      </div>
      {/* Body text */}
      {(campaign.description || campaign.title) && (
        <div className="px-3 pb-2">
          <p className="text-sm text-foreground">{campaign.description || campaign.title}</p>
        </div>
      )}
      {/* Media */}
      {campaign.contentType === 'image' && campaign.imageUrl && (
        <img src={campaign.imageUrl} alt={campaign.title} className="w-full aspect-video object-cover" />
      )}
      {campaign.contentType === 'video' && campaign.videoUrl && (
        <div className="w-full aspect-video bg-muted flex items-center justify-center relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="h-14 w-14 rounded-full bg-card/90 flex items-center justify-center z-10">
            <Play className="h-6 w-6 text-primary ml-0.5" />
          </div>
        </div>
      )}
      {/* CTA bar */}
      <div className="flex items-center justify-between border-t border-border px-3 py-2.5">
        <div className="min-w-0 flex-1">
          <p className="text-xs text-muted-foreground truncate uppercase tracking-wide">{biz?.category || 'Business'}</p>
          <p className="font-semibold text-sm text-foreground truncate">{campaign.title}</p>
        </div>
        <Button size="sm" className="ml-3 shrink-0">
          {campaign.callToAction || 'Learn More'}
        </Button>
      </div>
      {/* Engagement row */}
      <div className="flex items-center gap-6 px-3 py-2 border-t border-border text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{campaign.impressions.toLocaleString()}</span>
        <span className="flex items-center gap-1"><MousePointer className="h-3 w-3" />{campaign.clicks.toLocaleString()}</span>
        <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3" />{campaign.impressions > 0 ? ((campaign.clicks / campaign.impressions) * 100).toFixed(1) : '0'}% CTR</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Ads Manager</h1>
          <p className="text-sm text-muted-foreground">Create and manage your advertising campaigns</p>
        </div>
        <Dialog open={createOpen} onOpenChange={(o) => { setCreateOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild>
            <Button><PlusCircle className="mr-2 h-4 w-4" /> Create Ad</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Create New Ad</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Ad Title *</Label>
                <Input value={formTitle} onChange={e => setFormTitle(e.target.value)} placeholder="e.g. Summer Collection Launch" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={formDescription} onChange={e => setFormDescription(e.target.value)} placeholder="Write something about your ad..." rows={3} />
              </div>

              <MediaFormSection />

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Call to Action</Label>
                  <Select value={formCallToAction} onValueChange={setFormCallToAction}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Learn More">Learn More</SelectItem>
                      <SelectItem value="Shop Now">Shop Now</SelectItem>
                      <SelectItem value="Book Now">Book Now</SelectItem>
                      <SelectItem value="Contact Us">Contact Us</SelectItem>
                      <SelectItem value="Get Offer">Get Offer</SelectItem>
                      <SelectItem value="Sign Up">Sign Up</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Budget (EGP) *</Label>
                  <Input type="number" min="100" value={formBudget} onChange={e => setFormBudget(e.target.value)} placeholder="5000" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Link URL (optional)</Label>
                <Input value={formLinkUrl} onChange={e => setFormLinkUrl(e.target.value)} placeholder="https://your-website.com/landing" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { resetForm(); setCreateOpen(false); }}>Cancel</Button>
              <Button onClick={handleCreate}>Publish Ad</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2.5"><BarChart3 className="h-5 w-5 text-primary" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Active Ads</p>
              <p className="text-xl font-bold text-foreground">{stats.activeCampaigns}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2.5"><DollarSign className="h-5 w-5 text-primary" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Total Budget</p>
              <p className="text-xl font-bold text-foreground">{stats.totalBudget.toLocaleString()} EGP</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2.5"><Eye className="h-5 w-5 text-primary" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Impressions</p>
              <p className="text-xl font-bold text-foreground">{stats.totalImpressions.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2.5"><MousePointer className="h-5 w-5 text-primary" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Avg. CTR</p>
              <p className="text-xl font-bold text-foreground">{stats.avgCtr}%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Cards Grid */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-foreground">Your Ads</h2>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="ended">Ended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredCampaigns.length === 0 ? (
        <Card>
          <CardContent className="text-center py-16">
            <BarChart3 className="mx-auto h-12 w-12 mb-3 text-muted-foreground/40" />
            <p className="font-medium text-foreground">No ads yet</p>
            <p className="text-sm text-muted-foreground mt-1">Create your first ad to start reaching customers</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCampaigns.map(ad => {
            const ctr = ad.impressions > 0 ? ((ad.clicks / ad.impressions) * 100).toFixed(1) : '0.0';
            return (
              <Card key={ad.id} className="overflow-hidden group transition-all hover:shadow-md">
                {/* Media preview */}
                {ad.contentType === 'image' && ad.imageUrl ? (
                  <div className="aspect-video overflow-hidden bg-muted">
                    <img src={ad.imageUrl} alt={ad.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                  </div>
                ) : ad.contentType === 'video' ? (
                  <div className="aspect-video bg-muted flex items-center justify-center relative">
                    <div className="h-12 w-12 rounded-full bg-card/80 flex items-center justify-center">
                      <Play className="h-5 w-5 text-primary ml-0.5" />
                    </div>
                  </div>
                ) : (
                  <div className="h-20 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                    <Type className="h-8 w-8 text-primary/40" />
                  </div>
                )}
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-foreground truncate">{ad.title}</h3>
                      {ad.description && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{ad.description}</p>}
                    </div>
                    <Badge variant={statusBadgeVariant(ad.status)} className="shrink-0">{ad.status}</Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">{contentTypeIcon(ad.contentType)}{ad.contentType || 'text'}</span>
                    <span>·</span>
                    <span>{ad.budgetEgp.toLocaleString()} EGP</span>
                    <span>·</span>
                    <span>{ad.createdAt}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1 border-t border-border">
                    <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{ad.impressions.toLocaleString()}</span>
                    <span className="flex items-center gap-1"><MousePointer className="h-3 w-3" />{ad.clicks.toLocaleString()}</span>
                    <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3" />{ctr}%</span>
                  </div>
                  <div className="flex items-center gap-1 pt-1">
                    <Button variant="ghost" size="sm" onClick={() => openPreview(ad)} className="text-xs"><Eye className="h-3.5 w-3.5 mr-1" />Preview</Button>
                    <Button variant="ghost" size="sm" onClick={() => handleToggleStatus(ad)} className="text-xs">
                      {ad.status === 'active' ? <><Pause className="h-3.5 w-3.5 mr-1" />Pause</> : <><Play className="h-3.5 w-3.5 mr-1" />Resume</>}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => openEdit(ad)} className="text-xs"><Pencil className="h-3.5 w-3.5 mr-1" />Edit</Button>
                    <Button variant="ghost" size="sm" onClick={() => { setSelectedCampaign(ad); setDeleteOpen(true); }} className="text-xs text-destructive hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={(o) => { setPreviewOpen(o); if (!o) setSelectedCampaign(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Ad Preview</DialogTitle></DialogHeader>
          {selectedCampaign && <AdPreviewCard campaign={selectedCampaign} />}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={(o) => { setEditOpen(o); if (!o) { resetForm(); setSelectedCampaign(null); } }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Edit Ad</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Ad Title *</Label>
              <Input value={formTitle} onChange={e => setFormTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={formDescription} onChange={e => setFormDescription(e.target.value)} rows={3} />
            </div>
            <MediaFormSection />
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Call to Action</Label>
                <Select value={formCallToAction} onValueChange={setFormCallToAction}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Learn More">Learn More</SelectItem>
                    <SelectItem value="Shop Now">Shop Now</SelectItem>
                    <SelectItem value="Book Now">Book Now</SelectItem>
                    <SelectItem value="Contact Us">Contact Us</SelectItem>
                    <SelectItem value="Get Offer">Get Offer</SelectItem>
                    <SelectItem value="Sign Up">Sign Up</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Budget (EGP) *</Label>
                <Input type="number" min="100" value={formBudget} onChange={e => setFormBudget(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Link URL</Label>
              <Input value={formLinkUrl} onChange={e => setFormLinkUrl(e.target.value)} placeholder="https://..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { resetForm(); setEditOpen(false); setSelectedCampaign(null); }}>Cancel</Button>
            <Button onClick={handleEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteOpen} onOpenChange={(o) => { setDeleteOpen(o); if (!o) setSelectedCampaign(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete Ad</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete <span className="font-medium text-foreground">"{selectedCampaign?.title}"</span>? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setDeleteOpen(false); setSelectedCampaign(null); }}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdsManager;
