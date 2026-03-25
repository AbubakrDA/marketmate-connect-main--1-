import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getBusinessByOwner, getWorkflowsByBusiness, getAutomationLogs, addWorkflow, updateWorkflow, deleteWorkflow, AutomationWorkflow, AutomationTrigger, AutomationAction } from '@/data/mock';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Zap, Plus, Trash2, CheckCircle, XCircle, Webhook, Mail, Sheet, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/i18n';

const TRIGGER_LABELS: Record<AutomationTrigger, string> = {
  buyer_request_received: 'Buyer Request Received',
  offer_accepted: 'Offer Accepted',
  new_message: 'New Message',
};

const ACTION_LABELS: Record<AutomationAction, string> = {
  webhook: 'Webhook',
  email: 'Email',
  google_sheet: 'Google Sheet',
  internal_log: 'Internal Log',
};

const ACTION_ICONS: Record<AutomationAction, typeof Webhook> = {
  webhook: Webhook,
  email: Mail,
  google_sheet: Sheet,
  internal_log: FileText,
};

const Automations = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { toast } = useToast();
  const biz = getBusinessByOwner(user?.id || '');
  const [workflows, setWorkflows] = useState(biz ? getWorkflowsByBusiness(biz.id) : []);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', triggerType: '' as string, actionType: '' as string, configKey: '', configValue: '' });

  const logs = getAutomationLogs();
  const bizLogs = logs.filter(l => workflows.some(w => w.id === l.workflowId));

  const handleAdd = () => {
    if (!biz || !form.name || !form.triggerType || !form.actionType) {
      toast({ title: t('fill_required'), variant: 'destructive' });
      return;
    }
    const config: Record<string, string> = {};
    if (form.configKey && form.configValue) config[form.configKey] = form.configValue;
    const wf: AutomationWorkflow = {
      id: `aw${Date.now()}`,
      businessId: biz.id,
      name: form.name,
      triggerType: form.triggerType as AutomationTrigger,
      actionType: form.actionType as AutomationAction,
      configJson: config,
      active: true,
      createdAt: new Date().toISOString(),
    };
    addWorkflow(wf);
    setWorkflows([...getWorkflowsByBusiness(biz.id)]);
    setOpen(false);
    setForm({ name: '', triggerType: '', actionType: '', configKey: '', configValue: '' });
    toast({ title: t('automation_created') });
  };

  const handleToggle = (id: string, active: boolean) => {
    updateWorkflow(id, { active });
    setWorkflows([...getWorkflowsByBusiness(biz!.id)]);
  };

  const handleDelete = (id: string) => {
    deleteWorkflow(id);
    setWorkflows([...getWorkflowsByBusiness(biz!.id)]);
    toast({ title: t('automation_deleted') });
  };

  if (!biz) return <p className="text-muted-foreground">{t('no_business_profile')}</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary" /> {t('automations')}
          </h1>
          <p className="text-muted-foreground">{t('automations_desc')}</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> {t('create_automation')}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{t('create_automation')}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>{t('name')}</Label><Input placeholder="e.g. Notify on new requests" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
              <div><Label>{t('trigger')}</Label>
                <Select value={form.triggerType} onValueChange={v => setForm({ ...form, triggerType: v })}>
                  <SelectTrigger><SelectValue placeholder={t('select_trigger')} /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(TRIGGER_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div><Label>{t('action')}</Label>
                <Select value={form.actionType} onValueChange={v => {
                  const configKey = v === 'webhook' ? 'url' : v === 'email' ? 'to' : v === 'google_sheet' ? 'sheetId' : '';
                  setForm({ ...form, actionType: v, configKey });
                }}>
                  <SelectTrigger><SelectValue placeholder={t('select_action')} /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(ACTION_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              {form.configKey && (
                <div><Label>{form.configKey === 'url' ? 'Webhook URL' : form.configKey === 'to' ? 'Email Address' : 'Sheet ID'}</Label>
                  <Input value={form.configValue} onChange={e => setForm({ ...form, configValue: e.target.value })} placeholder={form.configKey === 'url' ? 'https://...' : form.configKey === 'to' ? 'email@example.com' : 'spreadsheet-id'} />
                </div>
              )}
              <Button className="w-full" onClick={handleAdd}>{t('create_automation')}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="workflows">
        <TabsList>
          <TabsTrigger value="workflows">{t('workflows')} ({workflows.length})</TabsTrigger>
          <TabsTrigger value="logs">{t('execution_logs')} ({bizLogs.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="workflows" className="space-y-3">
          {workflows.length === 0 ? (
            <Card><CardContent className="py-12 text-center text-muted-foreground">{t('no_automations')}</CardContent></Card>
          ) : (
            workflows.map(wf => {
              const ActionIcon = ACTION_ICONS[wf.actionType];
              return (
                <Card key={wf.id}>
                  <CardContent className="flex items-center gap-4 p-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <ActionIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{wf.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {TRIGGER_LABELS[wf.triggerType]} → {ACTION_LABELS[wf.actionType]}
                        {Object.values(wf.configJson).length > 0 && ` (${Object.values(wf.configJson)[0]})`}
                      </p>
                    </div>
                    <Switch checked={wf.active} onCheckedChange={v => handleToggle(wf.id, v)} />
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(wf.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('trigger')}</TableHead>
                    <TableHead>{t('result')}</TableHead>
                    <TableHead>{t('details')}</TableHead>
                    <TableHead>{t('time')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bizLogs.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map(log => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.triggerEvent}</TableCell>
                      <TableCell>
                        {log.actionResult === 'success' ? (
                          <Badge className="bg-green-100 text-green-800"><CheckCircle className="mr-1 h-3 w-3" /> Success</Badge>
                        ) : (
                          <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3" /> Failed</Badge>
                        )}
                      </TableCell>
                      <TableCell className="max-w-xs truncate text-sm text-muted-foreground">{log.details}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{new Date(log.createdAt).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                  {bizLogs.length === 0 && (
                    <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">{t('no_logs_yet')}</TableCell></TableRow>
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

export default Automations;
