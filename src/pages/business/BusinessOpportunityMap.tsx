import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, CircleMarker, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/i18n';
import { getBusinessByOwner, getNearbyEntities, getBuyerRequestById, getGroupDealById, businesses } from '@/data/mock';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Users, Building2, AlertTriangle } from 'lucide-react';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const BusinessOpportunityMap = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const biz = getBusinessByOwner(user?.id || '');
  
  const center: [number, number] = biz ? [biz.latitude, biz.longitude] : [30.0444, 31.2357];
  const nearby = useMemo(() => biz ? getNearbyEntities(biz.latitude, biz.longitude, 20, biz.category) : { buyer_requests: [], deals: [], businesses: [], listings: [] }, [biz]);
  const competitors = useMemo(() => biz ? businesses.filter(b => b.id !== biz.id && b.category === biz.category) : [], [biz]);

  if (!biz) return <div className="p-8 text-muted-foreground">{t('no_business_profile')}</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t('opportunity_map')}</h1>
        <p className="text-muted-foreground">{t('opportunity_map_desc')}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card><CardContent className="p-4 flex items-center gap-3">
          <FileText className="h-8 w-8 text-destructive" />
          <div><p className="text-2xl font-bold text-foreground">{nearby.buyer_requests.length}</p><p className="text-sm text-muted-foreground">{t('nearby_requests')}</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3">
          <Users className="h-8 w-8 text-gold" />
          <div><p className="text-2xl font-bold text-foreground">{nearby.deals.length}</p><p className="text-sm text-muted-foreground">{t('nearby_deals')}</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3">
          <AlertTriangle className="h-8 w-8 text-coral" />
          <div><p className="text-2xl font-bold text-foreground">{competitors.length}</p><p className="text-sm text-muted-foreground">{t('competitors')}</p></div>
        </CardContent></Card>
      </div>

      <div className="rounded-lg overflow-hidden border" style={{ height: '500px' }}>
        <MapContainer center={center} zoom={12} className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {/* Your business */}
          <Marker position={center}>
            <Popup><div className="text-sm"><p className="font-bold">📍 {biz.name}</p><p className="text-muted-foreground">Your location</p></div></Popup>
          </Marker>

          {/* Buyer requests */}
          {nearby.buyer_requests.map(e => {
            const r = getBuyerRequestById(e.entityId);
            return (
              <CircleMarker key={e.id} center={[e.latitude, e.longitude]} radius={7}
                pathOptions={{ color: '#dc2626', fillColor: '#dc2626', fillOpacity: 0.6 }}>
                <Popup><div className="text-sm"><p className="font-semibold">{r?.title || 'Request'}</p><p className="text-muted-foreground">{r?.area}</p></div></Popup>
              </CircleMarker>
            );
          })}

          {/* Deals */}
          {nearby.deals.map(e => {
            const d = getGroupDealById(e.entityId);
            return (
              <CircleMarker key={e.id} center={[e.latitude, e.longitude]} radius={9}
                pathOptions={{ color: '#d97706', fillColor: '#d97706', fillOpacity: 0.6 }}>
                <Popup><div className="text-sm"><p className="font-semibold">{d?.title || 'Deal'}</p><p>{d?.currentParticipants}/{d?.requiredParticipants} joined</p></div></Popup>
              </CircleMarker>
            );
          })}

          {/* Competitors */}
          {competitors.map(c => (
            <CircleMarker key={c.id} center={[c.latitude, c.longitude]} radius={7}
              pathOptions={{ color: '#6b7280', fillColor: '#6b7280', fillOpacity: 0.5 }}>
              <Popup><div className="text-sm"><p className="font-semibold">{c.name}</p><p className="text-muted-foreground">{c.area} · ⭐ {c.rating}</p></div></Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      <div className="flex flex-wrap gap-4 text-sm">
        <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-primary" /> {t('your_location')}</span>
        <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-destructive" /> {t('buyer_requests')}</span>
        <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-gold" /> {t('group_deals')}</span>
        <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full" style={{ backgroundColor: '#6b7280' }} /> {t('competitors')}</span>
      </div>
    </div>
  );
};

export default BusinessOpportunityMap;
