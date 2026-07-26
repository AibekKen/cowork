'use client';

import dynamic from 'next/dynamic';
import { Coworking } from '@/types/coworking';

const MapComponent = dynamic(() => import('./MapComponent'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-100 flex items-center justify-center animate-pulse">
      <span className="text-gray-400 font-medium text-sm">Загрузка карты...</span>
    </div>
  )
});

interface ClientMapProps {
  coworkings: Coworking[];
  center?: [number, number];
  zoom?: number;
  className?: string;
  scrollWheelZoom?: boolean;
  touchZoom?: boolean;
}

export default function ClientMap(props: ClientMapProps) {
  return <MapComponent {...props} scrollWheelZoom={true} touchZoom={true} />;
}
