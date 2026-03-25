import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useTranslation } from '@/i18n';
import { getNearbyEntities, getBusinessById, getListingById, getBuyerRequestById, getGroupDealById } from '@/data/mock';
import type { LocationEvent } from '@/data/mock';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Building2, Tag, FileText, Users, MapPin } from 'lucide-react';

// Fix default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const LAYER_COLORS: Record<string, string> = {
  business: '#1e40af',
  listing: '#059669',
  buyer_request: '#dc2626',
  deal: '#d97706',
};

const LAYER_ICONS = {
  business: Building2,
  listing: Tag,
  buyer_request: FileText,
  deal: Users,
};

const SmartMap = () => {
  const { t } = useTranslation();
  const [layers, setLayers] = useState({ business: true, listing: true, buyer_request: true, deal: true });
  const [selected, setSelected] = useState<LocationEvent | null>(null);

  const center: [number, number] = [30.0444, 31.2357];
  const data = useMemo(() => getNearbyEntities(center[0], center[1], 50), []);

  const allEvents = useMemo(() => [
    ...(layers.business ? data.businesses : []),
    ...(layers.listing ? data.listings : []),
    ...(layers.buyer_request ? data.buyer_requests : []),
    ...(layers.deal ? data.deals : []),
  ], [layers, data]);

  const toggleLayer = (key: string) => setLayers(l => ({ ...l, [key]: !l[key as keyof typeof l] }));

  const renderDetail = () => {
    if (!selected) return null;
    if (selected.entityType === 'business') {
      const b = getBusinessById(selected.entityId);
      if (!b) return null;
      return (
        <Card className="mt-3">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <img src={b.logoUrl} alt={b.name} className="h-10 w-10 rounded-lg" />
              <div>
                <p className="font-semibold text-foreground">{b.name}</p>
                <p className="text-xs text-muted-foreground">{b.category} · {b.area}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{b.description}</p>
            <Link to={`/businesses/${b.id}`}><Button size="sm" variant="outline" className="w-full">{t('view_profile')}</Button></Link>
          </CardContent>
        </Card>
      );
    }
    if (selected.entityType === 'listing') {
      const l = getListingById(selected.entityId);
      if (!l) return null;
      return (
        <Card className="mt-3">
          <CardContent className="p-4">
            <p className="font-semibold text-foreground">{l.title}</p>
            <p className="text-xs text-muted-foreground mb-1">{l.category} · {l.area}</p>
            <p className="font-bold text-foreground">{l.priceEgp} {t('egp')}</p>
            <Link to={`/listing/${l.id}`}><Button size="sm" variant="outline" className="w-full mt-2">{t('view_details')}</Button></Link>
          </CardContent>
        </Card>
      );
    }
    if (selected.entityType === 'buyer_request') {
      const r = getBuyerRequestById(selected.entityId);
      if (!r) return null;
      return (
        <Card className="mt-3">
          <CardContent className="p-4">
            <p className="font-semibold text-foreground">{r.title}</p>
            <p className="text-xs text-muted-foreground mb-1">{r.category} · {r.area}</p>
            <p className="text-sm text-muted-foreground line-clamp-2">{r.description}</p>
            {r.maxPrice && <p className="text-sm font-medium text-foreground mt-1">{t('max_budget')}: {r.maxPrice} {t('egp')}</p>}
          </CardContent>
        </Card>
      );
    }
    if (selected.entityType === 'deal') {
      const d = getGroupDealById(selected.entityId);
      if (!d) return null;
      const pct = Math.round((d.currentParticipants / d.requiredParticipants) * 100);
      return (
        <Card className="mt-3">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Badge className="bg-coral text-coral-foreground text-xs">{Math.round(((d.originalPrice - d.dealPrice) / d.originalPrice) * 100)}% {t('off')}</Badge>
              <Badge variant="outline" className="text-xs">{d.currentParticipants}/{d.requiredParticipants}</Badge>
            </div>
            <p className="font-semibold text-foreground">{d.title}</p>
            <p className="text-sm text-foreground font-bold">{d.dealPrice} {t('egp')} <span className="line-through text-muted-foreground font-normal">{d.originalPrice}</span></p>
            <Link to={`/group-deals/${d.id}`}><Button size="sm" className="w-full mt-2 bg-coral text-coral-foreground hover:bg-coral/90">{t('view_details')}</Button></Link>
          </CardContent>
        </Card>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col lg:flex-row" style={{ height: 'calc(100vh - 4rem)' }}>
      {/* Sidebar */}
      <div className="w-full overflow-y-auto border-b p-4 lg:w-80 lg:border-b-0 lg:border-r" style={{ maxHeight: '40vh', height: 'auto' }}>
        <h2 className="text-lg font-bold text-foreground mb-3">{t('smart_map')}</h2>
        <p className="text-sm text-muted-foreground mb-4">{t('smart_map_desc')}</p>

        {/* Layer toggles */}
        <div className="space-y-3 mb-4">
          {Object.entries(LAYER_ICONS).map(([key, Icon]) => (
            <div key={key} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: LAYER_COLORS[key] }} />
                <Icon className="h-4 w-4 text-muted-foreground" />
                <Label className="text-sm capitalize">{t(key === 'buyer_request' ? 'buyer_requests' : key === 'deal' ? 'group_deals' : key + 's')}</Label>
              </div>
              <Switch checked={layers[key as keyof typeof layers]} onCheckedChange={() => toggleLayer(key)} />
            </div>
          ))}
        </div>

        <div className="text-xs text-muted-foreground mb-3">
          {allEvents.length} {t('items_on_map')}
        </div>

        {renderDetail()}
      </div>

      {/* Map */}
      <div className="flex-1 min-h-[400px]">
        <MapContainer center={center} zoom={11} className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {allEvents.map(event => (
            <CircleMarker
              key={event.id}
              center={[event.latitude, event.longitude]}
              radius={event.entityType === 'business' ? 8 : event.entityType === 'deal' ? 10 : 6}
              pathOptions={{ color: LAYER_COLORS[event.entityType], fillColor: LAYER_COLORS[event.entityType], fillOpacity: 0.7, weight: 2 }}
              eventHandlers={{ click: () => setSelected(event) }}
            >
              <Popup>
                <div className="text-sm">
                  <p className="font-semibold capitalize">{event.entityType.replace('_', ' ')}</p>
                  <p className="text-muted-foreground">{event.category} · {event.area}</p>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default SmartMap;
