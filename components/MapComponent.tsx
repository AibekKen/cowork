'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon, divIcon, latLngBounds } from 'leaflet';
import { useTranslations } from 'next-intl';
import { Coworking, LocalizedString } from '@/types/coworking';
import { Link } from '@/i18n/routing';
import Image from 'next/image';

// Custom thematic marker (Office Building)
const customIcon = divIcon({
  className: 'bg-transparent border-none',
  html: `
    <div class="relative flex items-center justify-center w-8 h-8 transition-transform duration-300 hover:scale-110 group">
      <div class="absolute inset-0 bg-emerald-500 rounded-xl shadow-lg shadow-emerald-500/40 rotate-45 group-hover:bg-emerald-400 transition-colors"></div>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="relative z-10 -rotate-0">
        <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
        <path d="M9 22v-4h6v4"></path>
        <path d="M8 6h.01"></path>
        <path d="M16 6h.01"></path>
        <path d="M12 6h.01"></path>
        <path d="M12 10h.01"></path>
        <path d="M12 14h.01"></path>
        <path d="M16 10h.01"></path>
        <path d="M16 14h.01"></path>
        <path d="M8 10h.01"></path>
        <path d="M8 14h.01"></path>
      </svg>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

const userIcon = divIcon({
  className: 'custom-user-marker',
  html: `
    <div class="relative flex items-center justify-center w-full h-full">
      <div class="absolute w-8 h-8 bg-blue-500 rounded-full opacity-30 animate-ping"></div>
      <div class="relative w-4 h-4 bg-blue-600 border-2 border-white rounded-full shadow-md"></div>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
});

interface MapComponentProps {
  coworkings: Coworking[];
  userLocation?: {lat: number, lng: number} | null;
  center?: [number, number];
  zoom?: number;
  className?: string;
  scrollWheelZoom?: boolean;
  touchZoom?: boolean;
}

function MapUpdater({ coworkings, userLocation }: { coworkings: Coworking[], userLocation?: {lat: number, lng: number} | null }) {
  const map = useMap();
  useEffect(() => {
    if (coworkings.length === 0 && !userLocation) return;
    
    const bounds = latLngBounds([]);
    if (userLocation) {
      bounds.extend([userLocation.lat, userLocation.lng]);
    }
    coworkings.forEach(c => {
      bounds.extend([c.coordinates.lat, c.coordinates.lng]);
    });
    
    if (bounds.isValid()) {
      map.flyToBounds(bounds, { padding: [50, 50], duration: 1.5, maxZoom: 14 });
    }
  }, [coworkings, userLocation, map]);
  return null;
}

export default function MapComponent({ 
  coworkings, 
  userLocation,
  center = [43.2389, 76.8897], // Default Almaty center
  zoom = 12,
  className = "w-full h-full min-h-[400px] rounded-2xl z-0",
  scrollWheelZoom = true,
  touchZoom = true
}: MapComponentProps) {
  const t = useTranslations('Card');
  // fallback if needed
  const getLocalized = (str: LocalizedString) => str['ru'] || str.ru; 
  
  const mapCenter = userLocation ? [userLocation.lat, userLocation.lng] as [number, number] : center;
  const mapZoom = userLocation ? 13 : zoom;

  return (
    <MapContainer 
      center={mapCenter} 
      zoom={mapZoom} 
      scrollWheelZoom={scrollWheelZoom}
      touchZoom={touchZoom}
      className={className}
    >
      <MapUpdater coworkings={coworkings} userLocation={userLocation} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {userLocation && (
        <Marker 
          position={[userLocation.lat, userLocation.lng]}
          icon={userIcon}
          zIndexOffset={1000}
        >
          <Popup>Вы здесь</Popup>
        </Marker>
      )}

      {coworkings.map((coworking) => (
        <Marker 
          key={coworking.id} 
          position={[coworking.coordinates.lat, coworking.coordinates.lng]}
          icon={customIcon}
        >
          <Popup className="rounded-xl overflow-hidden">
            <div className="w-[200px]">
              <div className="relative w-full h-[100px] mb-2 rounded-xl overflow-hidden mt-1">
                <Image 
                  src={coworking.photos[0]} 
                  alt={coworking.name} 
                  fill 
                  className="object-cover"
                />
              </div>
              <h3 className="font-bold text-base mb-1 text-center">{coworking.name}</h3>
              <p className="text-xs text-gray-500 mb-1 text-center line-clamp-1">{(coworking.address as any)['ru'] || coworking.address}</p>
              <p className="text-xs text-gray-900 font-medium mb-3 text-center">{coworking.priceFrom} ₸/день</p>
              <Link 
                href={`/coworkings/${coworking.slug}`}
                className="block w-full text-center bg-gray-100 hover:bg-gray-200 !text-gray-900 rounded-md py-1.5 text-sm font-bold transition-colors mb-2 shadow-sm"
              >
                {t('details')}
              </Link>
              <div className="flex gap-1">
                <a 
                  href={`https://2gis.kz/almaty/search/${encodeURIComponent((coworking.address as any)['ru'] || coworking.address)}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 text-center bg-[#a3c33b] !text-white rounded-md py-1.5 text-xs font-medium hover:bg-[#8da731] transition-colors"
                  title="2GIS"
                >
                  2GIS
                </a>
                <a 
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(((coworking.address as any)['ru'] || coworking.address) + ', Алматы')}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 text-center bg-blue-500 !text-white rounded-md py-1.5 text-xs font-medium hover:bg-blue-600 transition-colors"
                  title="Google Maps"
                >
                  Google
                </a>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
