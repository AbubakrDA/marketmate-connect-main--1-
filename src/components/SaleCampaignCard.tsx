import { useState } from 'react';
import { SaleCampaign } from '@/types';
import { getBusinessById, addSaleInterest, isUserInterestedInCampaign, notifications } from '@/data/mock';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Percent, Calendar, Building2, MapPin, Heart } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useTranslation } from '@/i18n';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

// Fix default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface Props {
  campaign: SaleCampaign;
}

export const SaleCampaignCard = ({ campaign }: Props) => {
  const biz = getBusinessById(campaign.businessId);
  const [mapOpen, setMapOpen] = useState(false);
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isInterested, setIsInterested] = useState(
    user ? isUserInterestedInCampaign(user.id, campaign.id) : false
  );

  const handleInterest = () => {
    if (!user) {
      toast.error(t('login_to_interest'));
      return;
    }
    if (isInterested) return;

    addSaleInterest({
      id: `si${Date.now()}`,
      campaignId: campaign.id,
      userId: user.id,
      userName: user.name,
      userPhone: user.phone,
      userEmail: user.email,
      createdAt: new Date().toISOString().split('T')[0],
    });

    // Add notification for the business owner
    if (biz) {
      notifications.push({
        id: `n${Date.now()}`,
        userId: biz.ownerUserId,
        title: t('sale_interests'),
        body: `${user.name} ${t('user_interested_in_sale')}: ${campaign.title}`,
        type: 'sale_interest',
        read: false,
        createdAt: new Date().toISOString().split('T')[0],
      });
    }

    setIsInterested(true);
    toast.success(t('interest_sent'));
  };

  return (
    <>
      <Card className="group overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
        {campaign.imageUrl && (
          <div className="relative aspect-[4/3] overflow-hidden">
            <img src={campaign.imageUrl} alt={campaign.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" loading="lazy" />
            <Badge className="absolute left-3 top-3 bg-coral text-coral-foreground">
              <Percent className="mr-1 h-3 w-3" />{campaign.discountPercent}% {t('off')}
            </Badge>
            <Badge variant="secondary" className="absolute right-3 top-3">{campaign.season}</Badge>
          </div>
        )}
        <CardContent className="p-4">
          <h3 className="font-semibold text-foreground line-clamp-1">{campaign.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{campaign.description}</p>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-foreground">{campaign.salePrice.toLocaleString()} {t('egp')}</span>
              <span className="text-sm text-muted-foreground line-through">{campaign.originalPrice.toLocaleString()}</span>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Building2 className="h-3 w-3" />{biz?.name}</span>
            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{t('ends')} {campaign.endDate}</span>
          </div>
          <div className="mt-3 flex gap-2">
            <Button
              size="sm"
              variant={isInterested ? 'default' : 'outline'}
              className={`flex-1 gap-2 text-xs ${isInterested ? 'bg-coral text-coral-foreground hover:bg-coral/90' : ''}`}
              onClick={handleInterest}
              disabled={isInterested}
            >
              <Heart className={`h-3.5 w-3.5 ${isInterested ? 'fill-current' : ''}`} />
              {isInterested ? t('interested') : t('im_interested')}
            </Button>
            {biz && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-2 text-xs"
                onClick={() => setMapOpen(true)}
              >
                <MapPin className="h-3.5 w-3.5" />
                {t('show_location')}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {biz && (
        <Dialog open={mapOpen} onOpenChange={setMapOpen}>
          <DialogContent className="max-w-lg p-0 overflow-hidden">
            <DialogHeader className="p-4 pb-2">
              <DialogTitle className="flex items-center gap-2 text-base">
                <MapPin className="h-4 w-4 text-coral" />
                {biz.name} — {campaign.title}
              </DialogTitle>
              <p className="text-xs text-muted-foreground">{biz.address}</p>
            </DialogHeader>
            <div className="h-[350px]">
              <MapContainer center={[biz.latitude, biz.longitude]} zoom={15} className="h-full w-full">
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[biz.latitude, biz.longitude]}>
                  <Popup>
                    <div className="text-sm">
                      <p className="font-semibold">{biz.name}</p>
                      <p className="text-xs">{biz.address}</p>
                      <p className="text-xs font-medium text-coral mt-1">{campaign.title} — {campaign.discountPercent}% {t('off')}</p>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
