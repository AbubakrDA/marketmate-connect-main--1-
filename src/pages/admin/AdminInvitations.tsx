import { useState } from 'react';
import { getInvitations, getInvitationStats, getDirectoryBusinesses, getOpenBuyerRequests, sendInvitationsForRequest, DirectoryBusiness } from '@/data/mock';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StatsCard } from '@/components/StatsCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Send, Mail, MailOpen, UserCheck, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/i18n';

const statusColor: Record<string, string> = {
  sent: 'bg-blue-100 text-blue-800',
  opened: 'bg-yellow-100 text-yellow-800',
  joined: 'bg-green-100 text-green-800',
};

const AdminInvitations = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [invitations, setInvitations] = useState(getInvitations());
  const [stats, setStats] = useState(getInvitationStats());
  const [selectedRequest, setSelectedRequest] = useState('');
  const openRequests = getOpenBuyerRequests();
  const directory = getDirectoryBusinesses();

  const getDirName = (id: string) => directory.find(d => d.id === id)?.name || id;

  const handleSend = () => {
    if (!selectedRequest) return;
    const newInvs = sendInvitationsForRequest(selectedRequest);
    setInvitations([...getInvitations()]);
    setStats(getInvitationStats());
    toast({ title: t('invitations_sent'), description: `${newInvs.length} new invitations sent` });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
        <Mail className="h-6 w-6" /> {t('invitation_campaigns')}
      </h1>

      <div className="grid gap-4 sm:grid-cols-4">
        <StatsCard title={t('total_invitations')} value={stats.total} icon={Send} />
        <StatsCard title={t('inv_sent')} value={stats.sent} icon={Mail} />
        <StatsCard title={t('inv_opened')} value={stats.opened} icon={MailOpen} />
        <StatsCard title={t('inv_joined')} value={stats.joined} icon={UserCheck} />
      </div>

      <Tabs defaultValue="send">
        <TabsList>
          <TabsTrigger value="send">{t('send_invitations')}</TabsTrigger>
          <TabsTrigger value="history">{t('invitation_history')}</TabsTrigger>
        </TabsList>

        <TabsContent value="send">
          <Card>
            <CardHeader><CardTitle>{t('send_invitations_for_request')}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{t('send_invitations_desc')}</p>
              <div className="flex gap-3">
                <Select value={selectedRequest} onValueChange={setSelectedRequest}>
                  <SelectTrigger className="flex-1"><SelectValue placeholder={t('select_request')} /></SelectTrigger>
                  <SelectContent>
                    {openRequests.map(r => (
                      <SelectItem key={r.id} value={r.id}>{r.title} — {r.category}, {r.area}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleSend} disabled={!selectedRequest}>
                  <Send className="mr-2 h-4 w-4" /> {t('send_now')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('business_name')}</TableHead>
                    <TableHead>{t('message')}</TableHead>
                    <TableHead>{t('status')}</TableHead>
                    <TableHead>{t('sent_date')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invitations.map(inv => (
                    <TableRow key={inv.id}>
                      <TableCell className="font-medium">{getDirName(inv.directoryBusinessId)}</TableCell>
                      <TableCell className="max-w-xs truncate text-sm text-muted-foreground">{inv.message}</TableCell>
                      <TableCell><Badge className={statusColor[inv.status]}>{inv.status}</Badge></TableCell>
                      <TableCell className="text-sm">{inv.sentAt}</TableCell>
                    </TableRow>
                  ))}
                  {invitations.length === 0 && (
                    <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">{t('no_invitations_yet')}</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminInvitations;
