'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import { useTranslations } from 'next-intl';
import { Coworking, LocalizedString } from '@/types/coworking';
import Link from 'next/link';
import Image from 'next/image';

// Fix for default marker icon in Next.js + Leaflet
const customIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface MapComponentProps {
  coworkings: Coworking[];
  center?: [number, number];
  zoom?: number;
  className?: string;
}

export default function MapComponent({ 
  coworkings, 
  center = [43.2389, 76.8897], // Default Almaty center
  zoom = 12,
  className = "w-full h-full min-h-[400px] rounded-2xl z-0"
}: MapComponentProps) {
  const t = useTranslations('Card');
  // fallback if needed
  const getLocalized = (str: LocalizedString) => str['ru'] || str.ru; 
  return (
    <MapContainer 
      center={center} 
      zoom={zoom} 
      scrollWheelZoom={false}
      className={className}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {coworkings.map((coworking) => (
        <Marker 
          key={coworking.id} 
          position={[coworking.coordinates.lat, coworking.coordinates.lng]}
          icon={customIcon}
        >
          <Popup className="rounded-xl overflow-hidden">
            <div className="w-[200px]">
              <div className="relative w-full h-[100px] -mt-4 -mx-5 mb-2">
                <Image 
                  src={coworking.photos[0]} 
                  alt={coworking.name} 
                  fill 
                  className="object-cover"
                />
              </div>
              <h3 className="font-bold text-base mb-1">{coworking.name}</h3>
              <p className="text-xs text-gray-500 mb-2">{coworking.priceFrom} ₸/день</p>
              <Link 
                href={`/coworkings/${coworking.slug}`}
                className="block w-full text-center bg-gray-100 text-gray-800 rounded-md py-1.5 text-sm font-medium hover:bg-gray-200 transition-colors mb-1"
              >
                {t('details')}
              </Link>
              <div className="flex gap-1">
                <a 
                  href={`https://2gis.kz/almaty/search/${coworking.coordinates.lat},${coworking.coordinates.lng}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 text-center bg-[#a3c33b] text-white rounded-md py-1.5 text-xs font-medium hover:bg-[#8da731] transition-colors"
                  title="2GIS"
                >
                  2GIS
                </a>
                <a 
                  href={`https://www.google.com/maps/dir/?api=1&destination=${coworking.coordinates.lat},${coworking.coordinates.lng}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 text-center bg-blue-500 text-white rounded-md py-1.5 text-xs font-medium hover:bg-blue-600 transition-colors"
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
