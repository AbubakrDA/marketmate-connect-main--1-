import { useParams, Link } from 'react-router-dom';
import { useTranslation } from '@/i18n';
import { useAuth } from '@/context/AuthContext';
import { getGroupDealById, getBusinessById, getGroupDealParticipants, hasUserJoinedDeal, joinGroupDeal, getUserById } from '@/data/mock';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Users, Clock, Tag, MapPin, CheckCircle2, Building2 } from 'lucide-react';
import { useState } from 'react';

const GroupDealDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setRefresh] = useState(0);

  const deal = getGroupDealById(id || '');
  if (!deal) return <div className="container mx-auto p-8 text-center text-muted-foreground">{t('listing_not_found')}</div>;

  const biz = getBusinessById(deal.businessId);
  const participants = getGroupDealParticipants(deal.id);
  const pct = Math.round((deal.currentParticipants / deal.requiredParticipants) * 100);
  const remaining = deal.requiredParticipants - deal.currentParticipants;
  const discount = Math.round(((deal.originalPrice - deal.dealPrice) / deal.originalPrice) * 100);
  const daysLeft = Math.max(0, Math.ceil((new Date(deal.endDate).getTime() - Date.now()) / 86400000));
  const alreadyJoined = user ? hasUserJoinedDeal(deal.id, user.id) : false;

  const handleJoin = () => {
    if (!user) { toast({ title: t('login'), description: 'Please log in to join this deal.' }); return; }
    const result = joinGroupDeal(deal.id, user.id);
    toast({ title: result.success ? '✅' : '⚠️', description: result.message });
    setRefresh(r => r + 1);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Link to="/group-deals" className="text-sm text-primary hover:underline mb-4 inline-block">← {t('group_deals')}</Link>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between flex-wrap gap-2">
            <div>
              <Badge className="bg-coral text-coral-foreground mb-2">{discount}% {t('off')}</Badge>
              {deal.status === 'completed' && <Badge className="bg-success text-success-foreground ml-2">🎉 Unlocked!</Badge>}
              <CardTitle className="text-2xl">{deal.title}</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">{deal.description}</p>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border p-4 text-center">
              <p className="text-sm text-muted-foreground">{t('original_price')}</p>
              <p className="text-xl font-bold text-muted-foreground line-through">{deal.originalPrice} {t('egp')}</p>
            </div>
            <div className="rounded-lg border border-coral/30 bg-coral/5 p-4 text-center">
              <p className="text-sm text-muted-foreground">{t('group_price')}</p>
              <p className="text-xl font-bold text-foreground">{deal.dealPrice} {t('egp')}</p>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="flex items-center gap-1 text-muted-foreground"><Users className="h-4 w-4" />{deal.currentParticipants} / {deal.requiredParticipants} {t('participants')}</span>
              <span className="font-medium text-foreground">{pct}%</span>
            </div>
            <Progress value={pct} className="h-3" />
            {deal.status === 'active' && remaining > 0 && (
              <p className="text-sm text-muted-foreground mt-1">
                {remaining <= 3 ? `🔥 Only ${remaining} more needed!` : `${remaining} more needed to unlock`}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{deal.area}, {deal.city}</span>
            <span className="flex items-center gap-1"><Tag className="h-4 w-4" />{deal.category}</span>
            <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{daysLeft} {t('days_left')}</span>
          </div>

          {biz && (
            <Link to={`/businesses/${biz.id}`} className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted transition-colors">
              <img src={biz.logoUrl} alt={biz.name} className="h-10 w-10 rounded-lg" />
              <div>
                <p className="font-medium text-foreground text-sm">{biz.name}</p>
                <p className="text-xs text-muted-foreground">{biz.category} · {biz.area}</p>
              </div>
            </Link>
          )}

          {deal.status === 'active' && (
            <Button onClick={handleJoin} disabled={alreadyJoined} size="lg" className="w-full bg-coral text-coral-foreground hover:bg-coral/90">
              {alreadyJoined ? <><CheckCircle2 className="mr-2 h-5 w-5" />{t('already_joined')}</> : <><Users className="mr-2 h-5 w-5" />{t('join_deal')}</>}
            </Button>
          )}

          {participants.length > 0 && (
            <div>
              <h3 className="font-semibold text-foreground mb-2">{t('participants')} ({participants.length})</h3>
              <div className="flex flex-wrap gap-2">
                {participants.map(p => {
                  const u = getUserById(p.userId);
                  return (
                    <Badge key={p.id} variant="secondary" className="text-xs">
                      {u?.name || 'User'} · {p.status}
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GroupDealDetail;
