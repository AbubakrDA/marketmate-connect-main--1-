import { useAuth } from '@/context/AuthContext';
import {
  getBusinessByOwner, getBusinessFavoritesByBusiness, getUserById,
  addBusinessFavorite, removeBusinessFavorite, isBusinessFavorited,
  getListingsByBusiness, addSpecialOffer, getSpecialOffersByBusiness,
  users as allUsers, getFavoriteBusinessUsers,
} from '@/data/mock';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Star, Mail, Phone, Gift, Send, Plus, Trash2, Tag, Heart, MessageSquare } from 'lucide-react';
import { useTranslation } from '@/i18n';
import { useState } from 'react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const FavoriteCustomers = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const biz = getBusinessByOwner(user?.id || '');
  const [, refresh] = useState(0);
  const [discountDialog, setDiscountDialog] = useState<string | null>(null);
  const [addDialog, setAddDialog] = useState(false);
  const [discountTitle, setDiscountTitle] = useState('');
  const [discountMsg, setDiscountMsg] = useState('');
  const [discountPct, setDiscountPct] = useState('10');
  const [discountListing, setDiscountListing] = useState('');

  const bizFavs = biz ? getBusinessFavoritesByBusiness(biz.id) : [];
  const fansWhoFavoritedUs = biz ? getFavoriteBusinessUsers(biz.id) : [];
  const bizListings = biz ? getListingsByBusiness(biz.id) : [];
  const sentOffers = biz ? getSpecialOffersByBusiness(biz.id) : [];

  // Users not yet in favorites for the add dialog
  const availableUsers = allUsers.filter(u => u.role === 'user' && biz && !isBusinessFavorited(biz.id, u.id));

  const handleAddFavorite = (userId: string) => {
    if (!biz) return;
    addBusinessFavorite({
      id: `bf${Date.now()}`,
      businessId: biz.id,
      userId,
      createdAt: new Date().toISOString().split('T')[0],
    });
    setAddDialog(false);
    refresh(n => n + 1);
    toast.success(t('added_to_favorites'));
  };

  const handleRemoveFavorite = (userId: string) => {
    if (!biz) return;
    removeBusinessFavorite(biz.id, userId);
    refresh(n => n + 1);
    toast.success(t('removed_from_favorites'));
  };

  const handleSendDiscount = () => {
    if (!biz || !discountDialog) return;
    addSpecialOffer({
      id: `so${Date.now()}`,
      businessId: biz.id,
      targetUserIds: [discountDialog],
      title: discountTitle,
      message: discountMsg,
      discountPercent: parseInt(discountPct) || 10,
      listingId: discountListing || undefined,
      expiresAt: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      createdAt: new Date().toISOString().split('T')[0],
    });
    setDiscountDialog(null);
    setDiscountTitle('');
    setDiscountMsg('');
    setDiscountPct('10');
    setDiscountListing('');
    refresh(n => n + 1);
    toast.success(t('special_offer_sent'));
  };

  const handleSendToAll = () => {
    if (!biz || bizFavs.length === 0) return;
    addSpecialOffer({
      id: `so${Date.now()}`,
      businessId: biz.id,
      targetUserIds: bizFavs.map(f => f.userId),
      title: `${t('exclusive_offer_from')} ${biz.name}`,
      message: t('exclusive_offer_message'),
      discountPercent: 15,
      expiresAt: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      createdAt: new Date().toISOString().split('T')[0],
    });
    refresh(n => n + 1);
    toast.success(t('offer_sent_to_all_favorites'));
  };

  const renderUserCard = (userId: string, extra?: { note?: string; tags?: string[]; isBizFav?: boolean }) => {
    const u = getUserById(userId);
    if (!u) return null;
    return (
      <Card key={userId} className="transition-all hover:shadow-md">
        <CardContent className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
              {u.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground">{u.name}</h3>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Star className="h-3 w-3 text-gold fill-gold" />
                {u.rating || 'N/A'} ({u.reviewCount || 0} {t('reviews')})
              </div>
            </div>
          </div>
          <div className="space-y-1 text-sm text-muted-foreground">
            <p className="flex items-center gap-2"><Mail className="h-3 w-3" />{u.email}</p>
            <p className="flex items-center gap-2"><Phone className="h-3 w-3" />{u.phone}</p>
          </div>
          {extra?.note && (
            <p className="mt-2 text-xs text-muted-foreground italic bg-muted/50 rounded p-2">📝 {extra.note}</p>
          )}
          {extra?.tags && extra.tags.length > 0 && (
            <div className="mt-2 flex gap-1 flex-wrap">
              {extra.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-xs"><Tag className="h-3 w-3 mr-1" />{tag}</Badge>
              ))}
            </div>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            <Button size="sm" variant="default" onClick={() => {
              setDiscountDialog(userId);
              setDiscountTitle(`${t('special_discount_for')} ${u.name}`);
            }}>
              <Gift className="h-4 w-4 mr-1" />{t('send_discount')}
            </Button>
            <Button size="sm" variant="outline" asChild>
              <Link to="/business/chat"><MessageSquare className="h-4 w-4 mr-1" />{t('message')}</Link>
            </Button>
            {extra?.isBizFav && (
              <Button size="sm" variant="ghost" onClick={() => handleRemoveFavorite(userId)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">{t('favorite_customers')}</h1>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setAddDialog(true)}>
            <Plus className="h-4 w-4 mr-1" />{t('add_favorite')}
          </Button>
          {bizFavs.length > 0 && (
            <Button size="sm" onClick={handleSendToAll}>
              <Send className="h-4 w-4 mr-1" />{t('offer_all')}
            </Button>
          )}
        </div>
      </div>
      <p className="text-muted-foreground mb-6">{t('favorite_customers_desc')}</p>

      <Tabs defaultValue="my_favorites">
        <TabsList>
          <TabsTrigger value="my_favorites">
            <Heart className="h-4 w-4 mr-1" />{t('my_favorite_buyers')} ({bizFavs.length})
          </TabsTrigger>
          <TabsTrigger value="fans">
            <Star className="h-4 w-4 mr-1" />{t('fans_who_favorited_us')} ({fansWhoFavoritedUs.length})
          </TabsTrigger>
          <TabsTrigger value="sent_offers">
            <Gift className="h-4 w-4 mr-1" />{t('sent_offers')} ({sentOffers.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my_favorites" className="mt-4">
          {bizFavs.length === 0 ? (
            <Card><CardContent className="p-8 text-center">
              <Star className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">{t('no_favorite_customers')}</p>
              <Button className="mt-4" onClick={() => setAddDialog(true)}><Plus className="h-4 w-4 mr-1" />{t('add_favorite')}</Button>
            </CardContent></Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {bizFavs.map(fav => renderUserCard(fav.userId, { note: fav.note, tags: fav.tags, isBizFav: true }))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="fans" className="mt-4">
          {fansWhoFavoritedUs.length === 0 ? (
            <Card><CardContent className="p-8 text-center">
              <Heart className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">{t('no_fans_yet')}</p>
            </CardContent></Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {fansWhoFavoritedUs.map(fav => renderUserCard(fav.userId))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="sent_offers" className="mt-4">
          {sentOffers.length === 0 ? (
            <Card><CardContent className="p-8 text-center">
              <Gift className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">{t('no_special_offers_sent')}</p>
            </CardContent></Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {sentOffers.map(offer => (
                <Card key={offer.id}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-foreground">{offer.title}</h3>
                      <Badge className="bg-success/10 text-success border-success/20">{offer.discountPercent}% off</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{offer.message}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{t('sent_to')}: {offer.targetUserIds.length} {t('users')}</span>
                      <span>•</span>
                      <span>{t('expires')}: {offer.expiresAt}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Send Discount Dialog */}
      <Dialog open={!!discountDialog} onOpenChange={() => setDiscountDialog(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle><Gift className="inline h-5 w-5 mr-2" />{t('send_special_discount')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div><Label>{t('offer_title')}</Label><Input value={discountTitle} onChange={e => setDiscountTitle(e.target.value)} /></div>
            <div><Label>{t('message')}</Label><Textarea value={discountMsg} onChange={e => setDiscountMsg(e.target.value)} placeholder={t('special_offer_message_placeholder')} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>{t('discount_percent')}</Label><Input type="number" min="1" max="90" value={discountPct} onChange={e => setDiscountPct(e.target.value)} /></div>
              <div>
                <Label>{t('link_listing')}</Label>
                <Select value={discountListing} onValueChange={setDiscountListing}>
                  <SelectTrigger><SelectValue placeholder={t('optional')} /></SelectTrigger>
                  <SelectContent>
                    {bizListings.map(l => <SelectItem key={l.id} value={l.id}>{l.title}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button className="w-full" onClick={handleSendDiscount} disabled={!discountTitle}>
              <Send className="h-4 w-4 mr-2" />{t('send_discount')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Favorite Dialog */}
      <Dialog open={addDialog} onOpenChange={setAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle><Plus className="inline h-5 w-5 mr-2" />{t('add_to_favorites')}</DialogTitle>
          </DialogHeader>
          {availableUsers.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">{t('all_users_favorited')}</p>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {availableUsers.map(u => (
                <Card key={u.id} className="cursor-pointer hover:shadow-md transition-all" onClick={() => handleAddFavorite(u.id)}>
                  <CardContent className="flex items-center gap-3 p-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm">
                      {u.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground text-sm">{u.name}</p>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                    </div>
                    <Plus className="h-4 w-4 text-primary" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FavoriteCustomers;