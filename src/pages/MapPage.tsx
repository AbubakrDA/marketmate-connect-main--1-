import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { businesses } from '@/data/mock';
import { useTranslation } from '@/i18n';

// Fix default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const MapPage = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col lg:flex-row" style={{ height: 'calc(100vh - 4rem)' }}>
      {/* Sidebar */}
      <div className="w-full overflow-y-auto border-b p-4 lg:w-80 lg:border-b-0 lg:border-r" style={{ maxHeight: '300px', height: 'auto' }}>
        <h2 className="text-lg font-bold text-foreground mb-3">{t('nearby_businesses')}</h2>
        <div className="space-y-3">
          {businesses.map(b => (
            <Link key={b.id} to={`/businesses/${b.id}`} className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted">
              <img src={b.logoUrl} alt={b.name} className="h-10 w-10 rounded-lg" />
              <div className="min-w-0">
                <p className="font-medium text-foreground text-sm truncate">{b.name}</p>
                <p className="text-xs text-muted-foreground">{b.category} · {b.area}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 min-h-[400px]">
        <MapContainer center={[30.0444, 31.2357]} zoom={11} className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {businesses.map(b => (
            <Marker key={b.id} position={[b.latitude, b.longitude]}>
              <Popup>
                <div className="text-sm">
                  <p className="font-semibold">{b.name}</p>
                  <p className="text-muted-foreground">{b.category}</p>
                  <Link to={`/businesses/${b.id}`} className="text-primary underline text-xs">{t('view_profile')}</Link>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapPage;
