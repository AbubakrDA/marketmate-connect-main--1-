import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getBusinessByOwner, getLeadsByBusiness, getListingById } from '@/data/mock';
import { Lead } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/i18n';
import {
  Inbox, Mail, Phone, User, FileText, Clock, Eye, ChevronRight,
  MessageSquare, CheckCircle, AlertCircle
} from 'lucide-react';

const statusConfig: Record<string, { color: string; bgColor: string }> = {
  new: { color: 'text-info', bgColor: 'bg-info/10' },
  contacted: { color: 'text-gold', bgColor: 'bg-gold/10' },
  won: { color: 'text-success', bgColor: 'bg-success/10' },
  lost: { color: 'text-destructive', bgColor: 'bg-destructive/10' },
};

const LeadsInbox = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const biz = getBusinessByOwner(user?.id || '');
  const bLeads = biz ? getLeadsByBusiness(biz.id) : [];
  const { toast } = useToast();
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredLeads = filterStatus === 'all'
    ? bLeads
    : bLeads.filter(l => l.status === filterStatus);

  const stats = {
    total: bLeads.length,
    new: bLeads.filter(l => l.status === 'new').length,
    contacted: bLeads.filter(l => l.status === 'contacted').length,
    won: bLeads.filter(l => l.status === 'won').length,
    lost: bLeads.filter(l => l.status === 'lost').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t('leads')} ({bLeads.length})</h1>
        <p className="text-sm text-muted-foreground">Manage inquiries from potential customers</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card><CardContent className="p-3 text-center"><p className="text-2xl font-bold text-foreground">{stats.total}</p><p className="text-[10px] text-muted-foreground">Total</p></CardContent></Card>
        <Card className="border-info/20"><CardContent className="p-3 text-center"><p className="text-2xl font-bold text-info">{stats.new}</p><p className="text-[10px] text-muted-foreground">{t('new')}</p></CardContent></Card>
        <Card className="border-gold/20"><CardContent className="p-3 text-center"><p className="text-2xl font-bold text-gold">{stats.contacted}</p><p className="text-[10px] text-muted-foreground">{t('contacted')}</p></CardContent></Card>
        <Card className="border-success/20"><CardContent className="p-3 text-center"><p className="text-2xl font-bold text-success">{stats.won}</p><p className="text-[10px] text-muted-foreground">{t('won')}</p></CardContent></Card>
        <Card className="border-destructive/20"><CardContent className="p-3 text-center"><p className="text-2xl font-bold text-destructive">{stats.lost}</p><p className="text-[10px] text-muted-foreground">{t('lost')}</p></CardContent></Card>
      </div>

      {/* Filter */}
      <Tabs value={filterStatus} onValueChange={setFilterStatus}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="new">{t('new')}</TabsTrigger>
          <TabsTrigger value="contacted">{t('contacted')}</TabsTrigger>
          <TabsTrigger value="won">{t('won')}</TabsTrigger>
          <TabsTrigger value="lost">{t('lost')}</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Leads List */}
      {filteredLeads.length === 0 ? (
        <div className="py-12 text-center">
          <Inbox className="mx-auto h-12 w-12 text-muted-foreground/30 mb-3" />
          <p className="text-muted-foreground">No leads found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredLeads.map(lead => {
            const listing = getListingById(lead.listingId);
            const cfg = statusConfig[lead.status];
            return (
              <Card
                key={lead.id}
                className="cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5"
                onClick={() => { setSelectedLead(lead); setDetailOpen(true); }}
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${cfg.bgColor}`}>
                      <User className={`h-5 w-5 ${cfg.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-foreground">{lead.name}</h3>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            Re: <span className="text-foreground">{listing?.title || 'N/A'}</span>
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge className={`${cfg.bgColor} ${cfg.color}`}>{lead.status}</Badge>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-1">{lead.message}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{lead.email}</span>
                        <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{lead.phone}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{lead.createdAt}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />Lead Details
            </DialogTitle>
          </DialogHeader>
          {selectedLead && (() => {
            const listing = getListingById(selectedLead.listingId);
            return (
              <div className="space-y-5">
                {/* Contact */}
                <Card className="bg-muted/30">
                  <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><User className="h-4 w-4 text-info" />Contact Info</CardTitle></CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p><span className="text-muted-foreground">Name:</span> <span className="font-medium text-foreground">{selectedLead.name}</span></p>
                    <p className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-muted-foreground" />{selectedLead.email}</p>
                    <p className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-muted-foreground" />{selectedLead.phone}</p>
                  </CardContent>
                </Card>

                {/* Message */}
                <div>
                  <p className="text-sm font-medium text-foreground mb-1 flex items-center gap-2"><MessageSquare className="h-4 w-4" />{t('message')}</p>
                  <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">{selectedLead.message}</p>
                </div>

                {/* Related Listing */}
                {listing && (
                  <Card className="bg-muted/30">
                    <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><FileText className="h-4 w-4 text-coral" />Related Listing</CardTitle></CardHeader>
                    <CardContent className="flex items-center gap-3">
                      <img src={listing.imageUrl} alt={listing.title} className="h-14 w-14 rounded-lg object-cover" />
                      <div>
                        <p className="font-medium text-foreground">{listing.title}</p>
                        <p className="text-sm text-muted-foreground">{listing.priceEgp.toLocaleString()} {t('egp')} · {listing.category}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Status Update */}
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Update Status</p>
                  <Select defaultValue={selectedLead.status} onValueChange={() => toast({ title: 'Status updated!' })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">{t('new')}</SelectItem>
                      <SelectItem value="contacted">{t('contacted')}</SelectItem>
                      <SelectItem value="won">{t('won')}</SelectItem>
                      <SelectItem value="lost">{t('lost')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />Received on {selectedLead.createdAt}</p>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeadsInbox;
